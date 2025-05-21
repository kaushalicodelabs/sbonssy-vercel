import { connectDB } from "@/lib/db";
import Conversation from "@/models/Conversation";

export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
    });
  }

  try {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "participants",
        select:
          "_id email role athlete team influencer brand exAthlete paraAthlete coach fan images",
      })
      .populate({
        path: "lastMessage",
        select: "content sender receiver createdAt",
      })
      .sort({ updatedAt: -1 });

    const formattedConversations = conversations.map((conv) => {
      const participant = conv.participants.find(
        (p) => p._id.toString() !== userId
      );

      let participantData = {};
      if (participant) {
        participantData = participant[participant.role] || {};
      }

      return {
        _id: conv._id,
        participant: {
          _id: participant?._id || null,
          name: participantData?.name || participant?.email || "Unknown",
          role: participant?.role || "unknown",
          images: participant?.images || [],
          ...participantData,
        },
        lastMessage: conv.lastMessage
          ? {
              content: conv.lastMessage.content,
              timestamp: conv.lastMessage.createdAt,
              senderId: conv.lastMessage.sender,
              receiverId: conv.lastMessage.receiver,
            }
          : null,
      };
    });

    return new Response(JSON.stringify(formattedConversations), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch conversations" }),
      {
        status: 500,
      }
    );
  }
}
