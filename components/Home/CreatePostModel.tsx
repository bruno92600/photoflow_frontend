"use client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Image from "next/image";
import LoadingButton from "../Helper/LoadingButton";
import { Button } from "../ui/button";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "../utils/apiRequest";
import { addPost } from "@/store/postSlice";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreatePostModel = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedImage(null);
      setPreviewImage(null);
      setCaption("");
    }
  }, [isOpen]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // validate file type
      const file = event.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner une image valide!");
        return;
      }

      // validate image size
      if (file.size > 10 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 10Mo!");
      }

      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleCreatePost = async () => {
    if (!selectedImage) {
      toast.error("Veuillez sélectionner une image!");
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    const createPostReq = async () =>
      await axios.post(`${BASE_API_URL}/posts/create-post`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

    const result = await handleAuthRequest(createPostReq, setIsLoading);
    if (result) {
      dispatch(addPost(result.data.data.post));
      toast.success("Post créé avec succès");
      setPreviewImage(null);
      setCaption("");
      setSelectedImage(null);
      onClose();
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        {previewImage ? (
          // only show selected image and input for caption
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="mt-4">
              <Image
                src={previewImage}
                alt="Image"
                width={400}
                height={400}
                className="overflow-auto max-h-96 rounded-md object-contain w-full"
              />
            </div>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Écrivez une légende..."
              className="mt-4 p-2 border rounded-md w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <div className="flex space-x-4 mt-4">
              <LoadingButton
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={handleCreatePost}
                isLoading={isLoading}
              >
                Créer ce post
              </LoadingButton>
              <Button
                className="bg-gray-500 text-white hover:bg-gray-600"
                onClick={() => {
                  setPreviewImage(null);
                  setSelectedImage(null);
                  setCaption("");
                  onClose();
                }}
              >
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          // show default view
          <>
            <DialogHeader>
              <DialogTitle className="text-center mt-3 mb-3">
                Télécharger une photo
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="flex space-x-2 text-gray-600">
                <ImageIcon size={40} />
              </div>
              <p className="text-gray-600 mt-4">
                Sélectionnez une photo d&apos;un ordinateur
              </p>
              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={handleButtonClick}
              >
                Sélectionner d&apos;un ordinateur
              </Button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModel;
