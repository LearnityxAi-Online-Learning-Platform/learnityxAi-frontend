export default function DashboardStats () {
    return (
        <div>
            <h1 className="text-2xl font-semibold">Instructor Dashboard</h1>
            <div className="flex items-center gap-4">
                <span>Welcome, Instructor</span>
                <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    Logout
                </button>
            </div>
        </div>
    )
}
