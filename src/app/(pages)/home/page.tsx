'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/SideBar';
import Header from '@/components/layout/Header';
import Subheader from '@/components/layout/SubHeader';
import MobileMenu from '@/components/layout/MobileMenu';
import Image from 'next/image';

const DateTimeDisplay = () => {
    const [mounted, setMounted] = useState(false);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted) return null;

    const timeString = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dateString = date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="text-center mt-8">
            <div className="text-5xl sm:text-6xl font-bold text-gray-800 dark:text-white tracking-tight">
                {timeString}
            </div>
            <div className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mt-2 capitalize">
                {dateString}
            </div>
        </div>
    );
};

export default function HomePage() {
    return (
        <Provider store={store}>
            <div className="flex min-h-screen bg-gray-100 dark:bg-black transition-colors">
                <Sidebar />

                <div className="flex-1 flex flex-col">
                    <Header />
                    <Subheader />

                    <main className="flex-1 p-4 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
                        
                        <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-6">
                            <Image 
                                src="/logo-confia-lar.png" 
                                alt="Logo Confia Lar"
                                fill
                                className="object-contain drop-shadow-lg"
                                priority
                            />
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400 mb-2 text-center">
                            Bem-vindo ao Confia Lar
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                            Sistema de Gerenciamento Integrado
                        </p>

                        <DateTimeDisplay />

                    </main>
                    
                    <MobileMenu />
                </div>
            </div>
        </Provider>
    );
}