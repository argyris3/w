"use client";

import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { UserDetailContext } from "@/context/UseDetailContext";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [userDetail, setUserDetail] = useState<any>();

  const { isLoaded, isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) {
      return;
    }

    const createNewUser = async () => {
      try {
        const result = await axios.post("/api/users");

        // console.log(result.data);

        setUserDetail(result.data);
      } catch (error) {
        console.error("Failed to create or retrieve the current user.", error);
      }
    };

    void createNewUser();
  }, [isLoaded, isSignedIn, userId]);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  );
};

export default Provider;
