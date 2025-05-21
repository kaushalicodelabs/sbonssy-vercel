import AcceptedSportsCollaboration from "@/components/AcceptedSportsCollaboration";
import TeamInvites from "@/components/TeamInvites";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const AcceptedTeamInvitesList = async ({ searchParams }) => {
  const page = parseInt(searchParams.page || "1", 10);

  const limit = 10;
  const cookieStore = cookies();

  const acceptedRes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/teams/invites/accepted?page=${page}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    }
  );
  const { data: accepted, total } = await acceptedRes.json();

  return (
    <AcceptedSportsCollaboration
      acceptedRes={accepted}
      total={total}
      currentPage={1}
      limit={limit}
      route={`/sports-sports-ambassador/accepted-team-invites`}
    />
  );
};

export default AcceptedTeamInvitesList;
