import React, { useState, useEffect, useCallback } from "react";
import { navbarStyles as s } from '../../assets/dummyStyles';
import Logo from './Logo';
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiX, HiHome, HiOfficeBuilding, HiHeart, HiChatAlt2, HiPhone, HiArrowCircleRight, HiUser, HiViewGrid, HiShieldCheck } from "react-icons/hi";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close drawer on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
    const closeMenu = useCallback(() => setIsOpen(false), []);

    // Helper to get link class for desktop
    const linkClass = (path) => {
        const isActive = location.pathname === path;
        return `${s.navLink} ${isActive ? s.navLinkActive : s.navLinkInactive} ${s.navLinkHover}`;
    };

    // Helper to get drawer link class
    const drawerLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `${s.drawerNavLink} ${isActive ? s.drawerNavLinkActive : s.drawerNavLinkInactive}`;
    };

    // Navigation links data
    const navItems = [
        { path: "/", label: "Home", icon: HiHome, showFor: "all" },
        { path: "/properties", label: "Properties", icon: HiOfficeBuilding, showFor: "all" },
        { path: "/wishlist", label: "Wishlist", icon: HiHeart, showFor: "buyer" },
        { path: "/chat-message", label: "Messages", icon: HiChatAlt2, showFor: "buyer" },
        { path: "/contact", label: "Contact", icon: HiPhone, showFor: "all" },
        { path: "/dashboard", label: "Dashboard", icon: HiViewGrid, showFor: "seller" },
        { path: "/admin-dashboard", label: "Admin Panel", icon: HiShieldCheck, showFor: "admin" },
    ];

    const getVisibleItems = () => {
        if (!user) {
            // Show public links when logged out
            return navItems.filter(item => item.showFor === "all");
        }
        if (user.role === "buyer") {
            return navItems.filter(item => item.showFor === "all" || item.showFor === "buyer");
        }
        if (user.role === "seller") {
            return navItems.filter(item => item.showFor === "all" || item.showFor === "seller");
        }
        if (user.role === "admin") {
            return navItems.filter(item => item.showFor === "all" || item.showFor === "admin");
        }
        return navItems.filter(item => item.showFor === "all");
    };

    const visibleItems = getVisibleItems();

    return (
        <>
            <nav className={`${s.nav} ${scrolled ? s.navScrolled : s.navDefault}`}>
                <div className={s.container}>
                    <div className={s.grid}>
                        {/* Logo */}
                        <div className="justify-self-start">
                            <Logo />
                        </div>

                        {/* Desktop Navigation */}
                        <div className={s.desktopMenu}>
                            {visibleItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={linkClass(item.path)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className={s.rightSection}>
                            {user ? (
                                <div className={s.userSection}>
                                    <Link to='/profile' className="flex items-center">
                                        <img
                                            src={
                                                user.profilePic ||
                                                `https://ui-avatars.com/api/?name=${user.name}&background=0d9488&color=fff`
                                            }
                                            alt="Profile"
                                            className={s.avatar}
                                            title={user.name}
                                        />
                                    </Link>
                                    <button onClick={logout} className={s.logoutButton}>
                                        <HiArrowCircleRight size={16} />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="hidden lg:flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="btn btn-outline py-2 px-5 text-sm font-semibold rounded-xl"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn btn-primary py-2 px-5 text-sm font-semibold rounded-xl"
                                    >
                                       Register
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Toggle */}
                            <button
                                className={s.mobileToggle}
                                onClick={toggleMenu}
                                aria-label={isOpen ? "Close menu" : "Open menu"}
                            >
                                <div className="relative w-5 h-5 flex items-center justify-center">
                                    <HiMenuAlt3
                                        size={22}
                                        className={`absolute transition-all duration-300 ${
                                            isOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
                                        }`}
                                    />
                                    <HiX
                                        size={22}
                                        className={`absolute transition-all duration-300 ${
                                            isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
                                        }`}
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Backdrop */}
            <div
                className={s.backdrop(isOpen)}
                onClick={closeMenu}
            />

            {/* Mobile Drawer */}
            <div className={s.drawer(isOpen)}>
                <div className={s.drawerHeader}>
                    <Logo onClick={closeMenu} />
                    <button
                        onClick={closeMenu}
                        className={s.drawerCloseButton}
                        aria-label="Close menu"
                    >
                        <HiX size={24} />
                    </button>
                </div>

                <div className={s.drawerNavLinks}>
                    {visibleItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={drawerLinkClass(item.path)}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}

                    {/* Auth links in drawer when logged out */}
                    {!user && (
                        <>
                            <div className="border-t border-border my-3 pt-3" />
                            <Link
                                to="/login"
                                className={drawerLinkClass("/login")}
                            >
                                <HiArrowCircleRight size={20} />
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className={drawerLinkClass("/register")}
                            >
                                <HiUser size={20} />
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {user && (
                    <div className={s.drawerUserSection}>
                        <div className={s.drawerUserInfo}>
                            <img
                                src={
                                    user.profilePic ||
                                    `https://ui-avatars.com/api/?name=${user.name}&background=0d9488&color=fff`
                                }
                                alt="Profile"
                                className={s.drawerAvatar}
                            />
                            <div className="min-w-0 flex-1">
                                <div className={s.drawerUserName}>{user.name}</div>
                                <div className={s.drawerUserEmail}>{user.email}</div>
                            </div>
                        </div>
                        <button onClick={logout} className={s.drawerLogoutButton}>
                            <HiArrowCircleRight size={18} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Navbar