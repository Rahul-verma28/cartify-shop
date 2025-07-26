import CategoryForm from "@/components/admin/category-form";

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  return <CategoryForm mode="edit" categoryId={id} />;
}