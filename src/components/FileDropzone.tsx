
import React, { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Upload, UploadCloud, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileSelect, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): boolean => {
    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      toast({
        title: "Formato inválido",
        description: "Por favor, envie apenas arquivos PDF.",
        variant: "destructive"
      });
      return false;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (validateFile(file)) {
        setFileName(file.name);
        onFileSelect(file);
      }
    }
  }, [onFileSelect, toast]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (validateFile(file)) {
        setFileName(file.name);
        onFileSelect(file);
      }
    }
  }, [onFileSelect, toast]);

  return (
    <div 
      className={cn(
        "card-glow w-full max-w-xl mx-auto p-8 rounded-xl transition-all duration-300 relative",
        "bg-white/60 backdrop-blur-md pastel-shadow border-2",
        isDragging 
          ? "border-primary border-dashed bg-secondary/50" 
          : fileName 
            ? "border-primary border-solid" 
            : "border-primary/60 border-dashed",
        isProcessing && "opacity-70 pointer-events-none"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {fileName ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 bg-secondary/20 rounded-full flex items-center justify-center">
              <Check className="h-7 w-7 text-primary" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-primary">{fileName}</p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF selecionado com sucesso!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="h-14 w-14 bg-secondary/20 rounded-full flex items-center justify-center mb-4 animate-float">
              <UploadCloud className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              Envie seu currículo em PDF
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Arraste e solte aqui ou clique para escolher o arquivo
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
              <span>Máximo 5MB</span>
            </div>
          </>
        )}
        
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileInput}
          accept=".pdf"
          disabled={isProcessing}
        />
        
        {!fileName && (
          <label 
            htmlFor="file-upload" 
            className="mt-6 inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Upload className="h-4 w-4 mr-2" />
            Selecionar arquivo
          </label>
        )}
        
        {fileName && !isProcessing && (
          <label 
            htmlFor="file-upload" 
            className="mt-4 text-sm text-primary hover:text-primary/90 cursor-pointer transition-colors"
          >
            Trocar arquivo
          </label>
        )}
      </div>
    </div>
  );
};

export default FileDropzone;

