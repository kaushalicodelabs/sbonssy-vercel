const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { connectDB } = require("./src/lib/db");
const { default: Message } = require("./src/models/Message");
const { default: Conversation } = require("./src/models/Conversation");
const { default: User } = require("./src/models/User");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  await connectDB();

  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal server error");
    }
  });

  const io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join-user-room", (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
      }
    });

    socket.on("send-message", async (messageData) => {
      try {
        const { senderId, receiverId, content, tempId } = messageData;

        if (!senderId || !receiverId || !content) {
          throw new Error("Invalid message data");
        }

        const [sender, receiver] = await Promise.all([
          User.findById(senderId),
          User.findById(receiverId),
        ]);

        if (!sender || !receiver) {
          throw new Error("Invalid user IDs");
        }

        const newMessage = new Message({
          sender: senderId,
          receiver: receiverId,
          content,
          createdAt: new Date(),
          read: false,
        });

        const savedMessage = await newMessage.save();

        let conversation = await Conversation.findOne({
          participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
          conversation = new Conversation({
            participants: [senderId, receiverId],
            lastMessage: savedMessage._id,
            updatedAt: new Date(),
          });
        } else {
          conversation.lastMessage = savedMessage._id;
          conversation.updatedAt = new Date();
        }
        await conversation.save();

        const messageToSend = {
          _id: savedMessage._id,
          senderId: savedMessage.sender,
          receiverId: savedMessage.receiver,
          content: savedMessage.content,
          timestamp: savedMessage.createdAt,
          read: savedMessage.read,
          tempId, // Include tempId to help client reconcile
        };

        // Emit to both participants in a single operation
        io.to(receiverId).to(senderId).emit("receive-message", messageToSend);
      } catch (error) {
        console.error("Message send error:", error);
        socket.emit("message-error", {
          tempId,
          message: error.message || "Failed to send message",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
