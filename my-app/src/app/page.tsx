"use client";

import { Button } from "@/components/ui/button";

export default function Home() {

 const handleClick = () => {
    console.log("Button clicked!");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button onClick={handleClick} variant="outline">
        Hello World
      </Button>
    </div>
  );
}
