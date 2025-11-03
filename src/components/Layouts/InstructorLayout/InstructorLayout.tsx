"use client";

import Link from "next/link";

export default function InstructorLayout ({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-4">
                <div className="mb-8">
                    <h2 className="text-xl font-bold">Instructor Portal</h2>
                </div>
                <nav className="space-y-2">
                    <Link href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">
                        Dashboard
                    </Link>
                    <Link href="/courses" className="block p-2 hover:bg-gray-700 rounded">
                        My Courses
                    </Link>
                    <Link href="/students" className="block p-2 hover:bg-gray-700 rounded">
                        Students
                    </Link>
                    <Link href="/analytics" className="block p-2 hover:bg-gray-700 rounded">
                        Analytics
                    </Link>
                    <Link href="/settings" className="block p-2 hover:bg-gray-700 rounded">
                        Settings
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Page Content */}
                <main className="flex-1 p-6 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    )
}