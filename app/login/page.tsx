import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="text-center mt-10 text-gray-600">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
