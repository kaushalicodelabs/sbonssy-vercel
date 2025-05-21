import AcceptedSportsCollaboration from "@/components/AcceptedSportsCollaboration";
import AllCollaborationInvites from "@/components/AllcollaborationInvites";
import CollaborationInviteClient from "@/components/CollaborationInvite";
import { cookies } from "next/headers";

const CollaborationInvitesPage = async ({ searchParams }) => {
  const cookieStore = await cookies();

  const invitesRes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/sports/collaboration-invite`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    }
  );

  const requestsRes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/sports/collaboration-invite/requests`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    }
  );
  const acceptedRes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/sports/collaboration-invite/accepted`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    }
  );
  const { data, total } = await invitesRes.json();
  const requests = await requestsRes.json();
  const { data: acceptedRequests, total: total2 } = await acceptedRes.json();

  return (
    <AllCollaborationInvites
      // Invites props
      invites={data}
      invitesTotal={total}
      initialRequests={requests}
      // Accepted collaborations props
      acceptedRes={acceptedRequests}
      acceptedTotal={total2}
    />
  );
};

export default CollaborationInvitesPage;
