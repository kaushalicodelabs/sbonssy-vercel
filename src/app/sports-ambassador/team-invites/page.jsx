// import AcceptedSportsCollaboration from "@/components/AcceptedSportsCollaboration";
// import TeamInvites from "@/components/TeamInvites";
// import { revalidatePath } from "next/cache";
// import { cookies } from "next/headers";

// const TeamInvitesList = async ({ searchParams }) => {
//   const page = parseInt(searchParams.page || "1", 10);

//   const limit = 10;
//   const cookieStore = cookies();

//   const fetchInvites = async () => {
//     const invitesRes = await fetch(
//       `${process.env.NEXTAUTH_URL}/api/teams/invites?page=${page}`,
//       {
//         headers: {
//           Cookie: cookieStore.toString(),
//         },
//         cache: "no-store",
//       }
//     );
//     return await invitesRes.json();
//   };

//   const initialData = await fetchInvites();
//   const { data = [], total = 0 } = initialData;

//   // This will be passed to the TeamInvites component
//   const handleActionComplete = async () => {
//     // This will automatically re-run when an action is completed
//     "use server";
//     revalidatePath(`/sports-ambassador/team-invites?page=${page}`);
//     // The parent component will re-render with fresh data
//   };
//   const acceptedRes = await fetch(
//     `${process.env.NEXTAUTH_URL}/api/teams/invites/accepted`,
//     {
//       headers: {
//         Cookie: cookieStore.toString(),
//       },
//       cache: "no-store",
//     }
//   );
//   const { data: accepted, total: total2 } = await acceptedRes.json();
//   console.log(accepted, "accepted");
//   return (
//     // <>
//     //   <TeamInvites
//     //     invites={data}
//     //     total={total}
//     //     currentPage={page}
//     //     limit={limit}
//     //     onActionComplete={handleActionComplete}
//     //   />
//     //   <AcceptedSportsCollaboration
//     //     acceptedRes={accepted}
//     //     total={total2}
//     //     currentPage={1}
//     //     limit={limit}
//     //   />
//     // </>
//   );
// };

// export default TeamInvitesList;
import AllTeamCollaborationRequests from "@/components/AllTeamCollaborationRequests";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const TeamInvitesList = async ({ searchParams }) => {
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

  const fetchAccepted = async () => {
    const acceptedRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/teams/invites/accepted`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      }
    );
    return await acceptedRes.json();
  };

  const [initialData, acceptedData] = await Promise.all([
    fetchInvites(),
    fetchAccepted(),
  ]);

  const { data: invites = [], total: totalInvites = 0 } = initialData;
  const { data: accepted = [], total: totalAccepted = 0 } = acceptedData;

  const handleActionComplete = async () => {
    "use server";
    revalidatePath(`/sports-ambassador/team-invites?page=${page}`);
  };

  return (
    <AllTeamCollaborationRequests
      invites={invites}
      accepted={accepted}
      totalInvites={totalInvites}
      totalAccepted={totalAccepted}
      onActionComplete={handleActionComplete}
    />
  );
};

export default TeamInvitesList;
