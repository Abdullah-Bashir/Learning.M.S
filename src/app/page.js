"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Courses from "./components/Courses";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <HeroSection onSearch={setSearchTerm} />
      <Courses searchTerm={searchTerm} />
    </div>
  );
}