'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import React from 'react';
import Sidebar from '@/components/layout/SideBar';
import Header from '@/components/layout/Header';
import Subheader from '@/components/layout/SubHeader';
import EmployeesForm from '@/components/employees/employeesForm';
import MobileMenu from '@/components/layout/MobileMenu';

export default function EmployeesPage() {
    return (
        <Provider store={store}>
            <div className="flex min-h-screen bg-gray-100 dark:bg-black">
                <Sidebar />

                <div className="flex-1 flex flex-col">
                    <Header />
                    <Subheader/> 

                    <main className="flex-1 p-2 sm:p-4">
                        <EmployeesForm />
                    </main>
                    <MobileMenu />
                </div>
            </div>
        </Provider>
    );
}

