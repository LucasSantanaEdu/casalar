'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(o => !o);
    const closeSidebar = () => setIsOpen(false);
    const toggleDropdown = () => setIsDropdownOpen(o => !o);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; }
    }, [isOpen]);

    return (
        <div className="md:hidden w-full z-30 text-sm">

            {/* Botão Hamburger */}
            <button
                onClick={toggleSidebar}
                className="p-2 rounded-full bg-gray-200 dark:bg-green-700 text-gray-800 dark:text-white"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 top-0 min-h-screen w-48 p-4 bg-white dark:bg-green-700 text-gray-900 dark:text-white shadow-lg overflow-y-auto">

                    <div>
                        {/* Botão fechar */}
                        <button onClick={toggleSidebar} className="p-2 rounded-full mb-4 bg-gray-200 dark:bg-green-800 text-gray-800 dark:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Navegação */}
                        <nav className="mt-2 pb-20"> {/* pb-20 para deixar espaço do botão Sair */}
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/home" onClick={closeSidebar} className="block py-2 px-3 hover:bg-gray-200 dark:hover:bg-green-600 rounded">Home</Link></li>
                                <li><Link href="/services" onClick={closeSidebar} className="block py-2 px-3 hover:bg-gray-200 dark:hover:bg-green-600 rounded">Serviços</Link></li>
                                <li><Link href="/work-orders" onClick={closeSidebar} className="block py-2 px-3 hover:bg-gray-200 dark:hover:bg-green-600 rounded">Ordens de Serviço</Link></li>
                                <li><Link href="/tools" onClick={closeSidebar} className="block py-2 px-3 hover:bg-gray-200 dark:hover:bg-green-600 rounded">Ferramentas</Link></li>
                                <li>
                                    <button onClick={toggleDropdown} className="w-full text-left py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-green-600">
                                        Gerenciar
                                    </button>
                                    {isDropdownOpen && (
                                        <ul className="mt-2 ml-3 space-y-1">
                                            <li><Link href="/manager/doctor" onClick={closeSidebar} className="block py-2 px-3 hover:bg-gray-200 dark:hover:bg-green-600 rounded">Clientes</Link></li>
                                            <li><Link href="/manager/nurse" onClick={closeSidebar} className="block py-2 px-3 hover:bg-gray-200 dark:hover:bg-green-600 rounded">Funcionários</Link></li>
                                        </ul>
                                    )}
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Botão Sair absoluto acima do menu mobile */}
                    <div className="absolute bottom-20 left-4 right-4">
                        <button
                            onClick={() => { /* logout */ }}
                            className="flex items-center gap-2 w-full py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-green-600 transition"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Sair</span>
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}
