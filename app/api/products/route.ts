import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return new Response("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { name, productTypeId, attributes } = body;

    // ✅ Validate required fields
    if (!name || !productTypeId || !attributes) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400 }
      );
    }

    // ✅ Create new product
    const created = await prisma.product.create({
      data: {
        name: name.trim(), // ensure trimmed, not empty
        productTypeId: Number(productTypeId),
        attributes,
      },
      include: {
        productType: true,
      },
    });

    return Response.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create product." }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { productType: true },
      orderBy: {
        createdAt: "desc", // ✅ newest first
      },
    });

    return Response.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch products." }),
      { status: 500 }
    );
  }
}
