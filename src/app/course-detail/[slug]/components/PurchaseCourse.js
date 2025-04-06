"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51R8PO4EQ3h0Gge6lVKGqGxaIItMDMn8uf4lVYxaqMdBqV0yygP7KCnHALfDgdU2hYcmPpgITRzwK6W9YDHqmzCsD00ANi6Y1Dk");

function PurchaseCourse({ courseId, coursePrice }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [stripePrice, setStripePrice] = useState(coursePrice);

    // Optional: Fetch price from backend for extra security
    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const response = await axios.get(`/api/courses/${courseId}/price`);
                setStripePrice(response.data.price);
            } catch (error) {
                console.error("Error fetching course price:", error);
            }
        };
        fetchPrice();
    }, [courseId]);

    const handlePurchase = async () => {
        setLoading(true);
        setError("");
        try {
            // Remove coursePrice from request body
            const response = await axios.post(
                "http://localhost:5000/api/purchase/create-checkout-session",
                { courseId }, // Only send courseId
                { withCredentials: true }
            );

            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({
                sessionId: response.data.sessionId
            });

            if (error) throw error;

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Payment processing failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-75"
            >
                {loading ? "Processing..." : `Purchase for $${stripePrice}`}
            </button>
            {error && (
                <p className="text-red-600 mt-2 text-center text-sm">
                    {error}
                </p>
            )}
        </div>
    );
}

export default PurchaseCourse;