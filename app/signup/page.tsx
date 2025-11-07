"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email || !password) {
            setError("⚠️ Please fill out both fields.");
            return;
        }

        if (password.length < 6) {
            setError("⚠️ Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const text = await res.text();

            if (res.ok) {
                setMessage("✅ Account created successfully! Redirecting to login...");
                setEmail("");
                setPassword("");

                // Redirect to login after 2 seconds
                setTimeout(() => router.push("/"), 2000);
            } else {
                setError(text || "❌ Failed to create account. Please try again.");
            }
        } catch {
            setError("⚠️ Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg border border-gray-200 p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
                    Create an Account
                </h1>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full border text-black border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter a secure password"
                            className="w-full text-black border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all font-medium"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                {error && (
                    <p className="mt-4 text-red-600 text-center font-medium">{error}</p>
                )}
                {message && (
                    <p className="mt-4 text-green-600 text-center font-medium">
                        {message}
                    </p>
                )}

                <div className="mt-6 flex justify-between text-sm text-gray-600">
                    <button
                        onClick={() => router.push("/")}
                        className="hover:text-blue-600 underline transition-all cursor-pointer"
                    >
                        ← Back to Home
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="hover:text-blue-600 underline transition-all cursor-pointer"
                    >
                        Go to Login →
                    </button>
                </div>
            </div>
        </div>
    );
}
