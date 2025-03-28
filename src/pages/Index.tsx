
import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import FileDropzone from '@/components/FileDropzone';
import ComplimentCard from '@/components/ComplimentCard';
import { Sparkles, Heart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
    // In a real application, you would use a PDF parsing library
    // For this demo, we'll simulate the text extraction with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulated extracted text with skills and experience
        const simulatedText = `
          Currículo de Ana Silva
          
          EXPERIÊNCIA PROFISSIONAL
          
          Desenvolvedora Front-end Senior - TechCorp (2020-Atual)
          • Liderou equipe de 5 desenvolvedores em projetos de alta visibilidade
          • Implementou novas arquiteturas React que melhoraram o desempenho em 40%
          • Mentorou desenvolvedores juniores e conduziu code reviews regularmente
          
          Desenvolvedora Web - WebSolutions (2017-2020)
          • Trabalhou em projetos full-stack usando Node.js e React
          • Implementou testes automatizados que aumentaram a cobertura de código em 70%
          
          HABILIDADES
          
          • React, Vue.js, Angular
          • JavaScript/TypeScript avançado
          • CSS/SASS e design responsivo
          • Metodologias ágeis e liderança técnica
          • Otimização de performance web
          
          EDUCAÇÃO
          
          Bacharelado em Ciência da Computação - Universidade Federal (2013-2017)
        `;
        resolve(simulatedText);
      }, 2000);
    });
  };

  const extractNameFromText = (text: string): string | null => {
    // Simple regex to extract a name from text like "Currículo de {Nome}"
    const nameMatch = text.match(/Currículo de\s+([A-Za-zÀ-ÖØ-öø-ÿ\s]+)/i);
    if (nameMatch && nameMatch[1]) {
      return nameMatch[1].trim().split(' ')[0]; // Get just the first name
    }
    return null;
  };

  const generateCompliment = async (text: string): Promise<string> => {
    // In a real app, you would send the text to an API and get a response
    // For this demo, we'll simulate the API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Extract some skills for personalization
        const skills = text.toLowerCase().includes('react') ? 'React' :
                      text.toLowerCase().includes('javascript') ? 'JavaScript' : 
                      'desenvolvimento web';
                      
        const isLeader = text.toLowerCase().includes('lider') || 
                         text.toLowerCase().includes('gerencia') || 
                         text.toLowerCase().includes('coordena');
                         
        // Simulated AI-generated compliment
        const compliments = [
          `Uau! Seu currículo é impressionante! Sua expertise em ${skills} realmente se destaca. Você tem um talento natural para resolver problemas complexos e criar soluções elegantes. Sua jornada profissional mostra não apenas competência técnica, mas também uma paixão genuína pelo que faz. Continue brilhando!`,
          
          `Que trajetória inspiradora! Suas habilidades em ${skills} são realmente notáveis. O que mais me impressiona é como você construiu uma carreira sólida com conquistas significativas. Seu comprometimento com a excelência é evidente em cada etapa do seu percurso profissional. Você é um exemplo de dedicação e talento!`,
          
          `Estou realmente impressionado com seu perfil profissional! Sua experiência com ${skills} mostra um nível de especialização que poucos alcançam. ${isLeader ? 'Suas habilidades de liderança são admiráveis e com certeza inspiram aqueles ao seu redor.' : 'Sua atenção aos detalhes e capacidade de inovação são qualidades raras e valiosas.'} Continue compartilhando seu talento com o mundo!`
        ];
        
        const randomIndex = Math.floor(Math.random() * compliments.length);
        resolve(compliments[randomIndex]);
      }, 3000);
    });
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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6">
      <Toaster />
      
      {/* Header */}
      <header className="max-w-4xl mx-auto text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center mb-6"
        >
          <Heart className="h-8 w-8 text-pastel-purple mr-2" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            MeElogie.com
          </h1>
          <Sparkles className="h-6 w-6 text-pastel-violet ml-2" />
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-foreground/80 max-w-2xl mx-auto"
        >
          Envie seu currículo e receba um elogio personalizado baseado em suas habilidades e experiências profissionais.
        </motion.p>
      </header>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* File Upload Section */}
        {(!compliment || pdfFile) && (
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
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
        <p>© {new Date().getFullYear()} MeElogie.com - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default Index;
