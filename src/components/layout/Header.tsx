'use client';

import React from "react";
import { Home, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import MenuHamburguer from "./MenuHamburguer";
import ThemeToggle from "../ui/button/ThemeToggle";
import { GiTreehouse } from "react-icons/gi";

const Header: React.FC = () => {
    const router = useRouter();

    return (
        <header className="flex items-center justify-between pt-3 pb-2 sm:py-[8px] px-2 sm:px-4 shadow-md
            bg-gradient-to-r from-green-600 to-green-400 dark:from-green-900 dark:to-green-700 transition-all">

            <div className="flex items-center md:hidden">
                <MenuHamburguer />
            </div>

            <div className="flex items-center justify-center flex-1">
                <GiTreehouse className="text-white text-3xl" />
                <span className="hidden md:inline ml-2 text-xl font-bold text-white">CasaLar</span>
            </div>

            <div className="flex items-center space-x-4">
                <div className="md:hidden">
                    <ThemeToggle />
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <button
                        onClick={() => router.push("/home")}
                        title="Início"
                        className="rounded-full bg-green-100/20 p-2 hover:bg-green-200/30 transition"
                    >
                        <Home className="h-6 w-6 text-white" />
                    </button>

                    <button
                        onClick={() => router.push("/")}
                        title="Sair"
                        className="rounded-full bg-green-100/20 p-2 hover:bg-green-200/30 transition"
                    >
                        <LogOutIcon className="h-6 w-6 text-white" />
                    </button>

                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

export default Header;
