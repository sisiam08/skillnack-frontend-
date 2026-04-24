"use client";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useRef } from "react";

export default function Class({ classID }: { classID: string }) {
  const classRef = useRef<HTMLDivElement>(null);

  let myClass = async (element: HTMLDivElement) => {
    const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      classID!,
      Date.now().toString(),
      "Tutor",
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Class link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            classID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
    });
  };

  useEffect(() => {
    if (classRef.current) {
      myClass(classRef.current);
    }
  }, [classID]);

  return (
    <div
      className="myCallContainer"
      ref={classRef}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}
