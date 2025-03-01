"use client";
import { Post, User } from "@/types";
import React from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useFollowUnfollow } from "../hooks/use-auth";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "../utils/apiRequest";
import { deletePost } from "@/store/postSlice";
import { toast } from "sonner";
import { redirect } from "next/navigation";

type Props = {
  post: Post | null;
  user: User | null;
};

const DotButton = ({ post, user }: Props) => {
  const { handleFollowUnfollow } = useFollowUnfollow();
  const isOwnPost = post?.user?._id === user?._id;
  const isFollowing = post?.user?._id
    ? user?.following.includes(post.user._id)
    : false;

  const dispatch = useDispatch();

  const handleDeletePost = async () => {
    const deletePostReq = async () =>
      await axios.delete(`${BASE_API_URL}/posts/delete-post/${post?._id}`, {
        withCredentials: true,
      });

    const result = await handleAuthRequest(deletePostReq);
    if (result?.data.status == "success") {
      if (post?._id) {
        dispatch(deletePost(post._id));
        toast.success(result.data.message);
        redirect("/");
      }
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Ellipsis className="w-8 h-8 text-black" />
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogTitle></DialogTitle>
          <div className="space-y-4 flex flex-col w-fit justify-center items-center mx-auto">
            {!isOwnPost && (
              <div>
                <Button
                  onClick={() => {
                    if (post?.user?._id) handleFollowUnfollow(post?.user._id);
                  }}
                  variant={isFollowing ? "destructive" : "secondary"}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </div>
            )}
            <Link href={`/profile/${post?.user?._id}`}>
              <Button className="bg-gray-600 text-white">
                À propos de ce compte
              </Button>
            </Link>
            {isOwnPost && (
              <Button
                className=" bg-red-500 text-white"
                onClick={handleDeletePost}
              >
                Supprimer le post
              </Button>
            )}

            <DialogClose>Annuler</DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DotButton;
