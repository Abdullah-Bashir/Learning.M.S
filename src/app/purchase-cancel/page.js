"use client";
import { useRouter } from "next/navigation";

export default function PurchaseCancel() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-4">Purchase Cancelled</h1>
            <p className="text-lg mb-2">
                Your purchase was cancelled. You can continue browsing our courses.
            </p>
            <button
                onClick={() => router.push("/")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Go to Home
            </button>
        </div>
    );
}
