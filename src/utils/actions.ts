"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient, getUser } from "./supabase/server";
import { validateList } from "./validators";

// Auth
export async function signIn() {
  const supabase = createClient();
  const origin = headers().get("origin");

  const { data } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/auth/callback?next=/app`,
    },
  });

  if (data.url) redirect(data.url);
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

// Lists
export async function createList(data: unknown) {
  const { supabase, user } = await getUser();
  const validated = validateList.safeParse(data);

  if (!validated.success) {
    let error = "";
    for (const { message } of validated.error.issues) error += `${message}. `;
    return { error };
  }

  const { data: list, error } = await supabase
    .from("lists")
    .insert({ ...validated.data, owner_id: user.id })
    .select("name")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/app");
  return { listName: list.name };
}

export async function updateList(listId: string, data: unknown) {
  const { supabase } = await getUser();
  const validated = validateList.safeParse(data);

  if (!validated.success) {
    let error = "";
    for (const { message } of validated.error.issues) error += `${message}. `;
    return { error };
  }

  const { data: list, error } = await supabase
    .from("lists")
    .update({ ...validated.data })
    .eq("id", listId)
    .select("name")
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/app?id=${listId}`);
  return { listName: list.name };
}

export async function deleteList(listId: string) {
  const { supabase } = await getUser();
  const { error } = await supabase.from("lists").delete().eq("id", listId);
  if (error) return { error: error.message };

  redirect("/app");
}
