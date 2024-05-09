import button from "@/styles/components/Button.module.css";
import { signIn } from "@/utils/actions";
import { createClient } from "@/utils/supabase/server";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <main>
      {!data.user ? (
        <form action={signIn}>
          <button type="submit" className={button.primaryBtn}>
            Get started with GitHub <IconChevronRight size={16} />
          </button>
        </form>
      ) : (
        <Link href="/app" className={button.primaryBtn}>
          Continue to dashboard <IconChevronRight size={16} />
        </Link>
      )}
    </main>
  );
}
