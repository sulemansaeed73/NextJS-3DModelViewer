"use client";
import React, { useState, useContext } from "react";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import Link from "next/link";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { LoginContext } from "@/context/AuthContext";

function UserLoginPage() {
  const { login } = useContext(LoginContext);

  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const router = useRouter();

  async function UserLogin(data) {
    let user = { rememberMe, email: data.email, password: data.password };
    try {
      const response = await axios.post("http://localhost:5000/login", user, {
        headers: {
          "Content-Type": "application/json",
          Accept: "Application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Signed Up Sucessfully", { autoClose: 1500 });
        login(response.data);
        router.push("/");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          toast.error("Error Signing Up, Try Again", { autoClose: 1500 });
          return;
        }
        if (error.response.status === 401) {
          setPasswordMessage(error.response.data);
          return;
        }
        if (error.response.status === 404) {
          setEmailMessage(error.response.data);
          return;
        }
      } else if (error.request) {
        console.error(error.request)
        toast.error("No response from server. Check your network or server.", {
          autoClose: 1500,
        });
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          autoClose: 1500,
        });
      }
    }
  }

  return (
    <div className="bg-[#1E293B] min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl h-[400px] border border-gray-600 rounded-md overflow-hidden shadow-md">
        <ToastContainer />

        <div className="w-full md:w-1/2 bg-[#1E293B] p-8 md:p-12">
          <h2 className="text-center text-3xl text-white font-semibold mb-8">
            Sign In
          </h2>

          <form onSubmit={handleSubmit(UserLogin)} className="space-y-5">
            <div>
              <label className="flex items-center gap-2 bg-[#334155] text-white px-3 py-2 rounded-md">
                <MdEmail className="text-gray-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-gray-400"
                  type="text"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
              </label>
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
              {emailMessage && (
                <p className="text-sm text-red-400 mt-1">{emailMessage}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 bg-[#334155] text-white px-3 py-2 rounded-md">
                <RiLockPasswordLine className="text-gray-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-gray-400"
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is Required",
                  })}
                />
              </label>
              {passwordMessage && (
                <p className="text-sm text-red-400 mt-1">{passwordMessage}</p>
              )}
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-between text-sm text-gray-300">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  onChange={() => setRememberMe((prev) => !prev)}
                  className="accent-teal-500"
                />
                Remember Me
              </label>
              <p className="cursor-pointer hover:underline">Forgot Password?</p>
            </div>

            <button className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2 rounded-md transition-all">
              SIGN IN
            </button>
          </form>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-gray-900 to-gray-600 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">New Here?</h2>
          <p className="mb-6 text-lg max-w-xs">
            To keep connected with us, please sign up with your information.
          </p>
          <button className="holographic-btn p-2 rounded-lg border text-white w-32">
            <Link href="/signup">SIGN UP</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
export default UserLoginPage;
