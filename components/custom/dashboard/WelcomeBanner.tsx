"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Sparkle } from "lucide-react";
import React from "react";

function WelcomeBanner() {
  const { user } = useUser();

  return (
    <div>
      <div className="p-10  border rounded-xl bg-linear-to-r from-slate-700 to-mist-600 text-slate-300 ">
        <h2 className="text-2xl font-bold">Καλως τον παλι,{user?.fullName}</h2>
        <p>Τι θα φτιαξουμε μαστορα???</p>

        <div className="mt-5 flex items-center gap-3 ">
          <Button size="lg">+ Παμε για δουλεια?</Button>
          <Button className="text-slate-700" size="lg" variant="outline">
            <Sparkle />
            Τα AI μωρε!!!
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;
