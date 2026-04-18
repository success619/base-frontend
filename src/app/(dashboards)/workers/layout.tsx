"use client";

import React, { useState,  } from "react";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import { RoleGuard } from "@/components";
export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <RoleGuard allowedRole="worker" >
      <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar - Now correctly uses state */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Now toggles the sidebar state */}
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
    </RoleGuard>
  );
}