"use client"

import { Button } from "@/components/ui/button"
import Orb from "@/components/ui/Orb"

export default function NotFound() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Orb
        hoverIntensity={1.5}
        rotateOnHover={true}
        hue={90}
        forceHoverState={false}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 bg-black/30 backdrop-blur-sm pointer-events-none">
        <h1 className="text-6xl md:text-8xl font-bold mb-4">404</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">You seem to be lost</p>
        <a href="/home" className="pointer-events-auto">
          <Button className="text-lg px-6 py-4 rounded-full">Go Home</Button>
        </a>
      </div>
    </div>
  )
}
