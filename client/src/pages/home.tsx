import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import LandingHero from "@/components/landing-hero";
import FeaturesSection from "@/components/features-section";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import { getStoredUser } from "@/lib/auth";

export default function Home() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(getStoredUser());

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setLocation("/dashboard");
    }
  }, [setLocation]);

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-50">
      <Header />
      <LandingHero />
      <FeaturesSection />
      <Testimonials />
      <Footer />
    </div>
  );
}
