export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-3xl font-semibold mb-4 text-red-500">
                Access Denied
            </h1>
            <p className="text-gray-400">You don&apos;t have permission to view this page.</p>
        </div>
    );
}
