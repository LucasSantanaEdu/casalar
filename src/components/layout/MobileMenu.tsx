'use client';

import Link from 'next/link';
import { Home, ClipboardList, Wrench, Box } from 'lucide-react';

const iconSize = 22;

const links = [
    { href: '/services', icon: <ClipboardList size={iconSize} /> },
    { href: '/home', icon: <Home size={iconSize} /> },
    { href: '/work-orders', icon: <Box size={iconSize} /> },
    { href: '/tools', icon: <Wrench size={iconSize} /> },
];

export default function MobileMenu() {
    return (
        <nav
            className="
                md:hidden fixed bottom-0 left-0 w-full 
                bg-green-500 text-black 
                dark:bg-green-800 dark:text-white
                border-t border-black/10 dark:border-black/20
                shadow-lg z-50
                transition-colors duration-300
            "
        >
            <ul className="flex justify-around items-center py-3">
                {links.map(({ href, icon }) => (
                    <li key={href}>
                        <Link
                            href={href}
                            className="flex flex-col items-center hover:opacity-80 transition-opacity"
                        >
                            <span className="text-inherit">{icon}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
