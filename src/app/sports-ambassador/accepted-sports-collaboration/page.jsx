import AcceptedSportsCollaboration from "@/components/AcceptedSportsCollaboration";

import { cookies } from "next/headers";

const AcceptedSportCollaborationInvites = async ({ searchParams }) => {
  const page = parseInt(searchParams.page || "1", 10);

  const limit = 10;
  const cookieStore = await cookies();

  const acceptedRes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/sports/collaboration-invite/accepted?page=${page}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    }
  );

  const { data: acceptedRequests, total } = await acceptedRes.json();

  return (
    <AcceptedSportsCollaboration
      acceptedRes={acceptedRequests}
      total={total}
      currentPage={1}
      limit={limit}
      route={"/sports-ambassador/accepted-sports-collaboration"}
    />
  );
};

export default AcceptedSportCollaborationInvites;

// AcceptedSportCollaborationInvites;
