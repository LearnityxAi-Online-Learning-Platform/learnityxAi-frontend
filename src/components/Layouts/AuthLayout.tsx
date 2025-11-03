// src/components/Layouts/AuthLayout.tsx

import React from 'react';
import NavBar from './LayoutComponents/NavBar';


export default function HomePageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1">
                <div className="mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}