"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaArrowLeft } from "react-icons/fa";

export default function VerifyOtp({ email, onVerify, isLoading, onBack }) {
    const [otp, setOtp] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onVerify(otp);
    };

    return (
        <Card className="max-w-md mx-auto mt-10 shadow-lg border border-gray-200">
            <CardHeader className="flex items-center justify-between border-b pb-3 px-6">
                <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none">
                    <FaArrowLeft className="mr-2" size={20} />
                    <span className="text-sm font-medium">Back</span>
                </button>
                <CardTitle className="text-lg font-semibold">Verify OTP</CardTitle>
                <div className="w-8" /> {/* Placeholder for alignment */}
            </CardHeader>
            <CardDescription className="px-6 mt-4 text-gray-600">
                Please enter the One-Time Password sent to <span className="font-medium">{email}</span>.
            </CardDescription>
            <CardContent className="px-6 py-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                            OTP
                        </Label>
                        <Input
                            id="otp"
                            name="otp"
                            type="text"
                            placeholder="Enter your OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
