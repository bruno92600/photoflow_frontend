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
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const Signup = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // create our request
    const signupReq = async () =>
      await axios.post(`${BASE_API_URL}/users/signup`, formData, {
        withCredentials: true,
      });

    const result = await handleAuthRequest(signupReq, setIsLoading);

    if (result) {
      dispatch(setAuthUser(result.data.data.user));

      toast.success(result.data.message);

      router.push("/auth/verify");
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
            S&apos;inscrire sur{" "}
            <span className="text-green-600">B.instinct</span>
          </h1>
          <form
            onSubmit={handleSubmit}
            className="block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%]"
          >
            <div className="mb-4">
              <label htmlFor="name" className="font-semibold mb-2 block">
                Nom de l&apos;utilisateur
              </label>
              <input
                type="text"
                name="username"
                placeholder="Nom de l'utilisateur"
                className="px-4 py-3 bg-gray-200 rounded-lg w-full block outline-none"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
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
            </div>
            <div className="mb-4">
              <PasswordInput
                name="passwordConfirm"
                label="Confirmez le Mot de passe"
                placeholder="Confirmez le Mot de passe"
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
            </div>
            <LoadingButton
              size={"lg"}
              className="w-full mt-3 font-bold shadow-xl text-green-600 text-xl"
              type="submit"
              isLoading={isLoading}
            >
              S&apos;inscrire maintenant
            </LoadingButton>
          </form>
          <h1 className="mt-5 text-lg text-gray-800">
            Vous avez déjà un compte ?{" "}
            <Link href="/auth/login">
              <span className="text-green-700 underline cursor-pointer font-medium">
                Se connecter
              </span>
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Signup;
