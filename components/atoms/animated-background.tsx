"use client"

import { motion } from "framer-motion"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(255, 182, 193, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(221, 160, 221, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 80%, rgba(255, 192, 203, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(255, 182, 193, 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute inset-0"
      />

      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)",
            "radial-gradient(circle at 60% 60%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute inset-0"
      />
    </div>
  )
}
