"use client"
import { Button } from "@/components/ui/button";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Courses from "./components/Courses";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Courses />
    </div>
  );
}
