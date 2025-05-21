import SportsAmbassadorsClient from "@/components/SportsAmbassadorsClient";
import { cookies } from "next/headers";

const SportsAmbassadors = async ({ searchParams }) => {
  const page = parseInt(searchParams.page || "1", 10);

  const limit = 10;
  const cookieStore = await cookies();

  const [ambassadorsRes, requestsRes, collaborationsRes] = await Promise.all([
    fetch(
      `${process.env.NEXTAUTH_URL}/api/brand/sports-ambassador?page=${page}`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      }
    ),
    fetch(`${process.env.NEXTAUTH_URL}/api/brand/sports-ambassador/requests`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    }),
  ]);

  const { data, total } = await ambassadorsRes.json();

  const requests = await requestsRes.json();

  return (
    <SportsAmbassadorsClient
      ambassadors={data}
      total={total}
      initialRequests={requests}
      currentPage={page}
      limit={limit}
    />
  );
};

export default SportsAmbassadors;
