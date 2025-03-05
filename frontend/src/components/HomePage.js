"use client";
import React from "react";
import LandingPage from "./LandingPage";
import TwoDModel from "@/components/assets/AutoCAD2D.webp";
import ThreeDModel from "@/components/assets/3D5.webp";
import Image from "next/image";
import { useRouter } from "next/navigation";
function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#1E293B]">
      <LandingPage />

      <div className="flex flex-col items-center py-16">
        <h2 className="text-5xl font-extrabold text-[#F3F4F6] text-center mb-12 tracking-wide">
          View in Both Dimensions
        </h2>

        <div className="flex flex-col md:flex-row gap-12 px-8 w-full max-w-6xl">
          <div className="w-full md:w-1/2 bg-gradient-to-br from-[#374151] to-[#4B5563] shadow-2xl rounded-2xl p-8 border border-gray-600 hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-4xl font-semibold text-[#F3F4F6] mb-6">
              2D Model Viewer
            </h2>
            <Image
              className="rounded-lg border-2 border-[#3B82F6] hover:scale-105 transform transition-transform duration-300"
              width={350}
              height={550}
              src={TwoDModel}
              alt="2D Model"
            />
            <p className="mt-6 text-gray-300 text-lg leading-relaxed">
            Discover accuracy with 2D DWG/DXF viewer and easily explore technical drawings 
            with smooth zooming, intuitive panning, and accurate measurement tools, 
            ensuring a seamless and detailed analysis.
            </p>
            <button
              onClick={() => router.push("uploadautocad")}
              className="w-full mt-6 py-3 text-white text-lg font-semibold bg-[#3B82F6] hover:bg-[#06B6D4] rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Get Started
            </button>
          </div>

          <div className="w-full md:w-1/2 bg-gradient-to-br from-[#374151] to-[#4B5563] shadow-2xl rounded-2xl p-8 border border-gray-600 hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-4xl font-semibold text-[#F3F4F6] mb-6">
              3D Model Viewer
            </h2>
            <Image
              className="rounded-lg border-2 border-[#3B82F6] hover:scale-105 transform transition-transform duration-300"
              width={350}
              height={550}
              src={ThreeDModel}
              alt="3D Model"
            />
            <p className="mt-6 text-gray-300 text-lg leading-relaxed">
            Transform your designs into reality within an engaging and lively 3D model viewer. 
            Load DWG/DXF files and explore designs from every angle by rotating, zooming, 
            and measure with ease.
            </p>
            <button
              onClick={() => router.push("uploadautocad")}
              className="w-full mt-6 py-3 text-white text-lg font-semibold bg-[#3B82F6] hover:bg-[#06B6D4] rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
