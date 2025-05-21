import AcceptedSportsCollaboration from "@/components/AcceptedSportsCollaboration";
import AllCollaborationBrand from "@/components/AllCollaborationBrand";
import SportsAmbassadorsClient from "@/components/SportsAmbassadorsClient";
import { cookies } from "next/headers";

const SportsAmbassadors = async () => {
  const cookieStore = await cookies();

  const [ambassadorsRes, requestsRes, collaborationsRes] = await Promise.all([
    fetch(`${process.env.NEXTAUTH_URL}/api/brand/sports-ambassador`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    }),
    fetch(`${process.env.NEXTAUTH_URL}/api/brand/sports-ambassador/requests`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    }),
    fetch(
      `${process.env.NEXTAUTH_URL}/api/brand/sports-ambassador/collaborations`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      }
    ),
  ]);

  const { data, total } = await ambassadorsRes.json();

  const requests = await requestsRes.json();
  const { data: collaborations, total: total2 } =
    await collaborationsRes.json();

  return (
    <AllCollaborationBrand
      ambassadors={data}
      totalAmbassadors={total}
      initialRequests={requests}
      collaborations={collaborations}
      totalCollaborations={total2}
    />
  );
};

export default SportsAmbassadors;
