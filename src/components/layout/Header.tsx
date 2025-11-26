'use client';

import React from "react";
import { Home, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MenuHamburguer from "./MenuHamburguer";
import ThemeToggle from "../ui/button/ThemeToggle";

const Header: React.FC = () => {
    const router = useRouter();

    return (
        <header className="flex items-center justify-between py-2 px-2 sm:px-4 shadow-sm
            bg-gradient-to-r from-green-500 via-white to-green-500
            dark:from-green-950 dark:via-neutral-900 dark:to-green-950
            border-b border-green-200 dark:border-green-900 transition-all">

            <div className="flex items-center md:hidden text-white dark:text-green-400 mr-4">
                <MenuHamburguer />
            </div>

            <div className="flex flex-col items-center justify-center flex-1 pl-40">
                
                <div className="relative h-20 w-20 -mb-1"> 
                    <Image
                        src="/logo-confia-lar.png"
                        alt="Logo Confia Lar"
                        fill
                        className="object-contain drop-shadow-sm"
                        priority
                    />
                </div>

                <span className="hidden md:inline text-sm font-bold text-green-800 dark:text-green-400 tracking-widest uppercase -mt-1">
                    Confia Lar
                </span>
            </div>

            <div className="flex items-center space-x-4">
                <div className="md:hidden">
                    <ThemeToggle />
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <button
                        onClick={() => router.push("/home")}
                        title="Início"
                        className="rounded-full bg-white/90 dark:bg-neutral-800/50 p-2 hover:bg-green-100 dark:hover:bg-green-900/30 transition group border border-green-100 hover:border-green-300 shadow-sm"
                    >
                        <Home className="h-5 w-5 text-green-800 dark:text-green-300 group-hover:text-green-900 dark:group-hover:text-green-400" />
                    </button>

                    <button
                        onClick={() => router.push("/")}
                        title="Sair"
                        className="rounded-full bg-white/90 dark:bg-neutral-800/50 p-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition group border border-green-100 hover:border-red-200 shadow-sm"
                    >
                        <LogOutIcon className="h-5 w-5 text-green-800 dark:text-green-300 group-hover:text-red-600 dark:group-hover:text-red-400" />
                    </button>

                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

export default Header;