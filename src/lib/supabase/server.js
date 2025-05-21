import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function createClient() {
  const cookieStore = await cookies();
  console.log(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  return createServerClient(
    "https://xnyaonbulqqqerinkwei.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueWFvbmJ1bHFxcWVyaW5rd2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI1NDIsImV4cCI6MjA2MDQ2ODU0Mn0.-zR5t9NdPcDisJcjhAQEuYImu2SBo_Pq0PLo3gapMhc",
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore errors in Server Components
          }
        },
      },
    }
  );
}
