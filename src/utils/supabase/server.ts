import "server-only";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Database } from "./types";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function getUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/");

  return { supabase, user: data.user };
}

export async function getLists() {
  const { supabase, user } = await getUser();

  return await supabase
    .from("lists")
    .select()
    .eq("owner_id", user.id)
    .order("name");
}

export async function getList(listId: string) {
  const { supabase } = await getUser();

  return await supabase.from("lists").select().eq("id", listId).single();
}

export async function getFoods(listId: string) {
  const { supabase } = await getUser();

  return await supabase
    .from("foods")
    .select()
    .eq("list_id", listId)
    .order("name")
    .order("quantity", { ascending: false });
}
