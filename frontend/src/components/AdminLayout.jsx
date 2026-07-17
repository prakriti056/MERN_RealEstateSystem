import React, { useState } from "react";
import { adminLayoutStyles as s } from "../assets/dummyStyles";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={s.layout}>
            <AdminSidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)} 
            />
            <div className={s.mainWrapper}>
                <main className={s.mainContent}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout;