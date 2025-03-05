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
    formState: { errors },
  } = useForm();

  const [message, setMessage] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const router = useRouter();
  const { login } = useContext(LoginContext);

  async function UserSignup(data) {
    let user = {
      username: data.username,
      email: data.email,
      password: data.password,
    };
    try {
      const response = await axios.post("http://localhost:5000/check-email", {
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
        toast.success("Signed Up Sucessfully", { autoClose: 1500 });

        login(response.data.message.username);
        router.push("/");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setMessage("Email Already Taken");
          return;
        }
      } else {
        toast.error("Error Signing Up! Try Again", { autoClose: 1500 });
        return;
      }
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row m-10 md:mx-16 lg:mx-28 lg:my-18 border-[2px] rounded-lg ">
        <ToastContainer />
        <div className="p-4 flex-1">
          <h2 className="text-center text-3xl text-gray-800">Create Account</h2>
          <form
            className="flex flex-col p-4 md:p-4 lg:p-16"
            onSubmit={handleSubmit(UserSignup)}
          >
            <label className="flex p-1 border">
              <FaRegUser className="text-gray-400 mt-2.5" />

              <input
                className="p-2 w-full focus:outline-none"
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
              <p className="font-thin text-sm text-red-600">
                {errors.username.message}
              </p>
            )}

            <label className="flex p-1 border mt-4">
              <MdEmail className="text-gray-400 mt-2.5" />
              <input
                className="w-full p-2 focus:outline-none"
                type="text"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^(?:[a-zA-Z0-9]+@(gmail\.com|proton\.me))$/,
                    message: "Invalid email address",
                  },
                })}
              />
            </label>

            {emailStatus && (
              <p className="font-thin text-sm text-red-600">
                Email Already Taken
              </p>
            )}
            {errors.email && (
              <p className="font-thin text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
            <label className="flex p-1 border mt-4">
              <RiLockPasswordLine className="text-gray-400 mt-2.5" />
              <input
                className="w-full p-2 focus:outline-none"
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
              <p className="font-thin text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
            <label className="flex p-1 border mt-4">
              <RiLockPasswordLine className="text-gray-400 mt-2.5" />
              <input
                className="w-full p-2 focus:outline-none"
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value, { password }) =>
                    value === password || "Passwords do not match",
                })}
              />
            </label>
            {errors.confirmPassword && (
              <p className="font-thin text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
            <button className="rounded bg-teal-500 text-white font-mono p-2 mt-4 mb-4">
              SIGN UP
            </button>
            {message && (
              <span className="font-semibold text-center text-red-600">
                {message}
              </span>
            )}
          </form>
        </div>
        <div className="hidden md:flex flex-col flex-1 items-center justify-center bg-teal-400 p-4 gap-4 rounded-sm">
          <h2 className="text-center text-3xl text-gray-200 font-bold">
            Welcome Back!
          </h2>
          <p className=" text-xl text-center text-gray-100 w-80">
            To keep conected with us,please login with your information
          </p>

          <button className="holographic-btn p-2 rounded-lg border text-white w-32">
            <Link href={"login"}>SIGN IN</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
