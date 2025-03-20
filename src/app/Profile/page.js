"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EditProfilePage = () => {
    const [username, setUsername] = useState("@johndoe");
    const [email, setEmail] = useState("johndoe@example.com");
    const role = "user"; // Role is fixed and cannot be changed

    const handleSave = () => {
        // Add logic to save changes (e.g., API call)
        console.log("Profile updated:", { username, email });
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20" >
            <div className="max-w-4xl mx-auto">


                {/* Profile Section */}
                <div className="flex flex-col items-center md:flex-row md:items-start space-y-8 md:space-y-0 md:space-x-8">
                    {/* Big Profile Photo */}
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img
                            src="https://source.unsplash.com/random/400x400?person"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* User Details */}
                    <div className="text-center md:text-left mt-5">
                        <h1 className="text-3xl font-bold text-gray-900"> <span>Username: </span>{username}</h1>
                        <p className="text-gray-600 mt-2"> <span className="font-bold">Email:  </span>{email}</p>
                        <p className="text-gray-600"> <span className="font-bold">Role:  </span>{role}</p>
                    </div>
                </div>

                {/* Edit Profile Button */}
                <div className="mt-8 flex justify-center md:justify-start md:ml-11 ">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button >Edit Profile</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>
                                    Update your profile information. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* Username Field */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        Username
                                    </Label>
                                    <Input
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" onClick={handleSave}>
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;