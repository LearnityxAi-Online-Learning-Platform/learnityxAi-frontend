// src/components/Layouts/MainLayout.tsx

import React from 'react';
import NavBar from './LayoutComponents/NavBar';
import Footer from './LayoutComponents/Footer';

export default function HomePageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1">
                <div className="mx-auto">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}