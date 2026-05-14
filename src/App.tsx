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
        setIsInHistoricos(true);
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
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-screen pointer-events-none z-0"></div>
      
      {/* Floating Navigation */}
      <div className={`fixed inset-0 z-50 pointer-events-none flex transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isNavTop ? 'items-start justify-center pt-6' : 'max-md:items-end max-md:justify-center max-md:pb-6 md:items-center md:justify-end md:pr-8'}`}>
        <div 
          className={`bg-[#050505]/80 backdrop-blur-md border border-white/10 p-2 rounded-[2rem] flex pointer-events-auto shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isNavTop ? 'flex-row gap-2' : 'max-md:flex-row max-md:gap-2 md:flex-col md:gap-3'}`}
        >
          <button
            onClick={() => { setActiveTab('home'); setActiveSection('inicio'); window.scrollTo(0,0); }}
            className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 text-xs font-bold uppercase tracking-widest group relative ${activeTab === 'home' && activeSection === 'inicio' ? 'text-cyan-50 bg-cyan-500/20 ring-1 ring-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            title="Início"
          >
            {activeTab === 'home' && activeSection === 'inicio' && (
              <span className="absolute inset-0 rounded-full animate-pulse bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.6)] mix-blend-screen pointer-events-none"></span>
            )}
            <Globe className={`w-5 h-5 shrink-0 transition-colors z-10 relative ${activeTab === 'home' && activeSection === 'inicio' ? 'text-cyan-400' : 'group-hover:text-cyan-400'}`} />
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
            <section id="inicio" className="w-full min-h-screen flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto py-20 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8"
              >
                <EarthAnimation />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight max-w-4xl tracking-tight"
              >
                A luta contra as <span className="text-red-500 italic block sm:inline mt-2 sm:mt-0">Fake News</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 text-slate-400 max-w-2xl text-lg md:text-xl leading-relaxed font-light"
              >
                A desinformação se espalha mais rápido que a verdade. Uma plataforma de código aberto para identificar, verificar e deter conteúdos falsos na era da pós-verdade.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-4 items-center justify-center text-[10px] tracking-widest uppercase opacity-60 mt-8"
              >
                <span className="bg-white/10 px-3 py-1 rounded-sm border border-white/5">Nave à Vela - 8º Ano</span>
                <span>Segurança da Informação e Ética em Dados</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-3 items-center justify-center text-[10px] tracking-widest uppercase opacity-50 mt-4 font-mono"
              >
                <span>Gabriel Batista</span>
                <span className="hidden sm:block w-1 h-1 bg-white/30 rounded-full"></span>
                <span>Lucas Gabriel</span>
                <span className="hidden sm:block w-1 h-1 bg-white/30 rounded-full"></span>
                <span>Luiz Felipe</span>
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-16 flex w-full justify-center max-w-xs mx-auto"
              >
                 <a href="#conteudo" className="px-8 py-4 w-full bg-white text-black hover:bg-slate-200 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 rounded-sm group">
                   Descobrir Mais <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                 </a>
              </motion.div>


            </section>

        {/* --- O QUE SÃO FAKE NEWS --- */}
        <section id="conteudo" className="w-full py-32 px-6 bg-[#000000] border-t border-white/10 relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                 <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">O que são Fake News?</h2>
                 <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8">
                   Fake News não são apenas "erros". São manipulações elaboradas, projetadas psicologicamente para gerar <span className="text-white font-medium">indignação, medo ou choque</span>. Ao engatar suas emoções, os criadores desligam seu senso crítico.
                 </p>
                 <div className="space-y-8 mt-12 border-l border-white/10 pl-6">
                   <div className="flex gap-4 group">
                     <AlertCircle className="w-5 h-5 text-slate-300 shrink-0 mt-1" />
                     <div>
                       <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Engenharia Emocional</h3>
                       <p className="text-slate-400 text-sm leading-relaxed">Títulos em CAIXA ALTA com muitos sinais de exclamação (!!!) que tentam causar pânico ou urgência para otimizar métricas de engajamento.</p>
                     </div>
                   </div>
                   <div className="flex gap-4 group">
                     <Brain className="w-5 h-5 text-slate-300 shrink-0 mt-1" />
                     <div>
                       <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Viés de Confirmação</h3>
                       <p className="text-slate-400 text-sm leading-relaxed">Algoritmos capitalizam o viés cognitivo humano, exibindo informações que validam crenças preexistentes, criando câmaras de eco herméticas.</p>
                     </div>
                   </div>
                 </div>
              </div>

              {/* Anatomy Visual Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-[#0a0a0a] border border-red-500/20 rounded-md p-8 relative shadow-2xl z-10 lg:translate-x-4">
                  {/* Falsa urgência Tag - moved higher */}
                  <div className="absolute top-0 left-0 -translate-y-1/2 translate-x-4 sm:translate-x-8 bg-red-600 text-white text-[10px] font-bold px-4 py-2 uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] rounded-full z-20">
                    <XCircle className="w-4 h-4" /> Falsa Urgência
                  </div>
                  
                  {/* Red News Title */}
                  <div className="text-red-500 font-serif text-2xl sm:text-4xl mb-4 leading-tight tracking-tight uppercase font-bold mt-2">
                    ATENÇÃO!!! NOVO VÍRUS DESCOBERTO HOJE MATA EM 24 HORAS!!!
                  </div>
                  <div className="text-xs text-slate-500 mb-6 flex gap-2 items-center">
                    <Globe className="w-3 h-3"/> <span className="underline decoration-red-500/50 decoration-wavy underline-offset-4">alerta-mundial-news-online.net</span>
                  </div>
                  
                  <div className="aspect-[16/9] bg-white/5 rounded-md overflow-hidden relative border border-white/10 group mb-4">
                     {/* Imagem lab/covid */}
                     <img src="https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-1000 group-hover:scale-105" alt="Lab" />
                     <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6">
                        <p className="text-red-400 text-sm font-mono tracking-widest uppercase flex items-center gap-2">
                           <AlertCircle className="w-4 h-4" /> Imagem descontextualizada
                        </p>
                     </div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase border-l-2 border-red-500/50 pl-3 py-1">
                    Obs: Palavras com mais exclamações ("!!!") chamam a atenção do leitor facilmente.
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
                  className="bg-[#050505] border border-white/10 p-8 rounded-sm group hover:border-white/20 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                     <AlertCircle className="w-32 h-32 text-red-500" />
                  </div>
                  <div className="relative z-10 w-full">
                    <div className="text-[10px] uppercase tracking-widest text-red-400 mb-4 font-mono font-bold flex items-center gap-2">
                      <AlertCircle className="w-3 h-3" /> Vetor de Ataque: Engenharia Emocional
                    </div>
                    <h4 className="text-xl text-white font-serif mb-4 leading-snug">
                      "A Falsa Cura Milagrosa"
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed mb-8 font-mono">
                      Arquivos mostram como postagens fraudulentas criaram pânico sobre tratamentos ineficazes. Títulos em caixa alta apelavam para o medo iminente da população ("SALVE SUA FAMÍLIA AGORA"), induzindo um comportamento irracional de compartilhamento sem checagem de fontes médicas oficiais.
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
                  className="bg-[#050505] border border-white/10 p-8 rounded-sm group hover:border-white/20 transition-all relative overflow-hidden flex flex-col"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                     <Brain className="w-32 h-32 text-blue-500" />
                  </div>
                  <div className="relative z-10 w-full flex-grow flex flex-col">
                    <div className="text-[10px] uppercase tracking-widest text-blue-400 mb-4 font-mono font-bold flex items-center gap-2">
                      <Brain className="w-3 h-3" /> Mecanismo: Viés de Confirmação
                    </div>
                    <h4 className="text-xl text-white font-serif mb-4 leading-snug">
                      "Imagens Fora de Contexto"
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed mb-8 font-mono">
                      Um caso clássico ocorreu quando imagens de eventos de 2018 foram republicadas como sendo de protestos políticos recentes. Usuários cuja inclinação política se alinhava com as imagens engajaram massivamente com a publicação, validando falsamente o movimento que nunca aconteceu naquela data.
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
        <section className="w-full py-20 px-6 bg-[#000000] border-t border-t-white/10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 justify-between items-center px-4 md:px-0"
          >
             
             <div className="flex-1 md:pr-12 border-l-2 border-white pl-6">
                <h3 className="text-3xl font-serif text-white mb-4">Metodologia de Veredito</h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md">
                   O processo rigoroso para analisar e identificar vetores de desinformação baseia-se em três etapas de cross-referencing em tempo real.
                </p>
             </div>
             
             <div className="flex-1 grid gap-4 w-full">
                <div className="bg-transparent py-4 border-b border-white/10 flex items-start gap-6 group">
                   <div className="text-lg font-mono text-slate-500 group-hover:text-white transition-colors">01</div>
                   <div className="text-sm md:text-base font-medium text-slate-300">Análise sintática do corpo jornalístico para detectar padrões de manipulação.</div>
                </div>
                <div className="bg-transparent py-4 border-b border-white/10 flex items-start gap-6 group">
                   <div className="text-lg font-mono text-slate-500 group-hover:text-white transition-colors">02</div>
                   <div className="text-sm md:text-base font-medium text-slate-300">Cruzamento de entidades em diretórios e repositórios Open Source Intelligence.</div>
                </div>
                <div className="bg-transparent py-4 border-b border-white/10 flex items-start gap-6 group">
                   <div className="text-lg font-mono text-slate-500 group-hover:text-white transition-colors">03</div>
                   <div className="text-sm md:text-base font-medium text-slate-300">Avaliação temporal e procedência de metadados das imagens submetidas.</div>
                </div>
             </div>
          </motion.div>
        </section>

        {/* --- EXTRA: O FUTURO DA DESINFORMAÇÃO --- */}
        <section id="deepfakes" className="w-full py-32 px-6 bg-[#000000] border-t border-t-white/10 relative overflow-hidden">
           {/* Fundo dinâmico com padrão */}
           <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row gap-16 items-center"
           >
             <div className="flex-1 w-full relative">
                <div className="aspect-square bg-slate-900 border border-white/10 rounded-sm overflow-hidden relative group">
                  <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay z-10 animate-pulse"></div>
                  <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover grayscale transition-transform duration-[2s] group-hover:scale-110" alt="IA e Deepfakes" />
                  <div className="absolute top-4 left-4 right-4 bg-black/80 backdrop-blur-sm border border-white/10 text-white text-[10px] font-mono p-3 uppercase tracking-widest flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    Sintetizando Rosto 3D...
                  </div>
                </div>
             </div>
             
             <div className="flex-1 w-full">
                <div className="px-3 py-1 bg-white/5 border border-white/10 inline-block text-[10px] uppercase font-mono tracking-widest mb-6 font-bold text-slate-300">
                  Nova Fronteira
                </div>
                <h3 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
                  A Ameaça das <span className="italic text-blue-400">Deepfakes</span>
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                  Com o avanço brutal da Inteligência Artificial Generativa, não precisamos mais apenas desmentir textos falsos. A nova era consiste em combater <strong>áudios e vídeos onde pessoas reais parecem falar coisas que jamais disseram</strong>.
                </p>
                
                <ul className="space-y-6 text-sm text-slate-300 font-medium">
                  <li className="flex items-start gap-4 p-4 border border-white/5 rounded-sm bg-white/[0.02]">
                    <span className="text-blue-500 mt-1"><Activity className="w-5 h-5"/></span>
                    <div>
                      <strong className="block text-white mb-1">Clonagem de Voz</strong>
                      Golpistas usam amostras curtas de áudio de parentes para forjar pedidos desesperados de dinheiro no WhatsApp.
                    </div>
                  </li>
                  <li className="flex items-start gap-4 p-4 border border-white/5 rounded-sm bg-white/[0.02]">
                    <span className="text-blue-500 mt-1"><Globe className="w-5 h-5"/></span>
                    <div>
                      <strong className="block text-white mb-1">Fantoches Políticos</strong>
                      Candidatos adversários sendo recriados em vídeos de alta definição cometendo infrações, manipulando eleições diretamente.
                    </div>
                  </li>
                </ul>
                
                <p className="mt-8 text-xs text-slate-500 tracking-wider uppercase font-bold">Nunca confie cegamente. Verifique a fonte e os metadados.</p>
             </div>
           </motion.div>
        </section>

        {/* --- GLOSSÁRIO --- */}
        <section id="glossario" className="w-full py-32 px-6 bg-[#020202] border-t border-t-white/5 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Glossário da Desinformação</h2>
              <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
                Termos-chave essenciais estudados para identificar as novas ameaças digitais.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#050505] border border-white/10 p-6 rounded-sm hover:-translate-y-2 transition-transform duration-300">
                <BookOpen className="w-6 h-6 text-cyan-400 mb-4" />
                <h4 className="text-white font-bold mb-2 uppercase tracking-wide text-sm">Deepfake</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Mídia gerada por Inteligência Artificial que substitui rostos e vozes com realismo extremo para enganar usuários.
                </p>
              </div>
              <div className="bg-[#050505] border border-white/10 p-6 rounded-sm hover:-translate-y-2 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6 text-green-400 mb-4" />
                <h4 className="text-white font-bold mb-2 uppercase tracking-wide text-sm">Open Source Intelligence</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Busca de fontes públicas abertas e cruzamento de dados na internet para validar informações e contextos reais.
                </p>
              </div>
              <div className="bg-[#050505] border border-white/10 p-6 rounded-sm hover:-translate-y-2 transition-transform duration-300">
                <AlertCircle className="w-6 h-6 text-red-500 mb-4" />
                <h4 className="text-white font-bold mb-2 uppercase tracking-wide text-sm">Clickbait</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Títulos iscas, extremamente chamativos ou falsos, com a intenção de lucrar com seus cliques.
                </p>
              </div>
              <div className="bg-[#050505] border border-white/10 p-6 rounded-sm hover:-translate-y-2 transition-transform duration-300">
                <TrendingDown className="w-6 h-6 text-yellow-500 mb-4" />
                <h4 className="text-white font-bold mb-2 uppercase tracking-wide text-sm">Câmaras de Eco</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Ambientes blindados por robôs onde mentiras são repetidas entre o grupo, censurando quem traz as opiniões divergentes reais da rua.
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
          <section id="detector" className="w-full min-h-screen py-32 px-6 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            
            <motion.div
               initial={{ opacity: 0, translateY: 40 }}
               animate={{ opacity: 1, translateY: 0 }}
               transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
               className="relative z-10 w-full"
            >
              <FakeNewsDetector />
            </motion.div>
          </section>
        )}

        {/* --- QUIZ TAB --- */}
        {activeTab === 'quiz' && (
          <section id="quiz" className="w-full min-h-screen py-32 px-6 flex items-center justify-center overflow-hidden">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
               className="max-w-5xl mx-auto flex flex-col items-center w-full"
            >
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">Auditoria Final</h2>
                <p className="text-slate-400 leading-relaxed text-base md:text-lg">
                  Avalie sua capacidade de identificar vetores de desinformação em cenários controlados.
                </p>
              </div>
              <Quiz />
            </motion.div>
          </section>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className="relative w-full py-12 px-6 text-center text-[10px] uppercase tracking-widest text-slate-500 border-t border-white/10 opacity-80 flex flex-col items-center justify-center gap-6 z-10 bg-[#020202]">
        <div className="flex gap-4">
           <Globe className="w-4 h-4 opacity-50"/>
           <ShieldCheck className="w-4 h-4 opacity-50"/>
           <Brain className="w-4 h-4 opacity-50"/>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-12 text-slate-400">
          <p className="font-medium">Segurança Online com Nave à Vela - Oitavo Ano</p>
          <p className="hidden md:block opacity-30">•</p>
          <p>Gabriel Batista, Lucas Gabriel, Luiz Felipe</p>
        </div>
      </footer>
    </div>
  );
}
