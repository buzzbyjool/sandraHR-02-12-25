import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface AnimatedButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

export default function AnimatedButton({ onClick, label, className = '' }: AnimatedButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative px-6 py-3 
        bg-gradient-to-r from-[#373F98]/90 via-[#2A9BC1]/90 to-[#0BDFE7]/90
        text-white rounded-lg font-medium 
        shadow-[0_4px_20px_-1px_rgba(55,63,152,0.3)]
        hover:shadow-[0_8px_25px_-1px_rgba(55,63,152,0.4)]
        transition-all duration-300 ease-out
        animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]
        backdrop-blur-lg
        border border-white/10
        ${className}`}
      style={{
        animation: `pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
        backgroundSize: '200% 100%',
        backgroundPosition: 'left center'
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
        initial={false}
      />
      <div className="relative flex items-center gap-2">
        <Plus 
          size={20}
          className="transform group-hover:rotate-90 transition-transform duration-300"
        />
        <span className="transform group-hover:translate-x-1 transition-transform duration-300">
          {label}
        </span>
      </div>
    </motion.button>
  );
}