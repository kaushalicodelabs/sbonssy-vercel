import TeamInvites from "@/components/TeamInvites";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const AllTeamInvitesList = async ({ searchParams }) => {
  const page = parseInt(searchParams.page || "1", 10);

  const limit = 10;
  const cookieStore = cookies();

  const fetchInvites = async () => {
    const invitesRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/teams/invites?page=${page}`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      }
    );
    return await invitesRes.json();
  };

  const initialData = await fetchInvites();
  const { data = [], total = 0 } = initialData;

  // This will be passed to the TeamInvites component
  const handleActionComplete = async () => {
    // This will automatically re-run when an action is completed
    "use server";
    revalidatePath(`/sports-ambassador/team-invites?page=${page}`);
    // The parent component will re-render with fresh data
  };

  return (
    <TeamInvites
      invites={data}
      total={total}
      currentPage={page}
      limit={limit}
      onActionComplete={handleActionComplete}
    />
  );
};

export default AllTeamInvitesList;
