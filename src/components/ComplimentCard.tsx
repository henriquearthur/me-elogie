import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { BookOpen, Check, Copy, Sparkles } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';

interface ComplimentCardProps {
  compliment: string;
  name?: string;
}

const ComplimentCard: React.FC<ComplimentCardProps> = ({ compliment, name }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsVisible(true);
  }, [compliment]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(compliment);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "O elogio foi copiado para sua área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o texto.",
        variant: "destructive"
      });
    }
  };

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
        "border-2 border-primary/50 overflow-hidden"
      )}
    >
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <BookOpen className="h-10 w-10 text-primary animate-pulse-gentle" />
          <Sparkles className="h-5 w-5 text-primary absolute -top-2 -right-2 animate-float" />
        </div>
        <h3 className="text-xl font-medium text-primary mt-4 text-center">
          Que incrível!
        </h3>
      </div>

      <div className="relative bg-secondary/30 p-5 rounded-lg">
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-0 m-2.5"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
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

