"use client";

import React, { useState } from "react";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";

import { RoleGuard } from "@/components";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <RoleGuard allowedRole="student">
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setIsOpen(!isOpen)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
