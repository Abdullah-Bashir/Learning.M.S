"use client";
export default function PurchaseSuccess() {


    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-4">Purchase Successful!</h1>
            <p className="text-lg mb-2">
                Thank you for your purchase
            </p>
            <p className="mb-4">
                You can now access your course content.
            </p>
            <a
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Go to Home
            </a>
        </div>
    );
}
