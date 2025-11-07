"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  PackageSearch,
  UserPlus,
  LogOut,
  LogIn,
} from "lucide-react";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.role === "ADMIN";

  const adminLinks = [
    {
      title: "Admin Dashboard",
      desc: "View and manage all users with admin privileges.",
      path: "/admin",
      icon: <LayoutDashboard className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Manage Product Types",
      desc: "Create and edit product categories and their JSON schemas.",
      path: "/admin/product-types",
      icon: <Boxes className="w-6 h-6 text-purple-600" />,
    },
    {
      title: "Add Product",
      desc: "Add new items dynamically using product type schemas.",
      path: "/admin/add-product",
      icon: <PlusCircle className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Product Inventory",
      desc: "View, search, and filter existing products.",
      path: "/products",
      icon: <PackageSearch className="w-6 h-6 text-orange-600" />,
    },
    {
      title: "Sign Up Page",
      desc: "Register a new user (for testing or new employees).",
      path: "/signup",
      icon: <UserPlus className="w-6 h-6 text-gray-600" />,
    },
  ];

  const userLinks = [
    {
      title: "Product Inventory",
      desc: "View, search, and filter existing products.",
      path: "/products",
      icon: <PackageSearch className="w-6 h-6 text-orange-600" />,
    },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center px-6 py-10">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Welcome to <span className="text-blue-600">Inventory System</span>
        </h1>

        {session ? (
          <>
            <p className="text-center text-gray-600 mb-8">
              Logged in as <strong>{session.user?.email}</strong> —{" "}
              <span className="text-blue-600 font-medium uppercase">
                {session.user?.role}
              </span>
            </p>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map((link) => (
                <div
                  key={link.path}
                  onClick={() => router.push(link.path)}
                  className="cursor-pointer bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 rounded-xl p-6 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {link.icon}
                    <h2 className="text-lg font-semibold">{link.title}</h2>
                  </div>
                  <p className="text-sm text-gray-600">{link.desc}</p>
                </div>
              ))}
            </div>

            {/* Sign Out Button */}
            <div className="flex justify-center mt-10">
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </>
        ) : (
          // Not signed in
          <div className="text-center mt-20">
            <p className="text-gray-600 mb-4 text-lg">You are not signed in.</p>
            <button
              onClick={() => signIn(undefined, { callbackUrl: "/" })}
              className="flex items-center gap-2 mx-auto px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
