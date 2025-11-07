"use client";

import { useEffect, useState } from "react";
import Button from "@/app/components/Button";
import PageContainer from "@/app/components/PageContainer";
import Link from "next/link";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [productTypes, setProductTypes] = useState<any[]>([]);
    const [selectedType, setSelectedType] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch all products & product types
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, typeRes] = await Promise.all([
                    fetch("/api/products"),
                    fetch("/api/product-types"),
                ]);
                const prods = await prodRes.json();
                const types = await typeRes.json();

                setProducts(prods);
                setFiltered(prods);
                setProductTypes(types);
            } catch (error) {
                console.error("Error fetching products:", error);
                alert("⚠️ Failed to load products.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter products when search or type changes
    useEffect(() => {
        let result = products;

        // Filter by type
        if (selectedType !== "all") {
            result = result.filter((p) => p.productTypeId === Number(selectedType));
        }

        // Filter by search term
        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(term) ||
                    JSON.stringify(p.attributes).toLowerCase().includes(term)
            );
        }

        setFiltered(result);
    }, [searchTerm, selectedType, products]);

    return (
        <PageContainer title="Product Inventory">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div className="flex flex-wrap gap-3">
                    <Link href="/">
                        <Button variant="secondary">← Back to Home</Button>
                    </Link>
                    <Link href="/admin/add-product">
                        <Button variant="primary">+ Add Product</Button>
                    </Link>
                </div>

                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="all">All Product Types</option>
                        {productTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Search by name or attribute..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 flex-1 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none min-w-[200px]"
                    />

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedType("all");
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <p className="text-gray-500 text-center py-6">Loading products...</p>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100 border-b border-gray-200 text-gray-800">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Attributes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                                    >
                                        <td className="p-3">{p.id}</td>
                                        <td className="p-3 font-medium text-gray-900">{p.name}</td>
                                        <td className="p-3">{p.productType?.name || "—"}</td>
                                        <td className="p-3">
                                            <pre className="bg-gray-50 border border-gray-200 rounded-md p-2 text-xs text-gray-800 overflow-x-auto max-h-40">
                                                {JSON.stringify(p.attributes, null, 2)}
                                            </pre>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center text-gray-500 py-6 italic"
                                    >
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </PageContainer>
    );
}
