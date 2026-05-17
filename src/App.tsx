import React, { useState, useEffect } from 'react';
import EarthAnimation from './components/EarthAnimation';
import FakeNewsDetector from './components/FakeNewsDetector';
import Quiz from './components/Quiz';
import TrainingManual from './components/TrainingManual';
import { Search, Brain, BookOpen, AlertCircle, ArrowDown, ShieldCheck, CheckSquare, Globe, AlertTriangle, XCircle, TrendingDown, ArrowRight, Loader2, Activity } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeSection, setActiveSection] = useState('inicio');
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();
  
  const [isInHistoricos, setIsInHistoricos] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
    
    if (activeTab === 'home') {
      const conteudoEl = document.getElementById('conteudo');
      const impactosEl = document.getElementById('impactos');
      const deepfakesEl = document.getElementById('deepfakes');
      const glossarioEl = document.getElementById('glossario');
      
      const threshold = (typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

      const isScrolledPast = (el: HTMLElement | null) => el && latest >= (el.offsetTop - threshold);

      if (isScrolledPast(glossarioEl)) {
        setActiveSection('glossario');
        setIsInHistoricos(false);
      } else if (isScrolledPast(deepfakesEl)) {
        setActiveSection('deepfakes');
        setIsInHistoricos(true);
      } else if (isScrolledPast(impactosEl)) {
        setActiveSection('impactos');
        setIsInHistoricos(false);
      } else if (isScrolledPast(conteudoEl)) {
        setActiveSection('conteudo');
        setIsInHistoricos(true);
      } else {
        setActiveSection('inicio');
        setIsInHistoricos(false);
      }
    } else {
      setIsInHistoricos(false);
    }
  });

  const isNavTop = activeTab !== 'home' || isInHistoricos;
  const isNavBottom = activeTab === 'home' && activeSection === 'glossario';
  const showNavText = !isScrolled && !isInHistoricos;

  useEffect(() => {
    // Force start at top
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative w-full overflow-x-hidden font-sans bg-[#000000]">
      {/* Subtle Background Textures */}
      <div className="fixed top-0 left-0 right-0 h-full bg-[radial-gradient(ellipse_at_top,#0a0a0a_0%,#000000_100%)] pointer-events-none z-0"></div>
      
      {/* Animated Glowing Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[150px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
         <div className="absolute top-[40%] left-[60%] w-[20%] h-[30%] rounded-full bg-red-600/5 blur-[100px] mix-blend-screen animate-[pulse_12s_ease-in-out_infinite]"></div>
      </div>

      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-screen pointer-events-none z-0"></div>
      
      {/* Floating Navigation */}
      <div className={`fixed inset-0 z-50 pointer-events-none flex transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isNavTop ? 'items-start justify-center pt-6' : isNavBottom ? 'items-end justify-center pb-8' : 'max-md:items-end max-md:justify-center max-md:pb-6 md:items-center md:justify-end md:pr-8'}`}>
        <div 
          className={`bg-[#050505]/80 backdrop-blur-md border border-white/10 p-2 rounded-[2rem] flex pointer-events-auto shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isNavTop || isNavBottom ? 'flex-row gap-2' : 'max-md:flex-row max-md:gap-2 md:flex-col md:gap-3'}`}
        >
          <button
            onClick={() => { setActiveTab('home'); setActiveSection('inicio'); window.scrollTo(0,0); }}
            className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 text-xs font-bold uppercase tracking-widest group relative ${activeTab === 'home' ? 'text-cyan-50 bg-cyan-500/20 ring-1 ring-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            title="Início"
          >
            {activeTab === 'home' && (
              <span className="absolute inset-0 rounded-full animate-pulse bg-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.6)] mix-blend-screen pointer-events-none"></span>
            )}
            <Globe className={`w-5 h-5 shrink-0 transition-colors z-10 relative ${activeTab === 'home' ? 'text-cyan-300' : 'text-cyan-500 group-hover:text-cyan-400'}`} />
            <span className={`overflow-hidden transition-all duration-500 whitespace-nowrap z-10 relative max-md:hidden ${showNavText ? 'max-w-[100px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0'}`}>Início</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('home'); setActiveSection('impactos'); setTimeout(() => document.getElementById('impactos')?.scrollIntoView({ behavior: 'smooth' }), 50); }}
            className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 text-xs font-bold uppercase tracking-widest group relative ${activeTab === 'home' && activeSection === 'impactos' ? 'text-red-50 bg-red-500/20 ring-1 ring-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            title="Impactos"
          >
            {activeTab === 'home' && activeSection === 'impactos' && (
              <span className="absolute inset-0 rounded-full animate-pulse bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.6)] mix-blend-screen pointer-events-none"></span>
            )}
            <AlertTriangle className={`w-5 h-5 shrink-0 transition-colors z-10 relative ${activeTab === 'home' && activeSection === 'impactos' ? 'text-red-400' : 'text-yellow-500 group-hover:text-red-500'}`} />
            <span className={`overflow-hidden transition-all duration-500 whitespace-nowrap z-10 relative max-md:hidden ${showNavText ? 'max-w-[100px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0'}`}>Impactos</span>
          </button>

          <button
            onClick={() => { setActiveTab('home'); setActiveSection('deepfakes'); setTimeout(() => document.getElementById('deepfakes')?.scrollIntoView({ behavior: 'smooth' }), 50); }}
            className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 text-xs font-bold uppercase tracking-widest group relative ${activeTab === 'home' && activeSection === 'deepfakes' ? 'text-purple-50 bg-purple-500/20 ring-1 ring-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            title="Deepfakes"
          >
            {activeTab === 'home' && activeSection === 'deepfakes' && (
              <span className="absolute inset-0 rounded-full animate-pulse bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.6)] mix-blend-screen pointer-events-none"></span>
            )}
            <Activity className={`w-5 h-5 shrink-0 transition-colors z-10 relative ${activeTab === 'home' && activeSection === 'deepfakes' ? 'text-purple-400' : 'text-purple-500 group-hover:text-purple-400'}`} />
            <span className={`overflow-hidden transition-all duration-500 whitespace-nowrap z-10 relative max-md:hidden ${showNavText ? 'max-w-[100px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0'}`}>Deepfakes</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('detector'); window.scrollTo(0,0); }}
            className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 text-xs font-bold uppercase tracking-widest group relative ${activeTab === 'detector' ? 'text-blue-50 bg-blue-500/20 ring-1 ring-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            title="Detector"
          >
            {activeTab === 'detector' && (
              <span className="absolute inset-0 rounded-full animate-pulse bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.6)] mix-blend-screen pointer-events-none"></span>
            )}
            <ShieldCheck className={`w-5 h-5 shrink-0 transition-colors z-10 relative ${activeTab === 'detector' ? 'text-blue-400' : 'text-blue-500 group-hover:text-blue-400'}`} />
            <span className={`overflow-hidden transition-all duration-500 whitespace-nowrap z-10 relative max-md:hidden ${showNavText ? 'max-w-[120px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0'}`}>Detector</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('quiz'); window.scrollTo(0,0); }}
            className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 text-xs font-bold uppercase tracking-widest group relative ${activeTab === 'quiz' ? 'text-green-50 bg-green-500/20 ring-1 ring-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'text-green-500 hover:bg-white/5 hover:text-green-400'}`}
            title="Quiz"
          >
             {activeTab === 'quiz' && (
              <span className="absolute inset-0 rounded-full animate-pulse bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.6)] mix-blend-screen pointer-events-none" style={{ animationDuration: '2s' }}></span>
            )}
            <CheckSquare className={`w-5 h-5 shrink-0 transition-colors z-10 relative text-green-400 group-hover:text-green-300`} />
            <span className={`overflow-hidden transition-all duration-500 whitespace-nowrap z-10 relative max-md:hidden ${showNavText ? 'max-w-[100px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0'}`}>Quiz</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10 flex flex-col items-center">
        
        {activeTab === 'home' && (
          <>
            {/* --- HERO SECTION --- */}
            <section id="inicio" className="w-full min-h-screen flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto py-20 relative overflow-hidden">
              
              {/* Subtle Grid behind Hero */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none -z-10"></div>
              
              {/* Animated Glow Orbs */}
              <motion.div 
                 animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
                 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-1/4 left-0 md:left-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" 
              />
              <motion.div 
                 animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} 
                 transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute bottom-1/4 right-0 md:right-1/4 w-64 md:w-96 h-64 md:h-96 bg-red-600/20 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" 
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8 relative z-10"
              >
                <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full scale-150"></div>
                <EarthAnimation />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.05] max-w-5xl tracking-tighter relative z-10"
              >
                A luta contra as <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-400 italic block mt-2 sm:mt-4 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse">Fake News</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 text-slate-300 max-w-2xl text-lg md:text-xl leading-relaxed font-light relative z-10 drop-shadow-md mx-auto"
              >
                A desinformação se espalha mais rápido que a verdade. Uma plataforma de código aberto para identificar, verificar e deter conteúdos falsos na era da pós-verdade.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-4 items-center justify-center text-[10px] tracking-widest uppercase opacity-90 mt-10 relative z-10 font-bold"
              >
                <div className="relative group">
                   <div className="absolute inset-0 bg-blue-400/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <span className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lg relative z-10 block">Nave à Vela - 8º Ano</span>
                </div>
                <span className="text-blue-300 px-4 py-2 bg-blue-500/5 rounded-full border border-blue-500/10">Segurança da Informação e Ética em Dados</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-3 items-center justify-center text-[10px] tracking-widest uppercase opacity-60 mt-6 font-mono bg-black/30 px-6 py-2 rounded-full border border-white/5 backdrop-blur-sm"
              >
                <span className="hover:text-white transition-colors cursor-default">Gabriel Batista</span>
                <span className="hidden sm:block w-1 h-1 bg-white/30 rounded-full"></span>
                <span className="hover:text-white transition-colors cursor-default">Lucas Gabriel</span>
                <span className="hidden sm:block w-1 h-1 bg-white/30 rounded-full"></span>
                <span className="hover:text-white transition-colors cursor-default">Luiz Felipe</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center text-[10px] tracking-widest uppercase opacity-40 mt-3 font-mono"
              >
                Oásis Colégio e Curso
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1], type: "spring" }}
                className="mt-16 flex w-full justify-center max-w-xs mx-auto relative z-10"
              >
                 <a href="#conteudo" className="px-8 py-5 w-full bg-white text-black hover:bg-slate-200 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 rounded-full group shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                   <span className="relative z-10 flex items-center gap-3">Descobrir Mais <ArrowDown className="w-5 h-5 group-hover:translate-y-1 group-hover:opacity-100 opacity-70 transition-all" /></span>
                 </a>
              </motion.div>
            </section>

        {/* --- O QUE SÃO FAKE NEWS --- */}
        <section id="conteudo" className="w-full py-32 px-6 bg-[#020202] border-t border-white/5 relative z-10">
          {/* Cyber lines decor */}
          <div className="absolute left-0 top-0 w-1 h-32 bg-gradient-to-b from-red-500 to-transparent opacity-50"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto relative pl-4 md:pl-0"
          >
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                 <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">O que são Fake News?</h2>
                 <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8">
                   Fake News não são apenas erros. São mentiras criadas de propósito para causar <span className="text-white font-medium text-red-200">raiva, medo ou choque</span>. Ao brincar com as suas emoções, elas fazem com que você pare de pensar criticamente.
                 </p>
                 <div className="space-y-8 mt-12 border-l border-red-500/30 pl-8 ml-2 relative">
                   {/* Animated pulse on timeline */}
                   <div className="absolute -left-[5px] top-6 w-2 h-2 rounded-full bg-red-500 animate-[ping_3s_ease-in-out_infinite]"></div>
                   <div className="absolute -left-[5px] bottom-6 w-2 h-2 rounded-full bg-cyan-500 animate-[ping_5s_ease-in-out_infinite]"></div>

                   <motion.div 
                     initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                     className="flex gap-5 group p-5 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                   >
                     <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                     <div>
                       <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-2 group-hover:text-red-400 transition-colors">Apelo Emocional</h3>
                       <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">Títulos todos em MAIÚSCULAS e cheios de exclamações (!!!) que tentam causar pânico ou urgência para fazer você clicar e compartilhar logo.</p>
                     </div>
                   </motion.div>
                   <motion.div 
                     initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                     className="flex gap-5 group p-5 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                   >
                     <Brain className="w-6 h-6 text-cyan-500 shrink-0 mt-1" />
                     <div>
                       <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-2 group-hover:text-cyan-400 transition-colors">Criando Bolhas</h3>
                       <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">As redes sociais nos mostram coisas que já concordamos, criando "bolhas" onde as mesmas informações (verdadeiras ou falsas) ficam se repetindo.</p>
                     </div>
                   </motion.div>
                 </div>
              </div>

              {/* Anatomy Visual Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative perspective-1000"
              >
                <div className="bg-[#050505]/80 backdrop-blur-3xl border border-red-500/20 rounded-[2rem] p-8 md:p-10 relative shadow-[0_20px_50px_rgba(220,38,38,0.1)] z-10 lg:translate-x-4 hover:shadow-[0_20px_70px_rgba(220,38,38,0.2)] hover:-translate-y-2 transition-all duration-700">
                  {/* Falsa urgência Tag - moved higher */}
                  <div className="absolute top-0 right-0 -translate-y-1/2 -translate-x-8 bg-red-600 text-white text-[10px] font-bold px-4 py-2 uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] rounded-full z-20">
                    <XCircle className="w-4 h-4" /> Falsa Urgência
                  </div>
                  
                  {/* Red News Title */}
                  <div className="text-red-500 font-serif text-2xl sm:text-3xl lg:text-4xl mb-6 leading-[1.1] tracking-tight uppercase font-black mt-2 drop-shadow-md">
                    ATENÇÃO!!! NOVO VÍRUS DESCOBERTO HOJE MATA EM 24 HORAS!!!
                  </div>
                  <div className="text-xs text-slate-500 mb-6 flex gap-2 items-center bg-[#000000] p-2 rounded-lg border border-white/5 w-fit">
                    <Globe className="w-4 h-4 text-red-500/70"/> <span className="underline decoration-red-500/50 decoration-wavy underline-offset-4">alerta-mundial-news-online.net</span>
                  </div>
                  
                  <div className="aspect-[16/9] bg-white/5 rounded-2xl overflow-hidden relative border border-white/10 group mb-6 shadow-inner">
                     {/* Imagem lab/covid */}
                     <img src="https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-1000 group-hover:scale-110" alt="Lab" />
                     <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pb-4">
                        <p className="text-red-400 text-sm font-mono tracking-widest uppercase flex items-center gap-2 drop-shadow-md">
                           <AlertCircle className="w-5 h-5 animate-pulse" /> Imagem descontextualizada
                        </p>
                     </div>
                  </div>
                  <div className="text-[10px] md:text-xs text-slate-400 font-mono tracking-widest border-l-2 border-red-500/50 pl-4 py-2 bg-red-500/5 rounded-r-xl">
                    <strong className="text-red-400 mr-2 uppercase">Obs:</strong> Palavras com mais exclamações ("!!!") chamam a atenção incitando medo imediato.
                  </div>
                </div>
              </motion.div>
            </div>

            {/* --- MANUAL DE TREINAMENTO --- */}
            <TrainingManual />

            {/* --- ESTUDOS DE CASO / EXEMPLOS --- */}
            <div id="historicos" className="mt-24 pt-16 border-t border-white/10">
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-serif text-white mb-10 text-center"
              >
                Registros Históricos Verificados
              </motion.h3>
              <div className="grid md:grid-cols-2 gap-8">
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-[#050505]/80 backdrop-blur-md border border-white/5 p-8 rounded-xl group hover:border-red-500/30 hover:bg-[#0a0a0a] transition-all relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                     <AlertCircle className="w-32 h-32 text-red-500" />
                  </div>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10 w-full">
                    <div className="text-[10px] uppercase tracking-widest text-red-400 mb-4 font-mono font-bold flex items-center gap-2">
                      <AlertCircle className="w-3 h-3" /> Mecanismo: Apelo Emocional
                    </div>
                    <h4 className="text-xl text-white font-serif mb-4 leading-snug">
                      "A Falsa Cura Milagrosa"
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed mb-8 font-mono">
                      Postagens mentirosas criaram pânico sobre tratamentos que não funcionavam. Os textos usavam o medo da população ("SALVE SUA FAMÍLIA AGORA") para fazer com que as pessoas compartilhassem a notícia sem antes confirmar com médicos reais.
                    </p>
                    <a href="https://aosfatos.org/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 hover:text-white transition-colors font-bold uppercase tracking-widest flex flex-col gap-2 group-hover:gap-3 items-start border-t border-white/10 pt-4 mt-auto">
                      <span>Para checar notícias reais como essa ilustrada acima:</span>
                      <span className="flex items-center gap-2 text-cyan-500">
                        Acesse a Agência Aos Fatos <ArrowRight className="w-4 h-4" />
                      </span>
                    </a>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-[#050505]/80 backdrop-blur-md border border-white/5 p-8 rounded-xl group hover:border-blue-500/30 hover:bg-[#0a0a0a] transition-all relative overflow-hidden flex flex-col shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                     <Brain className="w-32 h-32 text-blue-500" />
                  </div>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10 w-full flex-grow flex flex-col">
                    <div className="text-[10px] uppercase tracking-widest text-blue-400 mb-4 font-mono font-bold flex items-center gap-2">
                      <Brain className="w-3 h-3" /> Mecanismo: Imagens Manipuladas
                    </div>
                    <h4 className="text-xl text-white font-serif mb-4 leading-snug">
                      "Imagens Fora de Contexto"
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed mb-8 font-mono">
                      Em vários casos, imagens de protestos e eventos de anos atrás foram compartilhadas como se tivessem acontecido ontem. As pessoas acabaram acreditando e compartilhando em massa, espalhando a mentira sem perceber.
                    </p>
                    <a href="https://lupa.uol.com.br/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 hover:text-white transition-colors font-bold uppercase tracking-widest flex flex-col gap-2 group-hover:gap-3 items-start border-t border-white/10 pt-4 mt-auto">
                       <span>Para ver investigações reais sobre manipulação visual:</span>
                       <span className="flex items-center gap-2 text-blue-500">
                        Acesse a Agência Lupa <ArrowRight className="w-4 h-4" />
                       </span>
                    </a>
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </section>

        {/* --- IMPACTO REAL DE FAKE NEWS --- */}
        <section id="impactos" className="w-full py-32 px-6 bg-[#020202] border-t border-white/5">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-6xl mx-auto"
          >
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-center mb-20 max-w-3xl mx-auto"
             >
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Impactos Reais no Mundo</h2>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                  A desinformação vai muito além da internet. Ela causa danos físicos, polarização extrema e prejuízos duradouros à sociedade global.
                </p>
             </motion.div>

             <div className="grid md:grid-cols-3 gap-8 md:gap-12">
               <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="group cursor-pointer"
               >
                 <div className="overflow-hidden mb-6 bg-[#0a0a0a] aspect-[4/3] border border-white/5 relative rounded-sm">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100" alt="Saúde Pública" />
                </div>
                <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-3">
                  Saúde Pública
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Informações falsas sobre curas milagrosas e campanhas antivacina causam o retorno de doenças outrora erradicadas, expondo milhares a riscos fatais.
                </p>
               </motion.div>

               <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="group cursor-pointer"
               >
                 <div className="overflow-hidden mb-6 bg-[#0a0a0a] aspect-[4/3] border border-white/5 relative rounded-sm">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100" alt="Democracia" />
                </div>
                <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-3">
                  Tensões Democráticas
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Rumores plantados, disparos em massa e manipulações geram polarização política desenfreada, corroendo a confiança nas instituições.
                </p>
               </motion.div>

               <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="group cursor-pointer"
               >
                 <div className="overflow-hidden mb-6 bg-[#0a0a0a] aspect-[4/3] border border-white/5 relative rounded-sm">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src="https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100" alt="Economia e Fraudes" />
                </div>
                <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-3">
                  Golpes Virtuais
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Fake News frequentemente servem como isca para phishing. Histórias sobre dinheiro fácil e ameaças bancárias são projetadas para o roubo de dados.
                </p>
               </motion.div>
             </div>
          </motion.div>
        </section>

        {/* --- DICAS RÁPIDAS --- */}
        <section className="w-full py-24 px-6 bg-[#000000] border-t border-t-white/10 relative overflow-hidden">
          {/* Subtle Cyber Waves */}
          <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 justify-between items-center px-4 md:px-0"
          >
             
             <div className="flex-1 md:pr-12 border-l-2 border-white pl-6">
                <h3 className="text-3xl font-serif text-white mb-4">Como Verificar uma Notícia</h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md">
                   Siga estes três passos simples para descobrir se uma notícia ou imagem é verdadeira ou falsa.
                </p>
             </div>
             
              <div className="flex-1 grid gap-4 w-full relative z-10">
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/5 flex items-start gap-6 group hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all">
                   <div className="text-2xl font-serif italic text-slate-600 group-hover:text-blue-400 transition-colors">01</div>
                   <div className="text-sm md:text-base font-medium text-slate-300">Leia a notícia inteira prestando atenção em títulos exagerados ou informações sem sentido.</div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/5 flex items-start gap-6 group hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all">
                   <div className="text-2xl font-serif italic text-slate-600 group-hover:text-cyan-400 transition-colors">02</div>
                   <div className="text-sm md:text-base font-medium text-slate-300">Pesquise a mesma informação em outros sites e jornais diferentes e confiáveis.</div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/5 flex items-start gap-6 group hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all">
                   <div className="text-2xl font-serif italic text-slate-600 group-hover:text-purple-400 transition-colors">03</div>
                   <div className="text-sm md:text-base font-medium text-slate-300">Faça uma busca reversa da imagem no Google para ver se ela não é de anos atrás.</div>
                </div>
             </div>
          </motion.div>
        </section>

        {/* --- EXTRA: O FUTURO DA DESINFORMAÇÃO --- */}
        <section id="deepfakes" className="w-full pt-32 pb-24 px-6 bg-[#020202] border-t border-t-white/10 relative overflow-hidden z-10">
           {/* Fundo dinâmico com padrão */}
           <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
           
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row gap-16 items-center"
           >
             <div className="flex-1 w-full relative">
                <div className="aspect-square bg-slate-900 border border-white/10 rounded-sm overflow-hidden relative group mb-6">
                  <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay z-10 animate-pulse"></div>
                  <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover grayscale transition-transform duration-[2s] group-hover:scale-110" alt="IA e Deepfakes" />
                  <div className="absolute top-4 left-4 right-4 bg-black/80 backdrop-blur-sm border border-white/10 text-white text-[10px] font-mono p-3 uppercase tracking-widest flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    Sintetizando Rosto 3D...
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-center text-center gap-3 p-4 border border-white/5 rounded-sm bg-white/[0.02]">
                     <span className="text-blue-500"><AlertTriangle className="w-5 h-5"/></span>
                     <div className="text-sm text-slate-300 font-medium">
                       <strong className="block text-white mb-1">Combate à Bots e Contas Falsas</strong>
                       Como identificar e neutralizar perfis automatizados (bots) e contas falsas que amplificam desinformação nas redes sociais.
                     </div>
                  </div>
                  <div className="flex flex-col items-center text-center gap-3 p-4 border border-white/5 rounded-sm bg-white/[0.02]">
                     <span className="text-purple-500"><ShieldCheck className="w-5 h-5"/></span>
                     <div className="text-sm text-slate-300 font-medium">
                       <strong className="block text-white mb-1">Promoção de Fontes Confiáveis</strong>
                       Como facilitar o acesso a informações verificadas, jornalismo de qualidade e conhecimento científico confiável.
                     </div>
                  </div>
                </div>
             </div>
             
             <div className="flex-1 w-full">
                <div className="px-3 py-1 bg-white/5 border border-white/10 inline-block text-[10px] uppercase font-mono tracking-widest mb-6 font-bold text-slate-300">
                  Nova Tecnologia
                </div>
                <h3 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
                  A Ameaça das <span className="italic text-blue-400">Deepfakes</span>
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                  Com o avanço rápido da Inteligência Artificial, o problema não são mais apenas os textos falsos. Agora, o perigo são os <strong>áudios e vídeos falsificados onde pessoas reais parecem falar ou fazer coisas que nunca fizeram</strong>.
                </p>
                
                <ul className="space-y-6 text-sm text-slate-300 font-medium">
                  <li className="flex items-start gap-4 p-4 border border-white/5 rounded-sm bg-white/[0.02]">
                    <span className="text-blue-500 mt-1"><Activity className="w-5 h-5"/></span>
                    <div>
                      <strong className="block text-white mb-1">Clonagem de Voz</strong>
                      Golpistas usam ferramentas de Inteligência Artificial para copiar a voz de parentes para pedir dinheiro emprestado no WhatsApp.
                    </div>
                  </li>
                  <li className="flex items-start gap-4 p-4 border border-white/5 rounded-sm bg-white/[0.02]">
                    <span className="text-blue-500 mt-1"><Globe className="w-5 h-5"/></span>
                    <div>
                      <strong className="block text-white mb-1">Pessoas Famosas</strong>
                      Candidatos e pessoas famosas são recriados em vídeos para parecer que cometeram crimes ou falaram mentiras.
                    </div>
                  </li>
                  <li className="flex items-start gap-4 p-4 border border-white/5 rounded-sm bg-white/[0.02]">
                    <span className="text-blue-500 mt-1"><Brain className="w-5 h-5"/></span>
                    <div>
                      <strong className="block text-white mb-1">Identificando Deepfakes</strong>
                      Aprenda a notar sinais de que um vídeo é falso, como imagens com falhas e piscar de olhos estranho ou artificial.
                    </div>
                  </li>
                </ul>
                
                <p className="mt-8 text-xs text-slate-500 tracking-wider uppercase font-bold">Nunca confie cegamente. Verifique a fonte e os metadados.</p>
             </div>
           </motion.div>
        </section>

        {/* --- GLOSSÁRIO --- */}
        <section id="glossario" className="w-full py-32 px-6 bg-[#000000] border-t border-t-white/5 relative z-10">
          <div className="absolute top-0 right-0 w-2/3 h-[500px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Termos Importantes</h2>
              <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
                Termos-chave essenciais estudados para identificar as novas ameaças digitais.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#050505]/60 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:-translate-y-2 hover:border-cyan-500/30 hover:shadow-[0_10px_30px_rgba(34,211,238,0.1)] transition-all duration-300">
                <BookOpen className="w-8 h-8 text-cyan-400 mb-6" />
                <h4 className="text-white font-bold mb-3 uppercase tracking-wide text-sm">Deepfake</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Mídia criada ou alterada por Inteligência Artificial que copia o rosto ou voz de alguém para tentar enganar as pessoas.
                </p>
              </div>
              <div className="bg-[#050505]/60 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:-translate-y-2 hover:border-green-500/30 hover:shadow-[0_10px_30px_rgba(34,197,94,0.1)] transition-all duration-300">
                <ShieldCheck className="w-8 h-8 text-green-400 mb-6" />
                <h4 className="text-white font-bold mb-3 uppercase tracking-wide text-sm">Investigação Inteligente</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Busca de informações em sites públicos, jornais confiáveis e redes para tentar descobrir o que é real e o que não é.
                </p>
              </div>
              <div className="bg-[#050505]/60 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:-translate-y-2 hover:border-red-500/30 hover:shadow-[0_10px_30px_rgba(239,68,68,0.1)] transition-all duration-300">
                <AlertCircle className="w-8 h-8 text-red-500 mb-6" />
                <h4 className="text-white font-bold mb-3 uppercase tracking-wide text-sm">Clickbait</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Títulos iscas, extremamente chamativos ou falsos, com a intenção de lucrar com seus cliques.
                </p>
              </div>
              <div className="bg-[#050505]/60 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:-translate-y-2 hover:border-yellow-500/30 hover:shadow-[0_10px_30px_rgba(234,179,8,0.1)] transition-all duration-300">
                <TrendingDown className="w-8 h-8 text-yellow-500 mb-6" />
                <h4 className="text-white font-bold mb-3 uppercase tracking-wide text-sm">Bolhas Virtuais</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Ambientes onde uma mesma mentira é falada várias vezes, fazendo com que as pessoas ignorem tudo o que é diferente do que elas já acreditam.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- DETECTOR E QUIZ WRAP -- REPLACE ORIGINAL ONES --- */}
          </>
        )}

        {/* --- DETECTOR TAB --- */}
        {activeTab === 'detector' && (
          <section id="detector" className="w-full min-h-screen py-32 px-6 flex flex-col items-center relative overflow-hidden bg-[#000000]">
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-to-tr from-blue-600/[0.05] via-transparent to-cyan-400/[0.05] blur-[100px] rounded-full pointer-events-none"></div>
            
            {/* Minimal Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <motion.div
               initial={{ opacity: 0, translateY: 40 }}
               animate={{ opacity: 1, translateY: 0 }}
               transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
               className="relative z-10 w-full mt-10"
            >
              <FakeNewsDetector />
            </motion.div>
          </section>
        )}

        {/* --- QUIZ TAB --- */}
        {activeTab === 'quiz' && (
          <section id="quiz" className="w-full min-h-screen py-32 px-6 flex items-center justify-center overflow-hidden relative bg-[#020202]">
            {/* Hacker Quiz Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.05)_0%,transparent_70%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
               className="max-w-5xl mx-auto flex flex-col items-center w-full"
            >
              <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-2 border border-green-500/30 bg-green-500/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-green-400 mb-2 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                >
                  Ambiente de Teste Fechado
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-serif text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 tracking-tight">Avaliação Cognitiva</h2>
                <p className="text-slate-400 leading-relaxed text-base md:text-lg max-w-xl mx-auto">
                  Teste o que você aprendeu no nosso Manual de Sobrevivência. Descubra as armadilhas e veja se seu cérebro já está treinado.
                </p>
              </div>

              <Quiz />
            </motion.div>
          </section>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className="relative w-full py-6 px-6 text-[10px] uppercase tracking-widest text-slate-500 border-t border-white/10 opacity-80 z-10 bg-[#020202]">
        <div className="flex gap-4 justify-center items-center mb-4">
           <Globe className="w-4 h-4 opacity-40"/>
           <ShieldCheck className="w-4 h-4 opacity-40"/>
           <Brain className="w-4 h-4 opacity-40"/>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
          <p className="font-medium text-center md:text-left">Segurança Online com Nave à Vela - Oitavo Ano</p>
          <p className="flex gap-2 items-center text-center md:text-right">
            <span>Gabriel Batista</span>
            <span className="opacity-30">•</span>
            <span>Lucas Gabriel</span>
            <span className="opacity-30">•</span>
            <span>Luiz Felipe</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
