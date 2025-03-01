"use client";
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useState } from "react";
import PasswordInput from "./PasswordInput";
import LoadingButton from "../Helper/LoadingButton";
import Link from "next/link";
import { BASE_API_URL } from "@/server";
import axios from "axios";
import { handleAuthRequest } from "../utils/apiRequest";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // create our request
    const loginReq = async () =>
      await axios.post(`${BASE_API_URL}/users/login`, formData, {
        withCredentials: true,
      });

    const result = await handleAuthRequest(loginReq, setIsLoading);

    if (result) {
      dispatch(setAuthUser(result.data.data.user));

      toast.success(result.data.message);

      router.push("/");
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        {/* Banner */}
        <div className="lg:col-span-4 h-screen hidden lg:block">
          <Image
            src="/images/IMG_0573.jpeg"
            alt="image signup"
            width={1000}
            height={1000}
            className="w-full h-full object-contain"
          />
        </div>
        {/* form */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center h-screen">
          <h1 className="font-bold text-xl sm:text-2xl text-left uppercase mb-8">
            Se connecter sur <span className="text-green-600">B.instinct</span>
          </h1>
          <form
            onSubmit={handleSubmit}
            className="block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%]"
          >
            <div className="mb-4">
              <label htmlFor="email" className="font-semibold mb-2 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="email"
                className="px-4 py-3 bg-gray-200 rounded-lg w-full block outline-none"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <PasswordInput
                label="Mot de passe"
                name="password"
                placeholder="Entrez le mot de passe"
                value={formData.password}
                onChange={handleChange}
              />
              <Link
                href="/auth/forget-password"
                className="mt-2 text-red-500 block font-semibold text-base cursor-pointer text-right"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <LoadingButton
              size={"lg"}
              className="w-full mt-3 font-bold shadow-xl text-green-600 text-xl"
              type="submit"
              isLoading={isLoading}
            >
              Se connecter
            </LoadingButton>
          </form>
          <h1 className="mt-5 text-lg text-gray-800">
            Je n&apos;ai pas de compte ?{" "}
            <Link href="/auth/signup">
              <span className="text-green-700 underline cursor-pointer font-medium">
                S&apos;inscrire ici
              </span>
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
