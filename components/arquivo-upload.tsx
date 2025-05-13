"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, FileSpreadsheet, Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface ArquivoUploadProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconClassName: string;
  type: 'estoque' | 'demanda';
}

export default function ArquivoUpload({ 
  title, 
  description, 
  icon, 
  iconClassName,
  type
}: ArquivoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [dataArquivo, setDataArquivo] = useState<Date | undefined>(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const resetUpload = () => {
    setFile(null)
    setUploadProgress(0)
    setStatusMessage("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase() || "";
      
      if (!["xlsx", "xls", "csv"].includes(fileExtension)) {
        toast.error("Formato de arquivo inválido. Por favor, use arquivos .xlsx, .xls ou .csv")
        resetUpload()
        return
      }
      setFile(selectedFile)
    }
  }

  const handleUpload = () => {
    if (!file) {
      toast.error("Selecione um arquivo para upload")
      return
    }
    
    setDialogOpen(true)
  }

  const processUpload = async () => {
    if (!file || !dataArquivo) {
      toast.error("Arquivo ou data não selecionados")
      return
    }

    setDialogOpen(false)
    setUploading(true)
    setUploadProgress(0)
    setStatusMessage("Enviando e processando arquivo...")

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          return 95; 
        }
        const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 85 ? 1 : 0.5;
        return Math.min(95, prev + increment);
      });
    }, 500);

    try {
      console.log(`[Cliente] Preparando upload de ${type}`)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("dataArquivo", format(dataArquivo, "yyyy-MM-dd"))
      formData.append("type", type)

      console.log("[Cliente] Iniciando requisição fetch")
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      console.log("[Cliente] Resposta recebida:", response.status, response.statusText)
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao fazer upload de ${type}`);
      }

      const result = await response.json();
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      setUploadProgress(100);
      setStatusMessage(result.message || "Upload concluído!");
      
      setTimeout(() => {
        setUploading(false);
        resetUpload();
        toast.success(result.message || "Upload concluído!");
      }, 1000);
      
    } catch (error: any) {
      console.error(`[Cliente] Erro no upload de ${type}:`, error);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      setUploading(false);
      setUploadProgress(0);
      setStatusMessage("");
      toast.error(`Erro no upload: ${error.message}`);
    }
  }

  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={`arquivo-${type}`}>Arquivo CSV/Excel</Label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input 
              id={`arquivo-${type}`} 
              type="file" 
              ref={fileInputRef}
              accept=".csv,.xlsx,.xls" 
              onChange={handleFileChange} 
              disabled={uploading}
            />
            {file && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6"
                onClick={resetUpload}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button 
            size="sm" 
            onClick={handleUpload} 
            disabled={uploading || !file}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
        </div>
        {file && (
          <p className="text-xs text-muted-foreground mt-1">
            {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>
      {uploading && (
        <div className="mt-2">
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{Math.round(uploadProgress)}% concluído</span>
            {statusMessage && <span>{statusMessage}</span>}
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Data do {type === 'estoque' ? 'Estoque' : 'Demanda'}</DialogTitle>
            <DialogDescription>
              Selecione a data correspondente ao arquivo que está sendo enviado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="data-arquivo">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataArquivo && "text-muted-foreground"
                    )}
                  >
                    {dataArquivo ? (
                      format(dataArquivo, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dataArquivo}
                    onSelect={setDataArquivo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={processUpload}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}