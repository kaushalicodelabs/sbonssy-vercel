import CollaborationInviteClient from "@/components/CollaborationInvite";
import { cookies } from "next/headers";

const AllCollaborationInvites = async ({ searchParams }) => {
  const page = parseInt(searchParams.page || "1", 10);

  const limit = 10;
  const cookieStore = await cookies();

  const invitesRes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/sports/collaboration-invite?page=${page}`,
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

  const { data, total } = await invitesRes.json();
  console.log("data", data);
  const requests = await requestsRes.json();

  return (
    <CollaborationInviteClient
      invites={data}
      total={total}
      currentPage={page}
      limit={limit}
      initialRequests={requests}
    />
  );
};

export default AllCollaborationInvites;
