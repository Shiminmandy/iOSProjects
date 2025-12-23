"use client";

import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/supabase/supabaseClient";

export const useChatFile = (filePath: string) => {
  const [publicUrl, setPublicUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = supabaseBrowserClient;

  useEffect(() => {

    {/** 如果 filePath 存在，则触发函数获取文件 */}
    const fetchFile = async () => {
      try {
        const {
          data: { publicUrl },
        } = await supabase.storage.from("chat-files").getPublicUrl(filePath);

        if (publicUrl) {
          setPublicUrl(publicUrl);

          if (filePath.startsWith(" chat/img-")) {
            setFileType("image");
          } else if (filePath.startsWith(" chat/pdf-")) {
            setFileType("pdf");
          }
        }
      } catch (error) {
        setError("Failed to load file");
      } finally {
        setIsLoading(false);
      }
    };

    if (filePath) {
      fetchFile();
    }
  }, [filePath, supabase.storage]);

  return { publicUrl, fileType, isLoading, error };
};
