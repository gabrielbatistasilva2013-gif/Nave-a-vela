import React, { useState, useRef } from 'react';
import { Upload, Send, Loader2, AlertTriangle, ShieldCheck, CheckCircle2, X, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeFakeNews } from '../services/gemini';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function FakeNewsDetector() {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{status: string, text: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(f => f.type.startsWith('image/'));
    if (validFiles.length !== newFiles.length) {
       setError("Alguns arquivos foram ignorados. Por favor, envie apenas imagens.");
    } else {
       setError(null);
    }
    
    const combinedFiles = [...files, ...validFiles].slice(0, 3);
    setFiles(combinedFiles);
    setPreviews(combinedFiles.map(f => URL.createObjectURL(f)));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
       addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = () => reject(new Error("Falha ao carregar imagem para compressão"));
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && files.length === 0) {
      setError('Por favor, insira um texto ou uma imagem para análise.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const imagesData = await Promise.all(
        files.map(async (file) => ({
          base64: await fileToBase64(file),
          mimeType: file.type
        }))
      );

      const analysis = await analyzeFakeNews(text, imagesData);
      
      let status = 'neutral';
      let cleanResult = analysis || "";
      if (cleanResult.includes('[FALSO]')) {
         status = 'false';
         cleanResult = cleanResult.replace('[FALSO]', '').trim();
      } else if (cleanResult.includes('[VERDADEIRO]')) {
         status = 'true';
         cleanResult = cleanResult.replace('[VERDADEIRO]', '').trim();
      } else if (cleanResult.includes('[INCONCLUSIVO]')) {
         status = 'maybe';
         cleanResult = cleanResult.replace('[INCONCLUSIVO]', '').trim();
      }

      setResult({ status, text: cleanResult });
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao processar sua solicitação.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'false': return 'border-red-500/50 bg-red-900/10 text-red-200';
      case 'true': return 'border-blue-500/50 bg-blue-900/10 text-blue-200';
      case 'maybe': return 'border-yellow-500/50 bg-yellow-900/10 text-yellow-200';
      default: return 'border-white/10 bg-white/5 text-slate-300';
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'false': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'true': return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'maybe': return <ShieldCheck className="w-5 h-5 text-yellow-500" />;
      default: return <ShieldCheck className="w-5 h-5 text-white" />;
    }
  }
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'false': return 'ALTA CHANCE DE SER FALSO';
      case 'true': return 'PROVAVELMENTE VERDADEIRO';
      case 'maybe': return 'ANÁLISE INCONCLUSIVA';
      default: return 'ANÁLISE CONCLUÍDA';
    }
  }

  return (
    <div id="detector" className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="bg-[#020202] border border-white/10 p-8 md:p-12 rounded-sm w-full shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <ShieldCheck className="w-32 h-32 text-white" strokeWidth={0.5} />
        </div>
      <div className="text-left mb-10 relative z-10 border-b border-white/10 pb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="inline-block bg-white text-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">Motor Inteligente</div>
            <h2 className="text-3xl font-serif text-white mb-3">
              Analisador de Casos
            </h2>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Plataforma com cruzamento de dados, linguagem natural e análise metadados de imagem. Execute inferências enviando textos suspeitos ou imagens anexas.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-[#000000]/80 backdrop-blur-sm rounded-sm flex flex-col items-center justify-center overflow-hidden border border-white/10"
          >
            {/* Scanning line */}
            <motion.div
              className="absolute left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_1px_rgba(255,255,255,0.5)]"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            {/* Overlay content */}
            <div className="relative z-10 flex flex-col items-center">
               <Loader2 className="w-8 h-8 text-white mb-4 animate-spin opacity-80" />
               <p className="text-white font-mono uppercase tracking-widest text-xs mb-2">Executando inferência</p>
               <p className="text-slate-400 text-xs text-center max-w-xs font-mono">Processando vetores de linguagem...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex-1 space-y-4">
            <label className="block text-xs uppercase tracking-widest font-bold text-slate-400">
              Texto da Notícia ou Link (URL)
            </label>
            <input
              type="url"
              className="w-full p-4 mb-4 rounded-sm bg-transparent border border-white/20 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              placeholder="Cole o link (URL) da matéria ou postagem aqui (opcional)"
              value={text.match(/^https?:\/\/[^\s]+$/) ? text : (text.includes('http') ? text.match(/https?:\/\/[^\s]+/)?.[0] || '' : '')}
              onChange={(e) => {
                const url = e.target.value;
                setText(t => {
                   const withoutUrl = t.replace(/https?:\/\/[^\s]+/, '').trim();
                   return url ? `${url}\n\n${withoutUrl}` : withoutUrl;
                });
              }}
            />
            <textarea
              className="w-full h-32 p-4 rounded-sm bg-transparent border border-white/20 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none text-sm"
              placeholder="Cole o texto que você deseja analisar aqui..."
              value={text.replace(/^https?:\/\/[^\s]+\s*/, '')}
              onChange={(e) => {
                 const urlStr = text.match(/^https?:\/\/[^\s]+/)?.[0] || '';
                 setText(urlStr ? `${urlStr}\n\n${e.target.value}` : e.target.value);
              }}
            />
          </div>

          <p className="text-[10px] text-slate-500 opacity-80 text-center max-w-sm mx-auto">
            O detector pode cometer erros as vezes, as vezes é indicado consultar a notícia.
          </p>
          
          <div className="flex-1 space-y-4">
            <label className="block text-xs uppercase tracking-widest font-bold text-slate-400 flex justify-between">
              <span>Ou envie Imagens ({files.length}/3)</span>
            </label>
            <div
              className={cn(
                "h-40 relative border border-dashed rounded-sm flex flex-col items-center justify-center transition-colors cursor-pointer group overflow-hidden",
                previews.length > 0 ? "border-blue-500/30 bg-blue-500/5 p-2" : "border-white/20 bg-transparent hover:border-blue-500/50 hover:bg-white/5",
                "focus-within:border-blue-500 outline-none"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => {
                if (files.length < 3) fileInputRef.current?.click();
              }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={files.length >= 3}
              />
              
              {previews.length > 0 ? (
                <div className="w-full h-full flex items-center justify-center gap-2">
                  {previews.map((preview, i) => (
                    <div key={i} className="relative w-full h-full max-w-[33%] rounded overflow-hidden group/img">
                      <img src={preview} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(i);
                        }}
                        className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-white opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-500/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {files.length < 3 && (
                     <div className="w-full h-full max-w-[33%] border border-dashed border-white/20 hover:border-blue-500/50 flex flex-col items-center justify-center text-slate-500 hover:text-white transition-colors cursor-pointer rounded">
                        <Upload className="w-5 h-5 mb-1" />
                        <span className="text-[10px] uppercase">Ajuntar</span>
                     </div>
                  )}
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-slate-500 mb-2 group-hover:text-blue-500 transition-colors" />
                  <p className="text-slate-400 text-xs text-center px-4">
                    <span className="text-white font-medium uppercase tracking-widest block mb-1">Upload</span> Selecione até 3 imagens
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-800/50 rounded-lg text-red-200 text-sm flex gap-3 items-center">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full mt-6 border-t border-white/10 pt-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setText(''); setFiles([]); setPreviews([]); setResult(null); setError(null); }}
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-colors group"
            >
              <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
              Limpar tudo
            </button>
            <div className="text-[10px] text-slate-500 tracking-wider hidden md:block">
              Análise segura • Comparativo inteligente
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || (!text.trim() && files.length === 0)}
            className="flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando
              </>
            ) : (
              <>
                Analisar
              </>
            )}
          </button>
        </div>
      </form>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mt-8 p-8 rounded-sm w-full border border-l-4",
            getStatusColor(result.status)
          )}
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            {getStatusIcon(result.status)}
            <div>
              <h3 className="text-lg font-serif italic mb-1">
                Relatório de Análise
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                {getStatusText(result.status)}
              </p>
            </div>
          </div>
          <div className="prose prose-invert prose-blue max-w-none text-sm leading-relaxed overflow-auto markdown-body">
            <ReactMarkdown>{result.text}</ReactMarkdown>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
}
