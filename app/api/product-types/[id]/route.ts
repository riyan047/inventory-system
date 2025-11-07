import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const parsedId = parseInt(id, 10);

    console.log("🗑 Deleting product type with ID:", parsedId);

    await prisma.product.deleteMany({
      where: { productTypeId: parsedId },
    });

    await prisma.productType.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({
      message: "✅ Product type deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting product type:", error);
    return NextResponse.json(
      { error: "❌ Failed to delete product type" },
      { status: 500 }
    );
  }
}
