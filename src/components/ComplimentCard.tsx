
import React, { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ComplimentCardProps {
  compliment: string;
  name?: string;
}

const ComplimentCard: React.FC<ComplimentCardProps> = ({ compliment, name }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, [compliment]);

  // Split the compliment into sentences for staggered animation
  const sentences = compliment.split(/(?<=[.!?])\s+/);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={cn(
        "card-glow w-full max-w-xl mx-auto p-8 rounded-xl",
        "bg-white/60 backdrop-blur-md pastel-shadow",
        "border-2 border-pastel-purple overflow-hidden"
      )}
    >
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <Heart className="h-10 w-10 text-pastel-purple animate-pulse-gentle" />
          <Sparkles className="h-5 w-5 text-pastel-violet absolute -top-2 -right-2 animate-float" />
        </div>
        <h3 className="text-xl font-medium text-primary mt-4 text-center">
          {name ? `${name}, aqui está seu elogio!` : 'Seu elogio personalizado'}
        </h3>
      </div>

      <div className="bg-pastel-lavender/30 p-5 rounded-lg">
        {sentences.map((sentence, index) => (
          <motion.p 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.2 + (index * 0.1),
              ease: "easeOut" 
            }}
            className="text-foreground leading-relaxed mb-3 last:mb-0"
          >
            {sentence.trim()}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
};

export default ComplimentCard;
