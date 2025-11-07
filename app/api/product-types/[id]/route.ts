import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Works in Next.js 16 (Turbopack / Edge runtime)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 👇 unwrap the dynamic [id] value from the URL
    const { id } = await context.params;
    const parsedId = parseInt(id, 10);

    console.log("🗑 Deleting product type with ID:", parsedId);

    // 1️⃣ Delete all products linked to this product type
    await prisma.product.deleteMany({
      where: { productTypeId: parsedId },
    });

    // 2️⃣ Delete the product type itself
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
