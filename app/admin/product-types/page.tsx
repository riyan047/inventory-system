"use client";

import { useState, useEffect } from "react";
import Button from "@/app/components/Button";
import PageContainer from "@/app/components/PageContainer";
import Link from "next/link";

export default function ManageProductTypes() {
    const [productTypes, setProductTypes] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [schemaText, setSchemaText] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch all product types
    useEffect(() => {
        const fetchTypes = async () => {
            const res = await fetch("/api/product-types");
            const data = await res.json();
            setProductTypes(data);
            setLoading(false);
        };
        fetchTypes();
    }, []);

    // Add a new product type
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            const parsedSchema = JSON.parse(schemaText);
            const res = await fetch("/api/product-types", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, schema: parsedSchema }),
            });

            if (res.ok) {
                const newType = await res.json();
                setProductTypes((prev) => [...prev, newType]); // ✅ instant update
                setName("");
                setSchemaText("");
                setMessage("✅ Product type added successfully!");
            } else {
                setMessage("❌ Failed to add product type.");
            }
        } catch {
            setMessage("⚠️ Invalid JSON schema format.");
        }
    };

    // Delete a product type
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product type?")) return;

        const res = await fetch(`/api/product-types/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setProductTypes((prev) => prev.filter((pt) => pt.id !== id));
            setMessage("✅ Product type deleted successfully!");
        } else {
            setMessage("❌ Failed to delete product type.");
        }
    };

    return (
        <PageContainer title="Manage Product Types">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div className="flex flex-wrap gap-3">
                    <Link href="/">
                        <Button className="cursor-pointer" variant="secondary">← Back to Home</Button>
                    </Link>
                    <Link href="/admin/add-product">
                        <Button className="cursor-pointer" variant="primary">Continue to Add Product →</Button>
                    </Link>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">
                    Create, view, and manage product schemas
                </p>
            </div>

            {message && (
                <div
                    className={`p-3 rounded-md mb-4 text-sm ${message.startsWith("✅")
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                >
                    {message}
                </div>
            )}

            {/* Add Product Type Form */}
            <form
                onSubmit={handleAdd}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mb-8 space-y-4"
            >
                <h2 className="font-semibold text-lg">Add New Product Type</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Type Name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Laptop"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            JSON Schema
                        </label>
                        <textarea
                            value={schemaText}
                            onChange={(e) => setSchemaText(e.target.value)}
                            placeholder='{"title": "Laptop", "type": "object", "properties": {"brand": {"type": "string"}}}'
                            required
                            rows={4}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
                        ></textarea>
                    </div>
                </div>

                <Button className="cursor-pointer" type="submit" variant="primary">
                    Add Product Type
                </Button>
            </form>

            {/* Existing Product Types */}
            <h2 className="text-lg font-semibold mb-4">Existing Product Types</h2>

            {loading ? (
                <p className="text-gray-600 text-center py-6">Loading...</p>
            ) : productTypes.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No product types found.</p>
            ) : (
                <div className="space-y-4">
                    {productTypes.map((pt) => (
                        <div
                            key={pt.id}
                            className="border border-gray-200 rounded-lg bg-white p-4 sm:p-6 shadow-sm hover:shadow transition"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {pt.name}
                                </h3>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(pt.id)}
                                    className="mt-3 sm:mt-0 cursor-pointer"
                                >
                                    Delete
                                </Button>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 overflow-x-auto">
                                <pre className="text-xs sm:text-sm text-gray-800 font-mono whitespace-pre-wrap break-words">
                                    {JSON.stringify(pt.schema, null, 2)}
                                </pre>
                            </div>

                            <p className="text-gray-400 text-xs mt-2">
                                Created on: {new Date(pt.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </PageContainer>
    );
}
