"use client";

import { useParams } from "next/navigation";
import CVEditor from "../../_components/CVEditor";

export default function EditCVPage() {
  const params = useParams<{ id: string }>();

  return <CVEditor mode="edit" cvId={params.id} />;
}


