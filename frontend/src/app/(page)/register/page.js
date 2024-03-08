"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const Router = useRouter();

  const [visible, setVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [otp, setOtp] = useState("");

  const sendOtp = async (e) => {
    let res = await fetch("http://localhost:55555/api/v1/auth/generateotp", {
      method: "POST",
      body: JSON.stringify({ email: formData.email }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    let data = await res.json();
    // setSendingOtp(false);
    if (data.ok) {
      alert("OTP sent");
    } else {
      alert(data.error);
    }
  };

  const handleSubmit = async () => {
    if (
      formData.name == "" ||
      formData.email == "" ||
      formData.password == "" ||
      otp == ""
    ) {
      toast.error("All fields are required");
      return;
    }

    let res = await fetch("http://localhost:55555/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: otp,
        profilePic: null,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    let data = await res.json();
    if (data.ok) {
      alert("Signup successful");
      Router.push("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as a new user
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mt-2"
            >
              Full Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Full Name....."
                required
                value={formData.name}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mt-2"
            >
              Email address
            </label>
            <div className="mt-1 flex">
              <input
                type="email"
                name="email"
                placeholder="Enter Email address....."
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                className="border border-gray-300 rounded-md ml-1 hover:bg-gray-700 hover:text-gray-100 "
                onClick={sendOtp}
              >
                Send OTP
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mt-2"
            >
              OTP
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="otp"
                id="otp"
                placeholder="Enter OTP....."
                required
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mt-2"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
                type={visible ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter Password....."
                required
                value={formData.password}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleSubmit}
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mt-2"
            >
              Submit
            </button>
          </div>

          <div className={`flex w-full`}>
            <h4>Already have an account?</h4>
            <Link href="/login" className="text-blue-600 pl-2">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
