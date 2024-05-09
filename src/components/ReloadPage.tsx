"use client";

import button from "@/styles/components/Button.module.css";
import { IconReload } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function ReloadPage() {
  const router = useRouter();

  return (
    <button onSubmit={() => router.refresh()} className={button.secondaryBtn}>
      Reload page <IconReload size={16} />
    </button>
  );
}
