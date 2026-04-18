"use client";

import React, { useState } from "react";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import { RoleGuard } from "@/components";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <RoleGuard allowedRole="admin">
      <div className="flex h-screen bg-gray-950 text-white">
        {/* Sidebar with Admin-specific Red accents */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with Sidebar Toggle */}
          <Header onMenuClick={() => setIsOpen(!isOpen)} />

          <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-zinc-900 via-gray-950 to-black">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
