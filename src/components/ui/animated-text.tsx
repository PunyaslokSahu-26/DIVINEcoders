import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  glowColor?: string;
  className?: string;
}

export function AnimatedText({ text, glowColor = '#4f46e5', className = '' }: AnimatedTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative ${className}`}
      style={{
        textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 30px ${glowColor}`
      }}
    >
      {text}
    </motion.div>
  );
} 