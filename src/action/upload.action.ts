"use server";

import { UploadService } from "@/service/upload.service";

export const uploadSessionFile = async (file: File) => {
  const { url, error } = await UploadService.uploadSessionFile(file);
  return { url, error };
};
