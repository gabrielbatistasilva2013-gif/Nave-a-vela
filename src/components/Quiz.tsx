import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

type Question = {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

const questions: Question[] = [
  {
    id: 1,
    question: "O que você deve fazer ao ler uma manchete muito sensacionalista ou escandalosa?",
    options: [
      "Compartilhar imediatamente com amigos e familiares.",
      "Ler a notícia completa e verificar a fonte original.",
      "Comentar na postagem sem ler o conteúdo.",
      "Acreditar se tiver muitas curtidas."
    ],
    correct: 1,
    explanation: "Manchetes sensacionalistas são feitas para gerar cliques. Sempre leia o texto inteiro e verifique se a fonte é um site jornalístico confiável."
  },
  {
    id: 2,
    question: "Você recebeu uma imagem chocante no WhatsApp sobre um evento recente. Como testar se é real?",
    options: [
      "Fazer uma pesquisa reversa de imagem no Google.",
      "Confiar, pois a imagem não pode ser alterada.",
      "Perguntar no grupo se alguém mais recebeu.",
      "Verificar se o logotipo de alguma emissora está nela."
    ],
    correct: 0,
    explanation: "Imagens podem ser facilmente editadas ou tiradas de contexto (fotos antigas usadas em eventos novos). A pesquisa reversa ajuda a encontrar a origem."
  },
  {
    id: 3,
    question: "Por que conferir a data da notícia é um passo importante?",
    options: [
      "Para desejar feliz aniversário ao autor.",
      "Para confirmar se a notícia é sobre um evento histórico.",
      "Porque notícias antigas costumam ser compartilhadas como se fossem de hoje para gerar indignação.",
      "Não é um passo importante, o que importa é o conteúdo."
    ],
    correct: 2,
    explanation: "Uma tática comum de desinformação é pegar notícias reais do passado e compartilhá-las como se tivessem acabado de acontecer."
  },
  {
    id: 4,
    question: "Uma reportagem confirmando as suas crenças mais profundas chega até você. Qual o viés mais perigoso aqui?",
    options: [
      "Viés de confirmação: acreditamos mais facilmente em coisas que concordamos.",
      "Viés da ignorância: não sabemos do que se trata.",
      "Viés de negatividade: tudo que é ruim atrai cliques.",
      "Viés político: tudo tem um lado partidário."
    ],
    correct: 0,
    explanation: "O viés de confirmação nos faz baixar a guarda e interagir/compartilhar informações falsas que validam a nossa própria visão de mundo."
  }
];

export default function Quiz() {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  React.useEffect(() => {
    setShuffledQuestions([...questions].sort(() => Math.random() - 0.5));
  }, []);

  const handleSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);
    
    if (idx === shuffledQuestions[currentQ].correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < shuffledQuestions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setShuffledQuestions([...questions].sort(() => Math.random() - 0.5));
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setHasAnswered(false);
  };

  if (shuffledQuestions.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col relative overflow-hidden bg-[#050505] border border-white/10 p-8">
      {!showResult ? (
        <div className="relative z-10 w-full flex flex-col">
          <div className="flex justify-between items-center mb-6 text-[10px] tracking-widest uppercase text-slate-500 font-mono">
            <span>
              Questionamento {currentQ + 1} de {shuffledQuestions.length}
            </span>
            <div className="flex gap-1">
              {shuffledQuestions.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2 h-1 transition-colors",
                    i === currentQ ? "bg-white" : i < currentQ ? "bg-slate-700" : "bg-white/10"
                  )}
                />
              ))}
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-serif text-white mb-8 border-l border-white/20 pl-4">
            {shuffledQuestions[currentQ].question}
          </h3>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {shuffledQuestions[currentQ].options.map((opt, idx) => {
                const isCorrect = idx === shuffledQuestions[currentQ].correct;
                const isSelected = selectedOption === idx;
                
                let btnStyle = "bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/30";
                
                if (hasAnswered) {
                  if (isSelected && !isCorrect) {
                    btnStyle = "bg-red-950/30 border-red-900/50 text-red-400";
                  } else if (isCorrect) {
                     btnStyle = "bg-emerald-950/30 border-emerald-900/50 text-emerald-400";
                  } else {
                     btnStyle = "bg-transparent border-white/5 text-slate-600 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasAnswered}
                    onClick={() => handleSelect(idx)}
                    className={cn(
                      "w-full text-left p-4 border text-sm transition-all duration-200 flex justify-between items-center group font-mono",
                      btnStyle
                    )}
                  >
                    <div className="flex items-start gap-4">
                      {hasAnswered && isCorrect ? (
                        <div className="text-emerald-500 font-bold mt-0.5">✓</div>
                      ) : hasAnswered && isSelected && !isCorrect ? (
                        <div className="text-red-500 font-bold mt-0.5">✕</div>
                      ) : (
                        <div className="w-3 h-3 border border-slate-600 mt-1"></div>
                      )}
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </AnimatePresence>
          </div>

          {hasAnswered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 border border-white/5 text-slate-300 text-xs leading-relaxed font-mono bg-white/5"
            >
              <strong className="block text-white mb-2 tracking-widest uppercase text-[10px]">Análise de Resultado</strong>
              {shuffledQuestions[currentQ].explanation}
            </motion.div>
          )}

          <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
            <button
               onClick={nextQuestion}
               disabled={!hasAnswered}
               className="px-6 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-mono"
            >
              {currentQ === shuffledQuestions.length - 1 ? 'Gerar Relatório' : 'Avançar >>>'}
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center py-10 flex flex-col items-center"
        >
          <div className="text-[10px] tracking-widest uppercase text-slate-500 font-mono border border-white/10 px-3 py-1 mb-6">Status Finalizado</div>
          <h2 className="text-4xl font-serif text-white mb-4">Relatório de Auditoria</h2>
          <p className="text-slate-400 mb-8 max-w-sm font-mono text-sm leading-relaxed">
            Taxa de acertos: <span className="text-white font-bold">{score}</span> / <span className="text-white font-bold">{shuffledQuestions.length}</span>
          </p>
          
          <div className="p-6 bg-[#050505] border border-white/10 mb-8 max-w-sm mx-auto text-sm text-slate-300 leading-relaxed font-mono text-left w-full">
              {score === shuffledQuestions.length 
                ? "> Nível de imunidade cognitiva: ALTO.\n> Excelente proficiência em verificação de integridade de informações." 
                : score >= 2 
                  ? "> Nível de imunidade cognitiva: MÉDIO.\n> Status operacional aceitável. Maior foco recomendado na verificação de imagens secundárias."
                  : "> Nível de imunidade cognitiva: BAIXO.\n> Atenção necessária. Seu vetor de credulidade representa risco alto de contágio algorítmico."}
          </div>

          <button
            onClick={resetQuiz}
            className="flex items-center justify-center px-6 py-3 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:text-black hover:bg-white transition-all font-mono"
          >
            Refazer Auditoria
          </button>
        </motion.div>
      )}
    </div>
  );
}
