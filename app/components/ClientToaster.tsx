"use client";

import { Toaster } from "react-hot-toast";

export default function ClientToaster() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    background: "#333",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                },
                success: {
                    iconTheme: {
                        primary: "#4ade80",
                        secondary: "#333",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#f87171",
                        secondary: "#333",
                    },
                },
            }}
        />
    );
}
