import React, { useEffect, useState } from "react";
import { pendingApprovalStyles as s } from "../../assets/dummyStyles";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineClock, HiOutlineRefresh } from "react-icons/hi";

const PendingApproval = () => {
    const {logout, user, refreshUser} = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    // auto refresh
    useEffect(() => {
        const interval = setInterval(() => {
            refreshUser();

        }, 10000);
        return () => clearInterval(interval);
    }, [refreshUser]);

    // handle manual refresh
    const handleManualRefresh = async () => {
        setRefreshing(true);
        await refreshUser();
        setTimeout(() => setRefreshing(false), 1000);
    };

    return (
        <div className={s.container}>
            <div className={s.iconCircle}>
                <HiOutlineClock size={48} />
            </div>
            <h1 className={s.heading}>Approval Pending</h1>
            <p className={s.description}>
                Hello {user?.name}, your seller account is currently under review by out 
                administration team. Approval uaually takes less than 24 hours. you'll
                gain full dashboard access once verified.
            </p>

            <div className={s.buttonGroup}>
                <a href="/properties" className={s.browseButton}>
                Browser Properties
                </a>

                <button onClick={handleManualRefresh} disabled={refreshing}
                className={`${s.refreshButtonBase} ${
                    refreshing ? s.refreshButtonDisabled : s.refreshButtonEnabled
                }`}
                >
                    <HiOutlineRefresh size={20} className={refreshing ? "animate-spin" : ""}/>
                    {refreshing ? "Checking..." : "Check Status Now"}
                </button>
            </div>


        </div>
)
}

export default PendingApproval;