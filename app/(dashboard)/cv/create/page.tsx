"use client";

import { useSearchParams } from "next/navigation";
import CVEditor from "../_components/CVEditor";

export default function CreateCVPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  return <CVEditor mode="create" initialTemplateId={templateId} />;
}


