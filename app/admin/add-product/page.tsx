"use client";

import { useState, useEffect } from "react";
import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import Button from "@/app/components/Button";
import PageContainer from "@/app/components/PageContainer";
import Link from "next/link";

export default function AddProductPage() {
    const [productTypes, setProductTypes] = useState<any[]>([]);
    const [selectedType, setSelectedType] = useState<string>("");
    const [schema, setSchema] = useState<any>(null);
    const [data, setData] = useState<any>({});
    const [productName, setProductName] = useState(""); // ✅ added
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch product types
    useEffect(() => {
        const fetchProductTypes = async () => {
            try {
                const res = await fetch("/api/product-types");
                if (!res.ok) throw new Error("Failed to fetch product types");
                const data = await res.json();
                setProductTypes(data);
            } catch (error) {
                console.error(error);
                alert("⚠️ Error fetching product types.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductTypes();
    }, []);

    // When a type is selected
    const handleTypeChange = (typeId: string) => {
        setSelectedType(typeId);
        const selected = productTypes.find((t) => t.id.toString() === typeId);
        setSchema(selected?.schema || null);
        setData({});
        setMessage("");
    };

    // Submit new product
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedType) return alert("⚠️ Please select a product type first.");
        if (!productName.trim()) return alert("⚠️ Please enter a product name.");

        setSubmitting(true);
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: productName.trim(), // ✅ use entered product name
                    productTypeId: Number(selectedType),
                    attributes: data,
                }),
            });

            if (res.ok) {
                setData({});
                setProductName("");
                setMessage("✅ Product added successfully! Proceed to inventory to check added products.");
            } else {
                alert("❌ Failed to add product. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("⚠️ An unexpected error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageContainer title="Add Product">
            {/* Header Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div className="flex flex-wrap gap-3">
                    <Link href="/">
                        <Button variant="secondary">← Back to Home</Button>
                    </Link>
                    <Link href="/products">
                        <Button variant="primary">Go to Product Inventory →</Button>
                    </Link>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">
                    Add new items dynamically based on product type schemas
                </p>
            </div>

            {loading ? (
                <p className="text-gray-500 text-center py-6">Loading product types...</p>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-6 max-w-3xl mx-auto"
                >
                    {/* Select Product Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Product Type
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => handleTypeChange(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Select a product type</option>
                            {productTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Product Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name
                        </label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Enter product name (e.g., iPhone 14, Legion 5)"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Dynamic Schema Form */}
                    {schema ? (
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <JsonForms
                                schema={schema}
                                data={data}
                                renderers={materialRenderers}
                                cells={materialCells}
                                onChange={({ data }) => setData(data)}
                            />
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">
                            Please select a product type to load the dynamic form.
                        </p>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={submitting}
                        className="w-full sm:w-auto"
                    >
                        {submitting ? "Saving..." : "Save Product"}
                    </Button>

                    {/* Success Message */}
                    {message && (
                        <div className="mt-4 bg-green-50 border border-green-300 text-green-800 px-4 py-2 rounded-md text-sm">
                            {message}
                        </div>
                    )}

                    {/* Product Preview */}
                    {Object.keys(data).length > 0 && (
                        <div className="mt-6 bg-gray-100 border border-gray-200 rounded-lg p-4">
                            <h2 className="text-sm font-semibold text-gray-800 mb-2">
                                Product Preview:
                            </h2>
                            <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap break-words">
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        </div>
                    )}
                </form>
            )}
        </PageContainer>
    );
}
