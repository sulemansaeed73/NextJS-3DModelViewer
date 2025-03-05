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
    <div>
      <div className="flex flex-col md:flex-row m-10 md:mx-16 lg:mx-28 lg:my-28 border-[1px] rounded-sm ">
        <ToastContainer />
        <div className="p-2 flex-1">
          <h2 className="text-center text-3xl text-gray-800">Sign In</h2>
          <form
            className="flex flex-col p-4 md:p-5 lg:p-16"
            onSubmit={handleSubmit(UserLogin)}
          >
            <label className="flex p-1 border">
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
            {errors.email && (
              <p className="font-thin text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
            {emailMessage && (
              <p className="font-thin text-sm text-red-600">{emailMessage}</p>
            )}

            <label className="flex p-1 border mt-4">
              <RiLockPasswordLine className="text-gray-400 mt-2.5" />
              <input
                className="w-full p-2 focus:outline-none"
                type="text"
                placeholder="Password"
                {...register("password", {
                  required: "Password is Required",
                  message: "Password is Required",
                })}
              />
            </label>
            {passwordMessage && (
              <span className="font-thin text-sm text-red-600">
                {passwordMessage}
              </span>
            )}
            {errors.password && (
              <span className="font-thin text-sm text-red-600">
                {errors.password.message}
              </span>
            )}
            <div className="flex justify-between mt-4 font-thin text-sm">
              <label className="flex text-left gap-1">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  onChange={() => setRememberMe((state) => !state)}
                />
                Remember Me
              </label>
              <p className="text-right">Forget Password?</p>
            </div>
            <button className="rounded bg-teal-500 text-white font-mono p-2 mt-4 mb-4">
              SIGN IN
            </button>
          </form>
        </div>
        <div className="hidden md:flex flex-col flex-1 items-center justify-center bg-teal-400 p-4 gap-4 rounded-r-sm">
          <h2 className="text-center text-3xl text-gray-200 font-bold">
            New Here!
          </h2>
          <p className=" text-xl text-center text-gray-100 w-80">
            To keep conected with us,please signup with your information
          </p>
          <button className="holographic-btn p-2 rounded-lg border text-white w-32">
            <Link href={"signup"}>SIGN UP</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
export default UserLoginPage;
