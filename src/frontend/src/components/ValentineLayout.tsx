import { type ReactNode } from 'react';

interface ValentineLayoutProps {
    children: ReactNode;
}

export default function ValentineLayout({ children }: ValentineLayoutProps) {
    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-romantic border-2 border-border p-8 md:p-12 lg:p-16">
                {children}
            </div>
        </div>
    );
}
