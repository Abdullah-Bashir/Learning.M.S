"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { ModeToggle } from "../DarkMode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutUser, validateToken } from "@/app/redux/slices/authSlice"; // Adjust path as needed
import Link from "next/link";
import { HiOutlineMenu } from "react-icons/hi";
import { useRouter } from "next/navigation";

function Navbar() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // Validate token on mount to update authentication status
    useEffect(() => {
        dispatch(validateToken());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
        router.push('/Auth/login');
    };

    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-white/30 backdrop-blur-md shadow-lg border-b-2 border-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:mx-20 mx-8">
                    {/* Branding */}
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-extrabold">E-Learning</h1>
                    </div>

                    {/* PC Navigation - visible on medium and larger screens */}
                    <div className="hidden md:flex items-center gap-2.5">
                        <ModeToggle />
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar>
                                        <AvatarImage
                                            src={user?.avatar?.url || "https://github.com/shadcn.png"}
                                        />
                                        <AvatarFallback className="cursor-pointer bg-orange-300 font-bold border-2 border-black">
                                            {user?.username ? user.username.charAt(0) : "CN"}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <Link href="/">
                                            <DropdownMenuItem>Home</DropdownMenuItem>
                                        </Link>
                                        <Link href="MyLearning">
                                            <DropdownMenuItem>My Learning</DropdownMenuItem>
                                        </Link>
                                        <Link href="Profile">
                                            <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                                        </Link>
                                        {user?.role === "admin" && (
                                            <Link href="/admin">
                                                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                                            </Link>
                                        )}
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <Link href="https://github.com/Abdullah-Bashir">
                                        <DropdownMenuItem>GitHub</DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="font-bold" onClick={handleLogout}>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/Auth/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Navigation - visible on small screens */}
                    <div className="flex md:hidden items-center gap-2.5">
                        <ModeToggle />
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="p-2">
                                    <HiOutlineMenu size={24} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="px-10">
                                <SheetHeader>
                                    {isAuthenticated ? (
                                        <>
                                            <SheetTitle className="font-bold text-2xl">E - Learning</SheetTitle>
                                            <SheetDescription>
                                                {user?.username || "User"}
                                            </SheetDescription>
                                        </>
                                    ) : (
                                        <SheetTitle>Menu</SheetTitle>
                                    )}
                                </SheetHeader>
                                <div className="grid gap-4 py-4">
                                    {isAuthenticated ? (
                                        <>
                                            <Link href="/">
                                                <Button variant="ghost" className="w-full text-left">
                                                    Home
                                                </Button>
                                            </Link>
                                            <Link href="/MyLearning">
                                                <Button variant="ghost" className="w-full text-left">
                                                    My Learning
                                                </Button>
                                            </Link>
                                            <Link href="/edit-profile">
                                                <Button variant="ghost" className="w-full text-left">
                                                    Edit Profile
                                                </Button>
                                            </Link>
                                            {user?.role === "admin" && (
                                                <Link href="/dashboard">
                                                    <Button variant="ghost" className="w-full text-left">
                                                        Dashboard
                                                    </Button>
                                                </Link>
                                            )}
                                            <Link href="https://github.com/Abdullah-Bashir">
                                                <Button variant="ghost" className="w-full text-left">
                                                    GitHub
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                className="w-full text-left font-bold"
                                                onClick={handleLogout}
                                            >
                                                Log out
                                            </Button>
                                        </>
                                    ) : (
                                        <Link href="/Auth/login">
                                            <Button variant="outline" className="w-full">
                                                Login
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button>Close</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
