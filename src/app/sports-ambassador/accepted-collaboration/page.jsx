import AcceptedBrandCollaboration from "@/components/AcceptedCollaborationBrand";
import { cookies } from "next/headers";

const AcceptedCollaboration = async ({ searchParams }) => {
  const page = parseInt(searchParams.page || "1", 10);

  const limit = 1;
  const cookieStore = await cookies();

  const AcceptedRes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/sports/accepted-collaboration?page=${page}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    }
  );

  const { data, total } = await AcceptedRes.json();

  return (
    <AcceptedBrandCollaboration
      acceptedRes={data}
      currentPage={page}
      limit={limit}
      total={total}
    />
  );
};

export default AcceptedCollaboration;
