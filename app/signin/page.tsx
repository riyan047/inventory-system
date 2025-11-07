"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/",
        });

        if (res?.error) setError("Invalid credentials");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
            <h1 className="text-3xl mb-4">Sign In</h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-6 bg-gray-900 rounded-lg shadow-lg w-80"
            >
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                    required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}
