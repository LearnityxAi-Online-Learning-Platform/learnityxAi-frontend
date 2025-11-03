import React from "react"
import NavBar from "./LayoutComponents/NavBar"
import Footer from "./LayoutComponents/Footer"

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}