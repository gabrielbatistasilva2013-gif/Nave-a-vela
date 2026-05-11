import React from 'react';
import { motion } from 'motion/react';
import { Crosshair, Activity, Globe2 } from 'lucide-react';

export default function EarthAnimation() {
  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] mx-auto flex items-center justify-center pointer-events-none select-none">
      
      {/* Outer Data Rings - Technical HUD details */}
      <div className="absolute inset-0 border border-blue-500/10 rounded-full scale-[1.2] animate-pulse"></div>
      <div className="absolute inset-0 border border-cyan-500/20 rounded-full scale-[1.08] border-dashed animate-[spin_60s_linear_infinite]"></div>
      
      {/* Targeting brackets */}
      <div className="absolute -top-4 -left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-sm"></div>
      <div className="absolute -top-4 -right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-sm"></div>
      <div className="absolute -bottom-4 -left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-sm"></div>
      <div className="absolute -bottom-4 -right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-500/50 rounded-br-sm"></div>

      {/* Floating HUD Badges */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-12 -left-6 md:-left-16 bg-black/80 backdrop-blur-md border border-cyan-500/40 px-3 py-2 rounded-sm text-[10px] font-mono text-cyan-400 flex items-center gap-2 z-40 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        RASTREAMENTO GLOBAL
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-12 -right-6 md:-right-16 bg-black/80 backdrop-blur-md border border-blue-500/40 px-3 py-2 rounded-sm text-[10px] font-mono text-blue-400 flex items-center gap-2 z-40 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
      >
        <Activity className="w-3 h-3 text-blue-500" />
        RADAR DE DESINFORMAÇÃO
      </motion.div>

      {/* Atmospheric Halo */}
      <div className="absolute w-[95%] h-[95%] bg-blue-500/30 blur-[40px] rounded-full z-0"></div>
      <div className="absolute w-[105%] h-[105%] bg-cyan-400/10 blur-[60px] rounded-full z-0"></div>
      
      {/* Earth sphere container */}
      <div 
        className="w-[85%] h-[85%] rounded-full overflow-hidden relative z-10 bg-[#0a1526]"
        style={{
          boxShadow: `
            0 0 50px 5px rgba(50,150,255,0.25) /* Outer glow */
          `
        }}
      >
        {/* Base Surface Texture (Earth Day) */}
        <motion.div 
          className="absolute inset-y-0 left-0 h-full w-[400%]"
          style={{
            backgroundImage: "url('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')",
            backgroundSize: "50% 100%",
            backgroundRepeat: "repeat-x",
            filter: "contrast(1.3) saturate(1.2) brightness(1.2)"
          }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        {/* Scanline / Radar Sweep Effect */}
        <motion.div 
          className="absolute inset-0 w-full h-[30%] bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent mix-blend-screen z-20 pointer-events-none"
          animate={{ y: ["-100%", "300%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Dynamic Terminator (Night Shadow) */}
        <div className="absolute inset-0 pointer-events-none z-30"
             style={{
               background: "radial-gradient(circle at 35% 35%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,1) 100%)",
               mixBlendMode: "multiply"
             }}
        ></div>

        {/* Edge Glare / Atmosphere */}
        <div className="absolute inset-0 rounded-full pointer-events-none z-40"
             style={{
                boxShadow: "inset 20px 10px 40px -10px rgba(100,200,255,0.5), inset -30px -20px 50px 10px rgba(0,0,0,0.9)"
             }}
        ></div>

        {/* Center Crosshair inside Earth view */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 z-50 pointer-events-none">
           <Crosshair className="w-16 h-16 text-cyan-400" strokeWidth={0.5} />
        </div>
      </div>
    </div>
  );
}
