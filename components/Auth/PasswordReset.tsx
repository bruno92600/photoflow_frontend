"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import PasswordInput from "./PasswordInput";
import LoadingButton from "../Helper/LoadingButton";
import { Button } from "../ui/button";
import Link from "next/link";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "../utils/apiRequest";
import { toast } from "sonner";
import { setAuthUser } from "@/store/authSlice";

const PasswordReset = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!otp || !password || !passwordConfirm) {
      return;
    }

    const data = { email, otp, password, passwordConfirm };
    const resetPassReq = async () =>
      await axios.post(`${BASE_API_URL}/users/reset-password`, data, {
        withCredentials: true,
      });
    const result = await handleAuthRequest(resetPassReq, setIsLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
      router.push("/auth/login");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">
        Réinitialiser le mot de passe
      </h1>
      <p className="mb-6 text-sm sm:text-base text-center text-gray-600 font-medium">
        Entrez votre code et votre nouveau mot de passe pour le réinitialiser
      </p>
      <input
        type="number"
        placeholder="code reçu par email"
        className="block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] mx-auto px-6 py-3 bg-gray-300 rounded-lg no-spinner outline-none"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <div className="mb-4 mt-4 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
        <PasswordInput
          name="password"
          placeholder="Entrez le nouveau mot de passe"
          inputClassName="px-6 py-3 bg-gray-300 rounded-lg outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
        <PasswordInput
          name="passwordConfirm"
          placeholder="Confirmez le nouveau mot de passe"
          inputClassName="px-6 py-3 bg-gray-300 rounded-lg outline-none"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-4 mt-6">
        <LoadingButton
          onClick={handleSubmit}
          isLoading={isLoading}
          className="text-white"
        >
          Changer le mot de passe
        </LoadingButton>
        <Button variant={"ghost"} className="">
          <Link href="/auth/forget-password">Précédent</Link>
        </Button>
      </div>
    </div>
  );
};

export default PasswordReset;
