"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SubmitBeliefModal } from "./SubmitThesisModal";
import { cn } from "@/lib/utils";

export function NewBeliefButton({
  className,
  label = "New Belief",
}: {
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className={cn("btn-primary h-10 px-5", className)}>
        <Plus className="h-4 w-4" />
        {label}
      </button>
      <SubmitBeliefModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
