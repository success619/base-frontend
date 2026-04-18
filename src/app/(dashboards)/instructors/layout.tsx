"use client";

import React, { useState, ReactNode } from "react";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";

import { RoleGuard } from "@/components";

export default function InstructorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RoleGuard allowedRole="instructor">
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          role="instructor"
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
