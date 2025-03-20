"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loginUser, verifyOtp, registerUser, validateToken } from "@/app/redux/slices/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import VerifyOtp from "../components/verifyOtp";
import { useRouter } from "next/navigation";

export default function AuthForm() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);

    // "login" | "register" | "otp"
    const [step, setStep] = useState("login");
    const [email, setEmail] = useState("");

    // Login: If successful, redirect to home page.
    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const credentials = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        const toastId = toast.loading("Logging in...");
        const result = await dispatch(loginUser(credentials));
        toast.dismiss(toastId);

        if (loginUser.fulfilled.match(result)) {
            toast.success("Login successful!");

            // Immediately fetch full user info (fixes navbar issue)
            await dispatch(validateToken());

            router.push("/");
        } else {
            toast.error(result.payload || "Login failed. Please check credentials.");
        }
    };


    // Registration: If successful, store email and show OTP component.
    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            username: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
        };

        const toastId = toast.loading("Creating account...");
        const result = await dispatch(registerUser(userData));
        toast.dismiss(toastId);

        if (registerUser.fulfilled.match(result)) {
            toast.success("Registration successful! Check your email for OTP.");
            setEmail(userData.email);
            setStep("otp");
        } else {
            toast.error(result.payload || "Registration failed. Please try again.");
        }
    };

    // OTP Verification: If OTP is correct, redirect to home page.
    const handleOtpVerification = async (otp) => {
        const toastId = toast.loading("Verifying OTP...");
        const result = await dispatch(verifyOtp({ email, otp }));
        toast.dismiss(toastId);

        if (verifyOtp.fulfilled.match(result)) {
            toast.success("OTP verified! Redirecting...");
            router.push("/");
        } else {
            toast.error(result.payload || "Invalid OTP. Please try again.");
        }
    };

    // Back button handler to return to registration form
    const handleBack = () => {
        setStep("register");
    };

    return (
        <div className="w-[400px] mx-auto mt-24 px-5">
            <AnimatePresence mode="wait">
                {step === "login" && (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Tabs defaultValue="login">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger onClick={() => setStep("login")} value="login">
                                    Login
                                </TabsTrigger>
                                <TabsTrigger onClick={() => setStep("register")} value="register">
                                    Register
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="login">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Login</CardTitle>
                                        <CardDescription>Access your dashboard</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleLogin} className="space-y-4">
                                            <Label>Email</Label>
                                            <Input name="email" type="email" required />
                                            <Label>Password</Label>
                                            <Input name="password" type="password" required />
                                            <Button className="w-full mt-4" type="submit" disabled={isLoading}  >
                                                {isLoading ? "Authenticating..." : "Login"}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                )}

                {step === "register" && (
                    <motion.div
                        key="register"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Tabs defaultValue="register">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger onClick={() => setStep("login")} value="login">
                                    Login
                                </TabsTrigger>
                                <TabsTrigger onClick={() => setStep("register")} value="register">
                                    Register
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="register">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Register</CardTitle>
                                        <CardDescription>Start your learning journey</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleRegister} className="space-y-4">
                                            <Label>Full Name</Label>
                                            <Input name="name" type="text" required />
                                            <Label>Email</Label>
                                            <Input name="email" type="email" required />
                                            <Label>Password</Label>
                                            <Input name="password" type="password" required />
                                            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                                                {isLoading ? "Creating account..." : "Register"}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                )}

                {step === "otp" && (
                    <motion.div
                        key="otp"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <VerifyOtp
                            email={email}
                            onVerify={handleOtpVerification}
                            isLoading={isLoading}
                            onBack={handleBack}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}
