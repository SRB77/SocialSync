"use client";

import { User } from "stream-chat";
import { LoadingIndicator } from "stream-chat-react";

import { useClerk } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import MyChat from "@/components/MyChat";

const apiKey = "2vney2wcyg84";

export type DiscordServer = {
  name: string;
  image: string | undefined;
};

export type Homestate = {
  apiKey: string;
  user: User;
  token: string;
};

export default function Home() {
  const [myState, setMyState] = useState<Homestate | undefined>(undefined);
  const { user: myUser } = useClerk();

  const registerUser = useCallback(async () => {
    console.log("[registerUser] myUser:", myUser);
    const userId = myUser?.id;
    const mail = myUser?.primaryEmailAddress?.emailAddress;
    if (userId && mail) {
      try {
        const streamResponse = await fetch("/api/register-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            email: mail,
          }),
        });

        if (!streamResponse.ok) {
          const errorText = await streamResponse.text(); // Read the response body
          console.error("[registerUser] Error response:", errorText);
          throw new Error(
            `Failed to register user: ${streamResponse.statusText}`
          );
        }

        const responseBody = await streamResponse.json();
        console.log("[registerUser] Stream response:", responseBody);
        return responseBody;
      } catch (error) {
        console.error("[registerUser] Error:", error);
      }
    }
  }, [myUser]);

  useEffect(() => {
    const handleUserRegistration = async () => {
      if (
        myUser?.id &&
        myUser?.primaryEmailAddress?.emailAddress &&
        !myUser?.publicMetadata.streamRegistered
      ) {
        console.log("[Page - useEffect] Registering user on Stream backend");
        await registerUser();
        getUserToken(
          myUser.id,
          myUser?.primaryEmailAddress?.emailAddress || "Unknown"
        );
      } else if (myUser?.id) {
        console.log(
          "[Page - useEffect] User already registered on Stream backend: ",
          myUser?.id
        );
        getUserToken(
          myUser?.id || "Unknown",
          myUser?.primaryEmailAddress?.emailAddress || "Unknown"
        );
      }
    };

    handleUserRegistration();
  }, [registerUser, myUser]);

  if (!myState) {
    return <LoadingIndicator />;
  }

  return <MyChat {...myState} />;

  async function getUserToken(userId: string, userName: string) {
    try {
      const response = await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[getUserToken] Error response:", errorText);
        throw new Error(`Failed to get user token: ${response.statusText}`);
      }

      const responseBody = await response.json();
      const token = responseBody.token;

      if (!token) {
        console.error("Couldn't retrieve token.");
        return;
      }

      const user: User = {
        id: userId,
        name: userName,
        image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
      };
      setMyState({
        apiKey: apiKey,
        user: user,
        token: token,
      });
    } catch (error) {
      console.error("[getUserToken] Error:", error);
    }
  }
}
