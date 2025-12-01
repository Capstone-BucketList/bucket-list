import {
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
} from "flowbite-react";
import { useLocation } from "react-router";
import type { Profile } from "~/utils/models/profile.model";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";

type ProfileProps = {
    profile: Profile | null
}

// Navigation links configuration
const UNAUTHENTICATED_LINKS = [
    { href: "/", label: "Home" },
    { href: "/login", label: "Login" },
    { href: "/signup", label: "Sign Up" },
];

const AUTHENTICATED_LINKS = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/community", label: "Community" },
    { href: "/scrapbook", label: "Scrapbook" },
];

// Helper function to check if route is active
const isActive = (href: string, currentPath: string): boolean => {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
};

// Reusable NavLink component with active state
function NavLink({
    href,
    label,
    isActiveRoute,
}: {
    href: string;
    label: string;
    isActiveRoute: boolean;
}) {
    return (
        <NavbarLink
            href={href}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                isActiveRoute
                    ? "text-cyan-300 font-bold bg-slate-700"
                    : "text-white hover:text-cyan-300 hover:bg-slate-700"
            }`}
        >
            {label}
        </NavbarLink>
    );
}

// User profile dropdown component
function UserProfileDropdown({ profile }: { profile: Profile | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    if (!profile) return null;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-all duration-200"
            >
                <img
                    src={profile.profilePicture ?? "https://via.placeholder.com/40"}
                    alt={profile.userName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-400"
                />
                <span className="text-white text-sm font-semibold hidden sm:inline truncate max-w-32">
                    {profile.userName}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-cyan-300 hidden sm:inline transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                    {/* Profile Header */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-900">{profile.userName}</p>
                        <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        <a
                            href="/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                            <User size={16} />
                            View Profile
                        </a>
                        <a
                            href="/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                            <Settings size={16} />
                            Settings
                        </a>
                        <a
                            href="/logout"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200"
                        >
                            <LogOut size={16} />
                            Logout
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

export function Navigation(props: ProfileProps) {
    const location = useLocation();
    const { profile } = props;
    const isAuthenticated = location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/signup";
    const links = isAuthenticated ? AUTHENTICATED_LINKS : UNAUTHENTICATED_LINKS;

    return (
        <Navbar
            fluid
            className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 sticky top-0 z-50 shadow-lg border-b border-purple-800"
        >
            {/* Logo/Brand */}
            <NavbarBrand href="/">
                <span className="self-center whitespace-nowrap text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
                    Wander<span className="text-yellow-300">List</span>
                </span>
            </NavbarBrand>

            {/* Right side: Navigation Links + User profile dropdown + toggle */}
            <div className="flex items-center gap-4 md:gap-4">
                <NavbarCollapse className="hidden md:flex md:items-center md:gap-4">
                    {links.map((link) => (
                        <NavLink
                            key={link.href}
                            href={link.href}
                            label={link.label}
                            isActiveRoute={isActive(link.href, location.pathname)}
                        />
                    ))}
                </NavbarCollapse>

                {isAuthenticated && <UserProfileDropdown profile={profile} />}
                <NavbarToggle />
            </div>

            {/* Mobile Navigation Links */}
            <NavbarCollapse className="md:hidden">
                <div className="flex flex-col gap-4 py-4">
                    {links.map((link) => (
                        <NavLink
                            key={link.href}
                            href={link.href}
                            label={link.label}
                            isActiveRoute={isActive(link.href, location.pathname)}
                        />
                    ))}
                </div>
            </NavbarCollapse>
        </Navbar>
    );
}