'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    Home,
    Users,
    Briefcase,
    ClipboardList,
    Wrench,
    Box,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showText, setShowText] = useState(true);

    const toggleSidebar = () => {
        if (isCollapsed) {
            setIsCollapsed(false);
            setTimeout(() => setShowText(true), 300);
        } else {
            setShowText(false);
            setIsCollapsed(true);
        }
    };

    const linkClass =
        'flex items-center gap-2 py-2 px-4 hover:bg-green-900 rounded whitespace-nowrap text-white';

    return (
        <aside
            className={`hidden md:block ${isCollapsed ? 'w-[60px]' : 'w-[260px]'
                } min-h-screen bg-gradient-to-b from-green-800 to-green-700 transition-all duration-300`}
        >
            <div className="pr-[10px] pt-4 pb-1 flex justify-end">
                <button onClick={toggleSidebar} className="text-white">
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className={`${isCollapsed ? 'fixed' : ''}`}>
                <ul>
                    <li>
                        <Link href="/home" className={linkClass}>
                            <Home size={18} />
                            {showText && 'Início'}
                        </Link>
                    </li>
                    <li>
                        <Link href="/customers" className={linkClass}>
                            <Users size={18} />
                            {showText && 'Clientes'}
                        </Link>
                    </li>
                    <li>
                        <Link href="/employees" className={linkClass}>
                            <Briefcase size={18} />
                            {showText && 'Funcionários'}
                        </Link>
                    </li>
                    <li>
                        <Link href="/services" className={linkClass}>
                            <ClipboardList size={18} />
                            {showText && 'Serviços'}
                        </Link>
                    </li>
                    <li>
                        <Link href="/tools" className={linkClass}>
                            <Wrench size={18} />
                            {showText && 'Ferramentas'}
                        </Link>
                    </li>
                    <li>
                        <Link href="/work-orders" className={linkClass}>
                            <Box size={18} />
                            {showText && 'Ordens de Serviço'}
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
