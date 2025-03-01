"use client";
import { BASE_API_URL } from "@/server";
import { RootState } from "@/store/store";
import { User } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { handleAuthRequest } from "../utils/apiRequest";
import { Bookmark, Grid, Loader, MenuIcon } from "lucide-react";
import LeftSidebar from "../Home/LeftSidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Post from "./Post";
import Saved from "./Saved";
import { useFollowUnfollow } from "../hooks/use-auth";

type Props = {
  id: string;
};

const Profile = ({ id }: Props) => {
  const { handleFollowUnfollow } = useFollowUnfollow();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [postOrSave, setPostOrSave] = useState<string>("POST");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<User>();

  const isOwnProfile = user?._id === id;
  const isFollowing = user?.following.includes(id);

  console.log("User", userProfile);
  console.log("isOwnProfile", isOwnProfile);

  useEffect(() => {
    if (!user) {
      return router.push("/auth/login");
    }

    const getUser = async () => {
      const getUserReq = async () =>
        await axios.get(`${BASE_API_URL}/users/profile/${id}`);
      const result = await handleAuthRequest(getUserReq, setIsLoading);
      if (result) {
        setUserProfile(result?.data.data.user);
      }
    };
    getUser();
  }, [user, router, id]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col">
        <Loader className="animate-ping" />
      </div>
    );
  }

  return (
    <div className="flex mb-20">
      <div className="w-[20%] hidden md:block border-r-2 h-screen fixed">
        <LeftSidebar />
      </div>
      <div className="flex-1 md:ml-[20%] overflow-y-auto">
        <div className="md:hidden bg-white">
          <Sheet>
            <SheetTrigger>
              <MenuIcon />
            </SheetTrigger>
            <SheetContent>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
              <LeftSidebar />
            </SheetContent>
          </Sheet>
        </div>
        <div className="w-[90%] sm:w-[80%] mx-auto">
          {/* top profile */}
          <div className="mt-16 flex md:flex-row flex-col md:items-center pb-16 border-b-2 md:space-x-20">
            <Avatar className="w-[10rem] h-[10rem] mb-8 md:mb-0">
              <AvatarImage
                src={userProfile?.profilePicture}
                className="h-full w-full rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold">{userProfile?.username}</h1>
                {isOwnProfile && (
                  <Link href="/edit-profile">
                    <Button className="text-white">Modifier le profil</Button>
                  </Link>
                )}
                {!isOwnProfile && (
                  <Button
                    onClick={() => {
                      handleFollowUnfollow(id);
                    }}
                    variant={isFollowing ? "destructive" : "secondary"}
                  >
                    {isFollowing ? "Ne pas suivre" : "Suivre"}
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-8 mt-6 mb-6">
                <div>
                  <span className="font-bold">{userProfile?.posts.length}</span>
                  <span className=""> Posts</span>
                </div>
                <div>
                  <span className="font-bold">
                    {userProfile?.followers.length}
                  </span>
                  <span className=""> Followers</span>
                </div>
                <div>
                  <span className="font-bold">
                    {userProfile?.following.length}
                  </span>
                  <span> Following</span>
                </div>
              </div>
              <p className="w-[80%] font-medium">
                {userProfile?.bio || "Ma biographie de profil ici"}
              </p>
            </div>
          </div>
          {/* bottom post and save */}
          <div className="mt-10">
            <div className="flex items-center justify-center space-x-14">
              <div
                className={cn(
                  "flex items-center space-x-2 cursor-pointer",
                  postOrSave === "POST" && "text-green-500"
                )}
                onClick={() => setPostOrSave("POST")}
              >
                <Grid />
                <span className="font-semibold">Post</span>
              </div>
              <div
                className={cn(
                  "flex items-center space-x-2 cursor-pointer",
                  postOrSave === "SAVE" && "text-green-500"
                )}
                onClick={() => setPostOrSave("SAVE")}
              >
                <Bookmark />
                <span className="font-semibold">Enregistré</span>
              </div>
            </div>
            {postOrSave === "POST" && <Post userProfile={userProfile} />}
            {postOrSave === "SAVE" && <Saved userProfile={userProfile} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
