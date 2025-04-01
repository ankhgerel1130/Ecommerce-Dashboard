import { ColorsClient } from "./components/client";
import prismadb from "@/lib/prismadb";
import { ColorColumn } from "./components/columns";
import {format} from "date-fns";


interface ColorsPageProps {
  params: {
    storeId: string;
  };
}

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = await params; // ✅ Await params before use

  const colors = await prismadb.color.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" }
  });


  const formattedColors: ColorColumn[] = colors.map((item) => ({

    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "yyyy - MMMM - do")
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;