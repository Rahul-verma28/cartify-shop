import React from "react";
import CollectionForm from "@/components/admin/collection-form";

interface EditCollectionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
  const { id } = await params;
  return <CollectionForm mode="edit" collectionId={id} />;
}
