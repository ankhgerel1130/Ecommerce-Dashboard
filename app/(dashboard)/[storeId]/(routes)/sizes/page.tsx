import { SizesClient } from "./components/client";
import prismadb from "@/lib/prismadb";
import { SizeColumn } from "./components/columns";
import { format } from "date-fns";

interface SizesPageProps {
  params?: { storeId?: string }; 
}

const SizesPage = async ({ params }: SizesPageProps) => {
  const storeId = params?.storeId; // paramsru safe oroh

  if (!storeId) {
    return <div>Error: Store ID is missing.</div>;
  }

  const sizes = await prismadb.size.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "yyyy - MMMM - do"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
