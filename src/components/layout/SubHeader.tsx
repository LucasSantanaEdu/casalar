"use client";

import React from "react";

const Subheader = () => {
    return (
        <div
            className="
                flex sm:hidden h-2 items-center justify-center py-3 
                bg-[#005c4b] text-white
                dark:bg-[#ff7a00] dark:text-black
                shadow-sm transition-colors duration-300
            "
        >
            <div className="flex items-center gap-2">
                <span className="text-[16px] font-bold">CasaLar</span>
            </div>
        </div>
    );
};

export default Subheader;
