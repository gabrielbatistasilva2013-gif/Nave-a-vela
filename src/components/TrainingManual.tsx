import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Brain, ShieldAlert, Cpu, AlertTriangle, BookOpen, ChevronDown } from 'lucide-react';

const levels = [
  {
    id: 'easy',
    name: 'Nível Fácil: O Básico da Sobrevivência',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: <BookOpen className="w-5 h-5 text-green-400" />,
    items: [
      { title: 'Manchetes Escandalosas', content: 'Manchetes muito escandalosas (em CAIXA ALTA, cheias de exclamações) são feitas para gerar cliques rápidos baseado na emoção. Sempre leia a notícia completa e verifique a fonte original.' },
      { title: 'Pesquisa Reversa de Imagem', content: 'Se recebeu uma imagem suspeita no WhatsApp, faça uma pesquisa reversa no Google Imagens para ver se ela é de outra época ou contexto.' },
      { title: 'Datas Recicladas', content: 'Conferir a data da notícia é vital. Uma tática muito comum é compartilhar um fato verídico, mas de anos atrás, como se tivesse acabado de acontecer, gerando pânico desnecessário.' },
      { title: 'Deepfakes', content: 'Vídeos ou áudios falsos incrivelmente realistas criados por ferramentas avançadas (ex: clonagem da voz de um político).' },
      { title: 'A Isca Emocional', content: 'A desinformação mira nas instabilidades emocionais. Tenta despertar raiva, medo ou urgência extrema para forçar sua interação irracional.' }
    ]
  },
  {
    id: 'medium',
    name: 'Nível Médio: Táticas Avançadas',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    items: [
      { title: 'Viés de Confirmação', content: 'A tendência de acreditar ainda mais em coisas que já combinam com o que pensamos. Nossa guarda crítica baixa drasticamente.' },
      { title: 'Bots e Engajamento Artificial', content: 'Robôs em redes sociais criam volume artificial de postagens, inflando uma hashtag para dar a falsa sensação de que "todo mundo" está discutindo aquilo de forma natural.' },
      { title: 'Clickbait Enganoso', content: 'Títulos sensacionalistas que desmentem ou não têm nada a ver com a matéria real embaixo deles. Lucra com quem só lê a manchete.' },
      { title: 'Falso Contexto', content: 'Mistura imagens ou dados reais embalados em uma conclusão inventada. Muito eficaz pois parte da informação é de fato verídica.' },
      { title: 'Astroturfing', content: 'Simular, de forma paga e coordenada, um falso movimento popular orgânico vindo "das bases".' }
    ]
  },
  {
    id: 'hard',
    name: 'Nível Difícil: Estruturas Complexas',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
    items: [
      { title: 'Conteúdo Impostor (First Draft News)', content: 'Forjar logotipos e o visual de fontes verdadeiras (como G1, SUS) para imprimir credibilidade falsa a mentiras inéditas.' },
      { title: 'Criptografia E2EE (Ponta a Ponta)', content: 'Dificulta o combate, pois a moderação de conteúdo no app é impossível de ler a mensagem em si sem quebrar a privacidade, focando apenas em limites de repasse e anomalias de rede.' },
      { title: 'Firehose of Falsehood', content: 'Tática pesada: jogar muitas notícias falsas juntas em todos os lugares muito rápido, para cansar quem tenta desmentir.' },
      { title: 'Plantando a Dúvida', content: 'Plantar uma "dúvida falsa" na cabeça das pessoas sobre coisas que a ciência já comprovou (ex: vacinas, clima) só para tentar causar confusão.' },
      { title: 'Tipos de Mentiras', content: 'Existem mentiras criadas de propósito para enganar os outros. E também existem aquelas que pessoas compartilham achando que é verdade (na tentativa de ajudar alguém).' }
    ]
  },
  {
    id: 'impossible',
    name: 'Nível Impossível: O Submundo da Manipulação',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: <Cpu className="w-5 h-5 text-purple-400" />,
    items: [
      { title: 'Falsa Conexão', content: 'Colocar imagens ou links verdadeiros com títulos de notícias falsas. Como as pessoas estão com pressa, elas só olham a imagem e o título e acham que tudo é verdade.' },
      { title: 'Lei de Brandolini', content: 'Essa lei diz que a energia e o tempo que gastamos para conseguir desmentir uma mentira da internet é muito maior do que as pessoas gastaram para criá-la.' },
      { title: 'Do Fundo da Internet', content: 'Mentiras muito malucas que começam em fóruns escondidos da internet e ganham tanta fama compartilhada que chegam até mesmo na mídia.' },
      { title: 'Acordo de Santa Clara', content: 'Uma cobrança para que as redes sociais sejam honestas conosco, avisando e explicando muito bem caso elas apaguem alguma publicação, além de dar alguma opção clara para a pessoa poder se defender.' },
      { title: 'O Pulo do Gato (Whataboutism)', content: 'Quando uma pessoa percebe que espalhou uma notícia falsa, ao invés dela admitir o erro, ela muda de assunto e começa a apontar o dedo ou criticar outras coisas para se livrar.' }
    ]
  }
];

export default function TrainingManual() {
  const [openLevel, setOpenLevel] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto my-20 bg-[#050505]/80 backdrop-blur-3xl p-6 md:p-10 border border-white/10 rounded-[2rem] relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] group/manual hover:border-white/20 transition-all duration-700">
      
      {/* Decorative top pulse */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      
      <div className="text-center mb-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-2 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] font-bold uppercase tracking-widest text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.15)] backdrop-blur-md"
        >
          Base de Dados Confidencial
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">Manual de Sobrevivência</h2>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Tudo o que você precisa saber para não ser enganado na internet e ir bem no nosso pequeno jogo. Se prepare aprendendo desde o básico até o mais avançado!
        </p>
      </div>

      <div className="space-y-4 relative z-10">
        {levels.map((level, idx) => {
          const isOpen = openLevel === level.id;

          return (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              key={level.id} 
              className={cn("border rounded-xl transition-all duration-500 overflow-hidden shadow-inner backdrop-blur-sm", isOpen ? level.border : "border-white/10")}
            >
              <button
                onClick={() => setOpenLevel(isOpen ? null : level.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 md:p-6 text-left transition-colors focus:outline-none",
                  isOpen ? level.bg + " bg-opacity-50" : "hover:bg-white/5 bg-black/40"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl border backdrop-blur-md transition-all duration-500", isOpen ? "border-transparent bg-black/40 scale-110" : "border-white/10 bg-black/40")}>
                    {level.icon}
                  </div>
                  <h3 className={cn("font-serif text-xl sm:text-2xl transition-colors", isOpen ? level.color : "text-white")}>
                    {level.name}
                  </h3>
                </div>
                <ChevronDown className={cn("w-5 h-5 shrink-0 transition-transform duration-500", isOpen ? "rotate-180 " + level.color : "text-slate-500")} />
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className={cn("p-4 md:p-6 border-t border-white/10 space-y-4", level.bg, "bg-opacity-10 backdrop-blur-3xl")}>
                      {level.items.map((item, idxx) => (
                        <div key={idxx} className={cn("border-l-2 pl-4 py-1", isOpen ? level.border : "border-white/10")}>
                          <h4 className={cn("text-sm md:text-base font-bold uppercase tracking-widest mb-1 font-mono drop-shadow-md", level.color)}>{item.title}</h4>
                          <p className="text-slate-300 text-sm md:text-sm leading-relaxed">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
