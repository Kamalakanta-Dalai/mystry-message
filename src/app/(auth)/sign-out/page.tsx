"use client";

import React, { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await signOut({ redirect: false });
      router.replace("/sign-in");
    })();
  }, []);
  return <div className="ml-4 mt-4">You are logged out</div>;
};

export default page;
