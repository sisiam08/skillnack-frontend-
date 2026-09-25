"use client";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { uploadSessionFile } from "@/action/upload.action";
import { Button } from "@/components/ui/button";
import { Copy, Paperclip, Upload, X } from "lucide-react";

type ClassProps = {
  classID: string;
  userID: string;
  userName: string;
  bookingId?: string;
  requestTitle?: string | null;
  requestDescription?: string | null;
  initialAttachments?: string[];
};

const getAttachmentName = (url: string) => {
  try {
    const decoded = decodeURIComponent(url.split("/").pop() ?? "attachment");
    return decoded.replace(/^[a-z0-9]+-\d+-/i, "");
  } catch {
    return "attachment";
  }
};

export default function Class({
  classID,
  userID,
  userName,
  bookingId,
  requestTitle,
  requestDescription,
  initialAttachments = [],
}: ClassProps) {
  const classRef = useRef<HTMLDivElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<{ url: string; name: string }[]>(
    initialAttachments.map((url) => ({ url, name: getAttachmentName(url) })),
  );

  useEffect(() => {
    const element = classRef.current;
    if (!element) return;

    const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      classID!,
      userID!,
      userName!,
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    const params = new URLSearchParams({ roomID: classID });
    if (bookingId) {
      params.set("bookingId", bookingId);
    }

    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Class link",
          url:
            window.location.origin +
            window.location.pathname +
            "?" +
            params.toString(),
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      // Explicitly enable the tools most relevant to problem-solving sessions.
      // (Both default to true in the SDK, but we pin them so future SDK/scenario
      // changes cannot silently remove them.)
      showScreenSharingButton: true,
      showTextChat: true,
      showUserList: true,
      turnOnCameraWhenJoining: false,
      turnOnMicrophoneWhenJoining: false,
    });

    return () => {
      zp.destroy();
    };
  }, [classID, userID, userName, bookingId]);

  const handleUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading("Uploading file...");

    try {
      const response = await uploadSessionFile(file);

      if (response.error || !response.url) {
        toast.error(response.error?.message || "File upload failed", {
          id: toastId,
        });
        return;
      }

      setFiles((prev) => [...prev, { url: response.url!, name: file.name }]);
      toast.success("Uploaded. Copy the link into the chat to share.", {
        id: toastId,
      });
    } finally {
      setUploading(false);
    }
  };

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied. Paste it into the in-call chat.");
    } catch {
      toast.error("Could not copy automatically. Long-press the link to copy.");
    }
  };

  return (
    <div className="relative">
      <div
        className="myCallContainer"
        ref={classRef}
        style={{ width: "100vw", height: "100vh" }}
      />

      {/* Shared files / links panel (not a file-transfer system: links only). */}
      <div
        className="fixed right-4 top-20 flex flex-col items-end gap-2"
        style={{ zIndex: 2147483000 }}
      >
        {panelOpen ? (
          <div className="w-[320px] max-w-[90vw] rounded-xl border border-border bg-background p-3 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">Shared files</p>
              <button
                type="button"
                aria-label="Close shared files"
                onClick={() => setPanelOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="mb-2 text-[11px] text-muted-foreground">
              Files upload to secure storage and are shared as links. Paste the
              link into the in-call chat so the other person can open it.
            </p>

            {requestTitle || requestDescription ? (
              <div className="mb-3 rounded-md border bg-muted/30 p-2 text-xs">
                {requestTitle ? (
                  <p className="font-semibold">{requestTitle}</p>
                ) : null}
                {requestDescription ? (
                  <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                    {requestDescription}
                  </p>
                ) : null}
              </div>
            ) : null}

            <label className="mb-2 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted/40">
              <Upload className="size-3.5" />
              {uploading ? "Uploading..." : "Upload a file to share"}
              <input
                type="file"
                className="hidden"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) void handleUpload(file);
                }}
              />
            </label>

            <ul className="max-h-56 space-y-1 overflow-y-auto">
              {files.length === 0 ? (
                <li className="rounded-md border bg-muted/20 px-2 py-3 text-center text-xs text-muted-foreground">
                  No files shared yet.
                </li>
              ) : (
                files.map((file) => (
                  <li
                    key={file.url}
                    className="flex items-center justify-between gap-2 rounded-md border bg-background px-2 py-1.5 text-xs"
                  >
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-w-0 items-center gap-1 text-brand hover:underline"
                    >
                      <Paperclip className="size-3 shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </a>
                    <button
                      type="button"
                      aria-label={`Copy link for ${file.name}`}
                      onClick={() => void copyLink(file.url)}
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        ) : null}

        <Button
          type="button"
          onClick={() => setPanelOpen((prev) => !prev)}
          className="bg-brand text-white shadow-lg hover:bg-brand-strong"
          size="sm"
        >
          <Paperclip className="mr-2 size-4" />
          Files
        </Button>
      </div>
    </div>
  );
}
