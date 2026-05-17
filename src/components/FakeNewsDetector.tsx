import React, { useState, useRef } from 'react';
import { Upload, Send, Loader2, AlertTriangle, ShieldCheck, CheckCircle2, X, RefreshCw, Activity } from 'lucide-react';
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
      case 'false': return <AlertTriangle className="w-8 h-8 text-red-500" />;
      case 'true': return <CheckCircle2 className="w-8 h-8 text-blue-500" />;
      case 'maybe': return <ShieldCheck className="w-8 h-8 text-yellow-500" />;
      default: return <ShieldCheck className="w-8 h-8 text-white" />;
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

  const loadingMessages = [
    "Iniciando varredura profunda...",
    "Coletando metadados e rastros digitais...",
    "Acessando bancos de dados em tempo real...",
    "Cruzando informações com fontes confiáveis...",
    "Analisando contexto de publicações...",
    "Identificando padrões de desinformação...",
    "Checando fontes e datas da publicação...",
    "Finalizando análise de autenticidade..."
  ];

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  return (
    <div id="detector" className="w-full max-w-5xl mx-auto flex flex-col items-center relative">
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center -translate-y-10">
         <div className="w-[800px] h-[800px] absolute opacity-20 border-[1px] border-blue-500/10 rounded-full animate-[spin_60s_linear_infinite] border-dashed"></div>
         <div className="w-[600px] h-[600px] absolute opacity-10 border-[1px] border-cyan-500/20 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
      </div>

      <div className="bg-[#050505]/40 backdrop-blur-2xl border border-white/[0.08] p-8 md:p-14 rounded-[2rem] w-full relative overflow-hidden group/container shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-cyan-500/[0.03] opacity-0 group-hover/container:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
        
        <div className="absolute top-4 right-16 p-8 opacity-[0.02] group-hover/container:opacity-[0.05] transition-opacity duration-1000 pointer-events-none scale-125">
          <ShieldCheck className="w-64 h-64 text-blue-400" strokeWidth={0.5} />
        </div>

      <div className="text-left mb-12 relative z-10 pb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2 w-max shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Activity className="w-3 h-3" /> Motor Inteligente
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Testar uma Notícia
            </h2>
            <p className="text-base text-slate-400 max-w-xl leading-relaxed">
              Envie um texto, link ou até 3 imagens suspeitas para o nosso sistema analisar se a notícia tem chances de ser falsa.
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
            className="absolute inset-0 z-20 bg-[#020202]/90 backdrop-blur-md rounded-[1.5rem] flex flex-col items-center justify-center overflow-hidden border border-blue-500/20"
          >
            {/* Simple Background Effect */}
            <div className="absolute inset-0 bg-[#000000] z-0 overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full animate-pulse"></div>
            </div>
             
            {/* Vertical Scanner Beam (Simplified) */}
            <motion.div
              className="absolute left-0 right-0 h-[1px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10 opacity-50"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Hex Rain Particles (Optimized) */}
            <HexRain />
            
            {/* Central Terminal Box */}
            <div className="relative z-20 w-[400px] max-w-[90%] bg-black/60 border border-blue-500/30 p-8 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.15)] flex flex-col items-center backdrop-blur-lg">
               <div className="flex items-center gap-3 w-full mb-8 border-b border-white/5 pb-4">
                 <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-[ping_2s_infinite]"></div>
                 </div>
                 <div className="text-[9px] uppercase tracking-[0.2em] font-mono text-slate-500 ml-auto flex items-center gap-2">
                   <Activity className="w-3 h-3 text-blue-500" />
                   Análise em andamento
                 </div>
               </div>
               
               <div className="relative mb-8">
                  <div className="absolute inset-0 border border-blue-400/30 rounded-full animate-ping opacity-50 duration-1000"></div>
                  <div className="bg-blue-500/10 p-5 rounded-full border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                  </div>
               </div>
               
               <div className="w-full text-center h-8 flex flex-col justify-center">
                 <AnimatePresence mode="wait">
                   <motion.div
                     key={loadingMessageIndex}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.3 }}
                     className="text-xs md:text-sm text-blue-300 font-mono tracking-wider font-medium"
                   >
                     {loadingMessages[loadingMessageIndex]}
                   </motion.div>
                 </AnimatePresence>
               </div>
               
               <div className="w-full mt-6 bg-white/5 h-1 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                   initial={{ width: "0%" }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 15, ease: "linear" }}
                 />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10 w-full max-w-3xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex-1 space-y-4">
            <label className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-blue-300/80">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Texto da Notícia ou Link (URL)
            </label>
            <input
              type="url"
              className="w-full p-5 mb-4 rounded-xl bg-[#000000]/60 backdrop-blur-sm border border-white/10 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm shadow-inner"
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
              className="w-full h-40 p-5 rounded-xl bg-[#000000]/60 backdrop-blur-sm border border-white/10 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none text-sm shadow-inner"
              placeholder="Ou digite/cole o texto que você deseja analisar aqui..."
              value={text.replace(/^https?:\/\/[^\s]+\s*/, '')}
              onChange={(e) => {
                 const urlStr = text.match(/^https?:\/\/[^\s]+/)?.[0] || '';
                 setText(urlStr ? `${urlStr}\n\n${e.target.value}` : e.target.value);
              }}
            />
          </div>

          <div className="flex-1 space-y-4">
            <label className="flex items-center justify-between text-xs uppercase tracking-widest font-bold text-cyan-300/80">
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                 Ou envie Imagens ({files.length}/3)
              </div>
            </label>
            <div
              className={cn(
                "h-48 relative border border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden bg-[#000000]/40 backdrop-blur-sm shadow-inner",
                previews.length > 0 ? "border-blue-500/30 bg-gradient-to-b from-blue-500/5 to-transparent p-3" : "border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5",
                "focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-500/10 outline-none"
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
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-xl text-red-200 text-sm flex gap-3 items-center shadow-[0_0_20px_rgba(239,68,68,0.1)]"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
            <p>{error.replace(/gemini|inteligência artificial/gi, 'sistema')}</p>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full mt-8 border-t border-white/[0.05] pt-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setText(''); setFiles([]); setPreviews([]); setResult(null); setError(null); }}
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-slate-300 transition-all group"
            >
              <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
              Limpar tudo
            </button>
          </div>
          <button
            type="submit"
            disabled={loading || (!text.trim() && files.length === 0)}
            className="flex w-full sm:w-auto items-center justify-center gap-2 px-10 py-4 bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] text-xs font-bold uppercase tracking-widest rounded-full hover:bg-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                Iniciar Varredura
              </>
            )}
          </button>
        </div>
      </form>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={cn(
            "mt-8 p-8 md:p-12 rounded-[2rem] w-full border backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden",
            getStatusColor(result.status)
          )}
        >
          {/* Top glowing accent border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50"></div>
          
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10 relative z-10">
            <div className="p-4 bg-black/30 rounded-2xl backdrop-blur-md border border-white/5">
              {getStatusIcon(result.status)}
            </div>
            <div>
              <h3 className="text-2xl font-serif mb-1 text-white">
                Relatório de Varredura
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 decoration-2 underline-offset-4">
                {getStatusText(result.status)}
              </p>
            </div>
          </div>
          <div className="prose prose-invert prose-blue max-w-none text-sm md:text-base leading-relaxed overflow-auto markdown-body relative z-10 text-slate-200">
            <ReactMarkdown>{result.text}</ReactMarkdown>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
}

function HexRain() {
  const particles = React.useMemo(() => {
    return [...Array(15)].map((_, i) => {
      const duration = 3 + Math.random() * 4;
      const delay = Math.random() * 3;
      return {
        key: i,
        duration,
        delay,
        chars: [...Array(20)].map(() => ({
          isCyan: Math.random() > 0.8,
          char: Math.random().toString(16).substring(2, 4).toUpperCase()
        }))
      }
    });
  }, []);

  return (
    <>
      <style>{`
        @keyframes hexRain {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .hex-particle {
          animation: hexRain linear infinite;
          will-change: transform;
        }
      `}</style>
      <div className="absolute inset-0 flex justify-around overflow-hidden pointer-events-none z-0">
        {particles.map(({ key, duration, delay, chars }) => (
          <div
            key={key}
            className="font-mono text-xs text-blue-500 flex flex-col space-y-1 hex-particle"
            style={{
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`
            }}
          >
            {chars.map((c, j) => (
              <span key={j} className={c.isCyan ? "text-cyan-300 font-bold" : ""}>
                {c.char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
