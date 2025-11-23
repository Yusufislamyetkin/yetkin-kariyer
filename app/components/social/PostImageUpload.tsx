"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import Image from "next/image";

interface PostImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  imageUrl?: string;
  isLoading?: boolean;
}

export function PostImageUpload({
  onImageSelect,
  onImageRemove,
  imageUrl,
  isLoading = false,
}: PostImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
          }

          // Calculate new dimensions (max 1920x1080)
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            } else {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Image compression failed"));
                return;
              }
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            0.85 // 85% quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Lütfen bir görsel dosyası seçin");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Dosya boyutu 10MB'ı aşamaz");
      return;
    }

    // Compress image if it's large
    try {
      let processedFile = file;
      if (file.size > 2 * 1024 * 1024) {
        // Compress if larger than 2MB
        processedFile = await compressImage(file);
      }
      onImageSelect(processedFile);
    } catch (error) {
      console.error("Image compression error:", error);
      // Fallback to original file
      onImageSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  if (imageUrl) {
    return (
      <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-900 rounded-sm overflow-hidden">
        <Image
          src={imageUrl}
          alt="Preview"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 935px"
        />
        <button
          onClick={onImageRemove}
          className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          type="button"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors ${
        dragActive
          ? "border-[#0095f6] bg-[#0095f6]/10"
          : "border-[#dbdbdb] dark:border-[#383838] bg-gray-50 dark:bg-gray-900"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleChange}
        className="hidden"
        disabled={isLoading}
      />
      <Upload className="w-12 h-12 text-[#8e8e8e] mx-auto mb-4" />
      <p className="text-sm text-[#262626] dark:text-[#fafafa] mb-2">
        Fotoğrafı buraya sürükleyip bırakın
      </p>
      <p className="text-xs text-[#8e8e8e] mb-4">veya</p>
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        Dosya Seç
      </Button>
      <p className="text-xs text-[#8e8e8e] mt-4">
        JPEG, PNG veya WebP (maks. 10MB)
      </p>
    </div>
  );
}

