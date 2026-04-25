"use client";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useRef } from "react";

export default function Class({
  classID,
  userID,
  userName,
}: {
  classID: string;
  userID: string;
  userName: string;
}) {
  const classRef = useRef<HTMLDivElement>(null);

  let myClass = async (element: HTMLDivElement) => {
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
      turnOnCameraWhenJoining: false,
      turnOnMicrophoneWhenJoining: false,
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
