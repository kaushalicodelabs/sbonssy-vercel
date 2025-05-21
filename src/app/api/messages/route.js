import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import User from "@/models/User";

export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const user1 = searchParams.get("user1");
  const user2 = searchParams.get("user2");

  if (!user1 || !user2) {
    return new Response(
      JSON.stringify({ error: "Both user IDs are required" }),
      { status: 400 }
    );
  }

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    await Message.updateMany(
      {
        receiver: user1,
        sender: user2,
        read: false,
      },
      { $set: { read: true } }
    );

    return new Response(
      JSON.stringify(
        messages.map((msg) => ({
          _id: msg._id,
          senderId: msg.sender,
          receiverId: msg.receiver,
          content: msg.content,
          timestamp: msg.createdAt,
          read: msg.read,
        }))
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch messages" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  await connectDB();

  try {
    const { senderId, receiverId, content } = await request.json();

    if (!senderId || !receiverId || !content) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Validate users
    const senderExists = await User.exists({ _id: senderId });
    const receiverExists = await User.exists({ _id: receiverId });
    if (!senderExists || !receiverExists) {
      return new Response(JSON.stringify({ error: "Invalid user IDs" }), {
        status: 400,
      });
    }

    // Save message
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      createdAt: new Date(),
      read: false,
    });
    const savedMessage = await newMessage.save();

    // Update or create conversation
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

    return new Response(
      JSON.stringify({
        _id: savedMessage._id,
        senderId: savedMessage.sender,
        receiverId: savedMessage.receiver,
        content: savedMessage.content,
        timestamp: savedMessage.createdAt,
        read: savedMessage.read,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving message:", error);
    return new Response(JSON.stringify({ error: "Failed to save message" }), {
      status: 500,
    });
  }
}
