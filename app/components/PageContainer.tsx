import React from "react";

export default function PageContainer({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto w-full">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
                    {title}
                </h1>
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
