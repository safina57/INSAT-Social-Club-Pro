"use client"

import Dither from "@/components/ui/Dither"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Dither
        waveColor={[0.0, 0.8, 0.6]} 
        disableAnimation={false}
        enableMouseInteraction={true}
        mouseRadius={0.3}
        colorNum={4}
        waveAmplitude={0.3}
        waveFrequency={3}
        waveSpeed={0.05}
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
