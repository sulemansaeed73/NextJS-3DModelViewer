"use client";
import React, { useState, useContext } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import Link from "next/link";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { LoginContext } from "@/context/AuthContext";
import { useForm } from "react-hook-form";

function SignupPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [emailStatus, setEmailStatus] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { login } = useContext(LoginContext);

  const password = watch("password");

  async function UserSignup(data) {
    const user = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    try {
      await axios.post("http://localhost:5000/check-email", {
        email: data.email,
      });
    } catch (error) {
      setEmailStatus("Email Already Taken");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/signup", user, {
        headers: {
          "Content-Type": "application/json",
          Accept: "Application/json",
        },
      });

      if (response.status === 200) {
        toast.success("Signed Up Successfully", { autoClose: 1500 });
        login(response.data.message.username);
        router.push("/login");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage("Email Already Taken");
      } else {
        toast.error("Error Signing Up! Try Again", { autoClose: 1500 });
      }
    }
  }

  return (
    <div className="bg-[#1E293B] min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl h-[450px] border border-gray-600 rounded-md overflow-hidden shadow-md">
        <ToastContainer />

        <div className="w-full md:w-1/2 bg-[#1E293B] p-8 md:p-12">
          <h2 className="text-center text-3xl text-white font-semibold mb-8">
            Create Account
          </h2>

          <form onSubmit={handleSubmit(UserSignup)} className="space-y-5">
            <div>
              <label className="flex items-center gap-2 bg-[#334155] text-white px-3 py-2 rounded-md">
                <FaRegUser className="text-gray-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-gray-400"
                  type="text"
                  placeholder="Name"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                />
              </label>
              {errors.username && (
                <p className="text-sm text-red-400 mt-1">{errors.username.message}</p>
              )}
            </div>

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
              {emailStatus && (
                <p className="text-sm text-red-400 mt-1">{emailStatus}</p>
              )}
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
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
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
              </label>
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 bg-[#334155] text-white px-3 py-2 rounded-md">
                <RiLockPasswordLine className="text-gray-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-gray-400"
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
              </label>
              {errors.confirmPassword && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2 rounded-md transition-all">
              SIGN UP
            </button>
            {message && (
              <p className="text-sm text-red-400 text-center mt-2">{message}</p>
            )}
          </form>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-gray-900 to-gray-600 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="mb-6 text-lg max-w-xs">
            To keep connected with us, please login with your information.
          </p>
          <button className="holographic-btn p-2 rounded-lg border text-white w-32">
            <Link href="/login">SIGN IN</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
