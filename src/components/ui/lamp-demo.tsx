
"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { useIsMobile } from "@/hooks/use-mobile";

export function LampDemo() {
  const isMobile = useIsMobile();
  
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-4 md:mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-2 md:py-4 bg-clip-text text-center text-2xl md:text-4xl lg:text-7xl font-medium tracking-tight text-transparent"
      >
        Build lamps <br /> the right way
      </motion.h1>
    </LampContainer>
  );
}
