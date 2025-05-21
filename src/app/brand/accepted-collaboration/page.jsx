import AcceptedSportsCollaboration from "@/components/AcceptedSportsCollaboration";

import { cookies } from "next/headers";

const AcceptedSportsAmbassadors = async ({ searchParams }) => {
  const page = parseInt(searchParams.page || "1", 10);

  const limit = 10;
  const cookieStore = await cookies();

  const collabRes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/brand/sports-ambassador/collaborations?page=${page}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    }
  );

  const { data, total } = await collabRes.json();

  return (
    <AcceptedSportsCollaboration
      acceptedRes={data}
      total={total}
      currentPage={page}
      limit={limit}
      route={`/brand/accepted-collaboration`}
    />
  );
};

export default AcceptedSportsAmbassadors;
