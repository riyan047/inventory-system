"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "../components/Button";
import PageContainer from "../components/PageContainer";

export default function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
            setLoading(false);
        };
        fetchUsers();
    }, []);

    // Promote user to ADMIN
    const promoteUser = async (id: number) => {
        setMessage("");
        const res = await fetch("/api/admin/promote-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: id }),
        });

        if (res.ok) {
            setMessage("✅ User promoted to ADMIN successfully!");
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, role: "ADMIN" } : u))
            );
        } else {
            setMessage("❌ Failed to promote user.");
        }
    };

    return (
        <PageContainer title="Admin Dashboard">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h2 className="text-lg text-gray-600">
                    Manage user roles and privileges
                </h2>
                <Link href="/" className="w-full sm:w-auto">
                    <Button variant="secondary" className="cursor-pointer">← Back to Home</Button>
                </Link>
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

            {loading ? (
                <p className="text-gray-600 text-center py-10">Loading users...</p>
            ) : users.length === 0 ? (
                <p className="text-gray-600 text-center py-10">No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-sm sm:text-base">
                        <thead className="bg-gray-100 text-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Role</th>
                                <th className="px-4 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-3">{user.id}</td>
                                    <td className="px-4 py-3 break-all">{user.email}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">
                                        {user.role}
                                    </td>
                                    <td className="px-4 py-3">
                                        {user.role === "ADMIN" ? (
                                            <span className="text-green-600 font-medium">Admin</span>
                                        ) : (
                                            <Button
                                                onClick={() => promoteUser(user.id)}
                                                variant="primary"
                                                className="text-sm cursor-pointer"
                                            >
                                                Promote to Admin
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </PageContainer>
    );
}
