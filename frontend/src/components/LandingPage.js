"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
function LandingPage() {
  const router = useRouter();
  return (
    <div>
    <div className="relative">
      <Image
        className="hidden md:block w-full h-[600px] object-cover lg:object-fill"
        src={'/assets/room.jpg'}
        width={4096}
        height={2296}
        alt="LandingPic"
      />

      <Image
        className="md:hidden w-full h-[600px] object-cover lg:object-fill"
        src={'/assets/room.jpg'}
        alt="LandingPic"
        width={4096}
        height={2296}
      />
  
      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center p-6 bg-black/50">
        <p className="max-w-sm md:w-1/2 lg:w-1/3 text-[2rem] md:text-[2.1rem] font-medium text-[#F8FAFC] leading-snug tracking-wide bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl shadow-xl text-center md:text-left">
          Explore Your Designs in <span className="text-[#4b32bd]">2D & 3D</span>
        </p>
  
        <button
          onClick={() => router.push("login")}
          className="w-[50%] md:w-1/4 lg:w-1/6 mt-6 px-5 py-3 bg-[#1a293b] hover:scale-105 text-white font-medium rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl"
        >
          Get Started
        </button>
      </div>
    </div>
  </div>
  
  );
}

export default LandingPage;
