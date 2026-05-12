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
      { title: 'Firehose of Falsehood', content: 'Tática de guerra de informação: volume massivo, rápido e multicanal de falsidades constantes para esgotar as tentativas físicas de checagem. Antes de desmentida, o estrago já foi feito.' },
      { title: 'Agnotologia (A Ciência da Dúvida)', content: 'Injeção de "dúvida fabricada" no público sobre temas cientificamente pacificados (ex: clima, cigarro) só para proteger empresas ou pautas obscurecidas.' },
      { title: 'Desinformação vs. Misinformação', content: 'Desinformação é criada com a pura e dolosa intenção de manipular. A Misinformação ocorre sem dolo, no repasse do usuário que acredita estar ajudando cegamente.' }
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
      { title: 'Falsa Conexão (Contested Mapping)', content: 'Liga-se manchetes de texto a imagens ou URLs reais que, na verdade, não dão sustentação ao título, desviando a associação mental natural do leitor apressado.' },
      { title: 'Lei de Brandolini (Bullshit Asymmetry)', content: 'O princípio que estipula que a refutação qualificada de uma farsa online toma uma ordem de magnitude de esforço drasticamente maior do que a energia gasta para criá-la incialmente.' },
      { title: 'Teoria do Gotejamento Reverso', content: 'Conspirações nascem lá embaixo em fóruns obscuros de nichos hiper-radicais na deep web e ganham tanta força orquestrada que acabam forçando a própria mídia clássica massiva a ter que reportá-las.' },
      { title: 'Acordo de Santa Clara', content: 'Demanda sobre transparência nas plataformas. Postula que as redes informem dados transparentes das remoções e deem caminhos justos de contestação contra as lógicas de moderações ocultas algorítmicas.' },
      { title: 'Síndrome de Correção Hipócrita (Whataboutism)', content: 'Ocorre com extrema dissonância cognitiva: o indivíduo é provado factualmente que espalhou mentiras e, para não assumir a culpa do ato, muda de foco e ataca terceiros (E o seu partido? E a sua falha de 1999?).' }
    ]
  }
];

export default function TrainingManual() {
  const [openLevel, setOpenLevel] = useState<string | null>('easy');

  return (
    <div className="w-full max-w-4xl mx-auto my-16 bg-[#050505] p-6 md:p-10 border border-white/10 rounded-sm">
      <div className="text-center mb-10">
        <div className="inline-block px-3 py-1 mb-4 border border-white/20 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-300">
          Base de Conhecimento
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Manual de Sobrevivência</h2>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Tudo o que você precisa dominar para detectar falácias e vencer a simulação algorítmica do quiz, indo de lições triviais até as engrenagens psicológicas subjacentes.
        </p>
      </div>

      <div className="space-y-4">
        {levels.map((level) => {
          const isOpen = openLevel === level.id;

          return (
            <div key={level.id} className={cn("border rounded-sm transition-all duration-300", isOpen ? level.border : "border-white/10")}>
              <button
                onClick={() => setOpenLevel(isOpen ? null : level.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 md:p-6 text-left transition-colors",
                  isOpen ? level.bg : "hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-4">
                  {level.icon}
                  <h3 className={cn("font-serif text-xl sm:text-2xl transition-colors", isOpen ? level.color : "text-white")}>
                    {level.name}
                  </h3>
                </div>
                <ChevronDown className={cn("w-5 h-5 shrink-0 transition-transform duration-300", isOpen ? "rotate-180 text-white" : "text-slate-500")} />
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 md:p-6 border-t border-white/10 bg-[#000000] space-y-6">
                      {level.items.map((item, idx) => (
                        <div key={idx} className="border-l-2 border-white/10 pl-4 py-1">
                          <h4 className="text-white text-sm md:text-base font-bold uppercase tracking-widest mb-2 font-mono">{item.title}</h4>
                          <p className="text-slate-400 text-sm leading-relaxed">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
