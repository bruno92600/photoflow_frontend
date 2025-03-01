"use client";
import {
  Heart,
  HomeIcon,
  LogOutIcon,
  MessageCircle,
  Search,
  SquarePlus,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { setAuthUser } from "@/store/authSlice";
import { toast } from "sonner";
import CreatePostModel from "./CreatePostModel";

const LeftSidebar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogout = async () => {
    await axios.post(
      `${BASE_API_URL}/users/logout`,
      {},
      { withCredentials: true }
    );
    dispatch(setAuthUser(null));
    toast.success("Déconnexion réussie");
    router.push("/auth/login");
  };

  const handleSidebar = (label: string) => {
    if (label === "Accueil") router.push("/");
    if (label === "Déconnexion") handleLogout();
    if (label === "Profil") router.push(`/profile/${user?._id}`);
    if (label === "Créer") setIsDialogOpen(true);
  };

  const SidebarLinks = [
    {
      icon: <HomeIcon />,
      label: "Accueil",
    },
    {
      icon: <Search />,
      label: "Rechercher",
    },
    {
      icon: <MessageCircle />,
      label: "Messages",
    },
    {
      icon: <Heart />,
      label: "Notifications",
    },
    {
      icon: <SquarePlus />,
      label: "Créer",
    },
    {
      icon: (
        <Avatar className="w-9 h-9">
          <AvatarImage src={user?.profilePicture} className="h-full w-full" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      label: "Profil",
    },
    {
      icon: <LogOutIcon />,
      label: "Déconnexion",
    },
  ];

  return (
    <div className="h-full">
      <CreatePostModel
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      <div className="lg:p-6 p-3 cursor-pointer">
        <div
          onClick={() => {
            router.push("/");
          }}
        >
          <Image src="/images/B.png" alt="logo" width={160} height={160} />
        </div>
        <div className="mt-6">
          {SidebarLinks.map((link) => {
            return (
              <div
                key={link.label}
                className="flex items-center mb-2 p-3 rounded-lg group cursor-pointer transition-all duration-200 hover:bg-gray-100 space-x-2"
                onClick={() => handleSidebar(link.label)}
              >
                <div className="group-hover:scale-125 transition-all duration-200 group-hover:text-green-500">
                  {link.icon}
                </div>
                <p className="lg:text-lg text-base">{link.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
