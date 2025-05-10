
"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { useIsMobile } from "@/hooks/use-mobile";
import { TextShimmer } from "@/components/ui/text-shimmer";

export function LampDemo() {
  const isMobile = useIsMobile();
  
  return (
    <LampContainer>
      <motion.div
        initial={{ opacity: 0.5, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="flex flex-col items-center"
      >
        <TextShimmer
          as="h1"
          className="mt-2 md:mt-8 py-2 md:py-4 text-center text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight [--base-color:#ffffff] [--base-gradient-color:#a3a3a3]"
          duration={3}
        >
          build your space
        </TextShimmer>
        <TextShimmer
          as="h2" 
          className="text-center text-2xl md:text-4xl lg:text-6xl font-semibold [--base-color:#ffffff] [--base-gradient-color:#a3a3a3]"
          duration={3}
          spread={4}
        >
          the right way
        </TextShimmer>
      </motion.div>
    </LampContainer>
  );
}
