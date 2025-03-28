import ComplimentCard from '@/components/ComplimentCard';
import FileDropzone from '@/components/FileDropzone';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Heart, Loader2, Sparkles } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';

// Set worker properly
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

import { useState } from 'react';

const Index = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [compliment, setCompliment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedName, setExtractedName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setPdfFile(file);
    setCompliment(null);
    processFile(file);
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const typedArray = new Uint8Array(arrayBuffer);

          const loadingTask = pdfjs.getDocument({ data: typedArray });
          const pdf = await loadingTask.promise;
          let extractedText = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');

            extractedText += pageText + '\n';
          }

          resolve(extractedText);
        } catch (error) {
          console.error('Error extracting text from PDF:', error);
          reject(error);
        }
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const extractNameFromText = (text: string): string | null => {
    // Simple regex to extract a name from common resume formats
    const patterns = [
      /nome:?\s+([A-Za-zÀ-ÖØ-öø-ÿ\s]+?)(?:\r|\n|$)/i,
      /currículo\s+(?:de|do|da)\s+([A-Za-zÀ-ÖØ-öø-ÿ\s]+?)(?:\r|\n|$)/i,
      /^([A-Za-zÀ-ÖØ-öø-ÿ\s]{2,30})(?:\r|\n|$)/i, // First line if it looks like a name
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const fullName = match[1].trim();
        const firstName = fullName.split(' ')[0]; // Get just the first name
        return firstName;
      }
    }

    return null;
  };

  const generateCompliment = async (text: string): Promise<string> => {
    try {
      // Send the extracted text to the API
      const response = await fetch('https://me-elogie-api.vercel.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.result || 'Não foi possível gerar um elogio. Por favor, tente novamente.';
    } catch (error) {
      console.error('Error calling the API:', error);
      throw error;
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);

    try {
      // 1. Extract text from PDF
      const extractedText = await extractTextFromPdf(file);

      // 2. Extract name if possible
      const name = extractNameFromText(extractedText);
      setExtractedName(name);

      // 3. Generate compliment based on extracted text
      const generatedCompliment = await generateCompliment(extractedText);

      // 4. Update UI with the result
      setCompliment(generatedCompliment);

      toast({
        title: "Processamento concluído!",
        description: "Seu elogio personalizado está pronto.",
        variant: "default"
      });

    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Erro no processamento",
        description: "Não foi possível processar seu arquivo. Tente novamente.",
        variant: "destructive"
      });
      setCompliment("Não foi possível gerar um elogio. Por favor, tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 flex items-center">
      <div className="w-full">
        <Toaster />

        {/* Header */}
        <header className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-6"
          >
            <Heart className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Me Elogie
            </h1>
            <Sparkles className="h-6 w-6 text-primary ml-3" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-foreground/80 max-w-2xl mx-auto"
          >
            Jogue seu currículo aqui e receba um verdadeiro elogeiro!
            <br />
            Vamos descobrir seu potencial
          </motion.p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* File Upload Section */}
          {!compliment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <FileDropzone
                onFileSelect={handleFileSelect}
                isProcessing={isProcessing}
              />

              {isProcessing && (
                <div className="flex flex-col items-center justify-center mt-8">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-foreground/80 text-center">
                    Processando seu currículo e gerando seu elogio personalizado...
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Result Section */}
          {compliment && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-10"
            >
              <ComplimentCard
                compliment={compliment}
                name={extractedName || undefined}
              />

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => {
                    setPdfFile(null);
                    setCompliment(null);
                  }}
                  className="text-primary hover:text-primary/80 flex items-center transition-colors"
                >
                  Enviar outro currículo
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-foreground/60">
          <p>Não armazenamos nenhum arquivo ou dados. Extraímos o texto do PDF para análise.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
