"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Users, Rocket, BookOpen } from "lucide-react"
import Aurora from "@/components/ui/Aurora"

export default function LandingPage() {
  const [hoverFeature, setHoverFeature] = useState<number | null>(null)

  return (
    <div className="h-screen w-full overflow-hidden aurora-gradient flex flex-col">

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 z-0">
        <Aurora
            colorStops={[
            "#34d399",  // emerald-400 (light green)
            "#10b981",  // emerald-500
            "#0284c7",  // blue-600
            "#1e3a8a",  // blue-900
            ]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8">
        <div className="text-center mb-8">

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
          >
            INSAT PRO CLUB
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
          >
            The place to network and grow your career
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a href="/signin">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg hover:shadow-primary/25"
            >
              Get Started
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full"
        >
          {features.map((feature, index) => (
                <motion.div
                key={index}
                className="relative rounded-xl bg-gray-900 p-6 border border-gray-800 flex flex-col items-center text-center shadow-md"
                onMouseEnter={() => setHoverFeature(index)}
                onMouseLeave={() => setHoverFeature(null)}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500">
                {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
            {feature.title}
            </h3>
            <p className="text-muted-foreground">{feature.description}</p>

              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-primary/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoverFeature === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

const features = [
  {
    title: "Connect",
    description: "Build your professional network with like-minded individuals and industry experts",
    icon: <Users className="h-7 w-7" />,
  },
  {
    title: "Grow",
    description: "Accelerate your career with exclusive opportunities and personalized guidance",
    icon: <Rocket className="h-7 w-7" />,
  },
  {
    title: "Learn",
    description: "Access valuable resources and insights shared by our community of professionals",
    icon: <BookOpen className="h-7 w-7" />,
  },
]
