import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Brain, Settings2, Play, RefreshCw, Layers, Loader2 } from 'lucide-react';

type Question = {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'impossible';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

const ALL_QUESTIONS: Question[] = [
  // EASY
  { id: 1, difficulty: 'easy', question: "O que você deve fazer ao ler uma manchete muito escandalosa?", options: ["Compartilhar imediatamente com amigos e familiares.", "Ler a notícia completa e verificar a fonte original.", "Comentar na postagem sem ler o conteúdo.", "Acreditar se tiver muitas curtidas."], correct: 1, explanation: "Manchetes sensacionalistas geram cliques. Leia o texto inteiro e verifique a fonte corporativa ou independente." },
  { id: 2, difficulty: 'easy', question: "Como testar se uma imagem do WhatsApp é real?", options: ["Fazer pesquisa reversa de imagem no Google.", "Confiar, pois a imagem não pode ser alterada.", "Perguntar no grupo se alguém mais recebeu.", "Verificar visualmente se há o logotipo de alguma emissora."], correct: 0, explanation: "A pesquisa reversa ajuda a encontrar a origem real da imagem, revelando se a foto é antiga ou descontextualizada." },
  { id: 3, difficulty: 'easy', question: "Por que conferir a data da notícia é um passo importante?", options: ["Para desejar feliz aniversário ao autor.", "Não é um passo tão importante assim.", "Notícias reais antigas costumam ser compartilhadas como se fossem atuais.", "Para catalogar em uma planilha temporal."], correct: 2, explanation: "Tática comum: reciclar fatos verídicos mas antigos e compartilhá-los como se tivessem acabado de acontecer para gerar pânico." },
  { id: 4, difficulty: 'easy', question: "O que é, geralmente, um 'Deepfake'?", options: ["Um vírus forte de computador que apaga os dados.", "Um vídeo ou áudio falso incrivelmente realista.", "Uma nova marca de smartphone hiper-realista.", "Um tipo especial de site de busca profunda."], correct: 1, explanation: "Deepfake usa aprendizado de máquina avançado para sobrepor áudio e vídeo de forma convincente, mudando rostos ou clonando vozes de figuras públicas." },
  { id: 5, difficulty: 'easy', question: "Notícias falsas costumam ser criadas para despertar qual tipo principal de emoção?", options: ["Calma profunda", "Indiferença e sono", "Raiva, medo ou urgência extrema", "Felicidade genuína e leveza"], correct: 2, explanation: "A desinformação mira nas suas instabilidades emocionais, forçando sua interação rápida através da revolta, raiva ou comoção." },
  
  // MEDIUM
  { id: 8, difficulty: 'medium', question: "O que é o 'Viés de Confirmação' na esfera da desinformação?", options: ["É você acreditar ainda mais naquilo que confere com as suas próprias crenças prévias.", "Significa questionar profundamente e constantemente tudo na internet.", "Quando o algoritmo pede a confirmação dos seus dados no email.", "Uma lembrança falsa inserida por repetidas falas de amigos."], correct: 0, explanation: "Quando a falsa notícia reforça aquilo em que nós já acreditamos, nosso filtro crítico é drasticamente rebaixado." },
  { id: 9, difficulty: 'medium', question: "Qual a função dos 'Bots' (robôs) em redes sociais na disseminação de mentiras?", options: ["Deixar o servidor do Twitter mais responsivo.", "Responder as dúvidas das pessoas online em tempo real.", "Criar um volume artificial de postagens e inflar artificialmente um assunto na rede.", "Fazer curadoria inteligente limpando spams falsos."], correct: 2, explanation: "Bots coordenados inflam uma hashtag ou notícia, gerando a falsa impressão de que há um grande 'consenso popular' natural discutindo o assunto." },
  { id: 10, difficulty: 'medium', question: "O que é um 'Clickbait' enganoso?", options: ["Prática legítima e honesta de reportagem longa.", "Propaganda subliminar dentro de vídeos educacionais.", "Um título muito sensacionalista que desmente ou não tem nada a ver com a matéria real embaixo dele.", "Ferramenta de desenvolvedores para checar a rede em busca de links que estão fora do ar."], correct: 2, explanation: "Clickbait visa a atração de visitas à página. Sendo enganoso, lucra com as pessoas que não checam o conteúdo da matéria na qual acabaram de clicar." },
  { id: 11, difficulty: 'medium', question: "O que torna o 'falso contexto' uma das armas mais poderosas da desinformação?", options: ["O fato usa satirizações inocentes como se fossem verdades absolutas cômicas.", "Ele mistura dados reais envelopados em uma conclusão inventada, dando ar de veracidade.", "Ele exige um investimento massivo do governo para poder ser disseminado pelas redes.", "Isso obriga o leitor a ser sempre hackeado em sua rede wifi."], correct: 1, explanation: "O falso contexto utiliza dados concretos (uma foto real ou cotação de mercado), mas altera o resto para validar uma fraude, tornando difíícil refutar rapidamente." },
  { id: 12, difficulty: 'medium', question: "O que significa 'Astroturfing' em manipulação digital?", options: ["Plantar conteúdos biológicos na Deep Web.", "Simular, de forma paga e coordenada, um falso movimento popular orgânico.", "Apenas usar ferramentas automatizadas gerativas para textos e planilhas.", "Monitoramento governamental da localização celular."], correct: 1, explanation: "Semelhante à grama sintética (Astroturf nos EUA), é um movimento coordenado que finge falsamente ser uma revolta 'das bases populares genuínas'." },
  
  // HARD
  { id: 15, difficulty: 'hard', question: "No espectro da desinformação desenhado pela First Draft News, o que define o 'Conteúdo Impostor'?", options: ["Logotipos de fontes verdadeiras forjados para conferir validade para mentiras inéditas.", "Quando reportagens jornalísticas velhas são postadas novamente por erro de cronômetro.", "Quando uma opinião ou sátira com fins cômicos é acreditada sendo não intencionalmente fraudulento.", "Uma desinformação em que um bot assume o usuário vítima e bane contatos."], correct: 0, explanation: "O golpe apropria-se do prestígio da marca autêntica (ex: usar uma arte idêntica aos alertas do SUS) e injeta material tóxico fraudulento." },
  { id: 16, difficulty: 'hard', question: "Por que as redes E2EE (criptografia de ponta a ponta) dificultam o combate à desinformação centralizada?", options: ["Porque as empresas donas desses apps barram notícias das mídias em prol de fakes.", "A moderação por conteúdo no app é impossível sem quebrar a privacidade, focando apenas em limites de repasse.", "Como o tráfego é aberto para governos, o próprio governo inibe a fiscalização humana interna.", "Porque robôs moderadores não entendem áudio encriptado em 256 bits, necessitando regravação."], correct: 1, explanation: "A única visão das plataformas passa a ser focar em mitigar o alcance de mensagens virais de comportamento anômalo sem ver seu conteúdo real criptografado." },
  { id: 17, difficulty: 'hard', question: "O que caracteriza a tática 'Firehose of Falsehood' na desinformação geopolítica?", options: ["Utilizar volume massivo, rápido e multicanal de falsidades constantes para esgotar as tentativas de checagem adversária.", "Ocultar servidores em alto-mar para disparar lances coordenados na bolsa de valores regional.", "Hackear portais apenas em épocas de incêndio ambiental real pelo mundo.", "Um mecanismo automatizado do X (antigo Twitter) focado no combate rápido e automático de fakes na raiz de origem em tempo real sem humano."], correct: 0, explanation: "Lançando tantas fakes simultâneas, antes que uma possa ser desmentida e o público seja avisado, o impacto já ocorreu emocionalmente e outras três foram criadas." },
  { id: 18, difficulty: 'hard', question: "Qual o foco central do estudo da 'Agnotologia' acadêmica introduzida por Proctor?", options: ["Como os algoritmos enxergam a mente das aves no céu para o rastreio.", "Como os dados são compactados nos data centers resfriados em climas inóspitos.", "Como a dúvida fabricada, o ceticismo deliberado e a ignorância sobre evidências científicas comprovadas são injetados no público visando proteção corporativa.", "A ciência das fake news visuais com inteligência avançada sem falhas na modelagem natural das suas matrizes humanas originais."], correct: 2, explanation: "Em vez de refutar a ciência que já comprovou perigo, semeia-se o ceticismo crônico sobre pesquisas para as pessoas sentirem que 'nada é decidido' (a dúvida social é o gancho da desinformação estrutural)." },
  { id: 19, difficulty: 'hard', question: "Como se distingue estritamente 'Desinformação' de 'Misinformação' na academia de comunicação?", options: ["Misinformação ocorre só offline, Desinformação é termo restrito digital mobile.", "Fator tempo de criação; toda notícia muda de status com o tempo.", "O fator do software utilizado e o custo do hardware empregado.", "A primeira é planejada dolosamente visando manipulação. A segunda ocorre quando a vítima repassa os mesmos erros por crer ingenuamente e sem dolo."], correct: 3, explanation: "O Dolo. O emissor original de Desinformação deseja a fraude; o propagador da Misinformação erra ou julga estar ajudando mesmo não detendo a culpa intelectual fundamental." },
  
  // IMPOSSIBLE
  { id: 20, difficulty: 'impossible', question: "Na tipologia de desinformação de Claire Wardle, qual tática explora o conceito de 'Mapeamento Contestado' cognitivo no leitor vulnerável?", options: ["Manipulação Genérica.", "Câmara de Sombras (Shadow Baning).", "Fabricação Plena Intersetorial.", "Conexão Falsa (False Connection)."], correct: 3, explanation: "A Falsa Conexão liga manchetes a imagens que, em tese, representariam a manchete, mas desviam toda a estrutura de associação mental original do fato concreto ocorrido." },
  { id: 21, difficulty: 'impossible', question: "A Lei de Brandolini ('Bullshit Asymmetry Principle') estipula que a refutação qualificada de uma farsa online:", options: ["Exige o uso de blockchain para confirmação de fatos.", "Exige apenas um oitavo do custo real para desmentir, devido à velocidade das plataformas.", "Necessita de emoção positiva para converter a massa algorítmica forjada.", "Toma uma ordem de magnitude de esforço drasticamente maior do que a energia gasta para criá-la incialmente."], correct: 3, explanation: "Criar uma fraude demanda energia baixa. Refutar metodicamente demanda checagem rigorosa – um custo assimétrico colossal para desmentir." },
  { id: 22, difficulty: 'impossible', question: "O que postula a 'Teoria do Gotejamento Reverso' (Reverse Trickle-Down) em cenários de desinformação?", options: ["Fóruns hipernícho radicais da deep web nutrem conspirações iniciais que escalam degraus até forçar o relato na mídia tradicional massiva.", "Estatísticas fluem de agências para redatores sem filtros cruzados nas redações tradicionais.", "Notícias fluem dos grandes jornais pro WhatsApp regional.", "Propagandas lançadas online caem no vazio local e desaparecem gradativamente por desinteresse."], correct: 0, explanation: "Conspirações nascem na periferia digital e ganham 'oxigênio' intencional até forçar jornais grandes a mencionarem, espalhando a ideia pro público leigo." },
  { id: 23, difficulty: 'impossible', question: "O que o Acordo de Santa Clara estipula sobre moderação e remoção de conteúdos?", options: ["Os servidores não sujeitam regras ocidentais a plataformas emergentes nativas ou offline fora de sua nuvem regional.", "Que robôs devam ser fiscalizados por cidadãos antes de aplicar banimentos no portal.", "As multas por moderação incorreta em tempos curtos eleitorais globais na web.", "Que as empresas informem dados transparentes das remoções e deem canais de contestação justos contra essas moderações obscuras das plataformas e suas ideologias veladas."], correct: 3, explanation: "Garante que não se use a bandeira 'combate' para mero silenciamento cego sem devido recurso transparente pela matriz que hospedou a publicação na infraestrutura e sua decisão arbitrária no modelo algorítmico contra quem foi silenciado." },
  { id: 24, difficulty: 'impossible', question: "O conceito da Síndrome de Correção Hipócrita (ou falácia Whataboutism acionada por dissonância cognitiva) denota o ato quando um sujeito:", options: ["Ignora fatos provados caso o debatedor oponente não possua uma graduação em humanas formal com a titulação completa e validada ao vivo em transmissão sem falhas técnicas visuais da sua faculdade local no seu currículo e atestado civil regional do seu local.", "Distorce um vídeo apenas ao seu tempo ou diminui sua qualidade deliberadamente por vergonha ou medo do bloqueio imediato do seu próprio post local.", "Recorre instantaneamente perante prova factual objetiva atacando outra tese secundária do adversário culpando ele de feitos similares sem elo com a pauta central (e daí? E o tal feito de vocês?) justificado a aceitação perversa atual como suposto nivelamento igualitário dos vícios cívicos ou balanço perverso na via dupla sem resposta do debate central em foco no recinto naquele breve lapso.", "Muda seu foco para algoritmos para negar autoria no ato infracional ao seu bel prazer cego contra a política regional em ato perverso sem embasamento."], correct: 2, explanation: "Não tendo resposta à refutação que expôs sua fraude, a mente ataca algo distinto do adversário tentando invalidá-lo e fugir de confessar seu erro primário factualmente farto e exposto." },
];

export default function Quiz() {
  const [gameState, setGameState] = useState<'menu' | 'loading' | 'playing' | 'result'>('menu');
  
  // Menu Options
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'impossible'>('medium');
  const [length, setLength] = useState<5|7|10|'infinite'>(5);
  
  // Play State
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  
  const startQuiz = async () => {
    setGameState('loading');
    
    // Simulate loading for better UX
    setTimeout(() => {
      const count = length === 'infinite' ? 10 : length;
      
      let targetPool: Question[] = [];
      let pool = ALL_QUESTIONS.filter(q => q.difficulty === difficulty);
      pool.sort(() => Math.random() - 0.5);
      
      if (length !== 'infinite') {
         for (let i = 0; i < count; i++) {
           targetPool.push(pool[i % pool.length]);
         }
      } else {
         targetPool = [...pool];
      }
      
      setShuffledQuestions(targetPool);
      setCurrentQ(0);
      setScore(0);
      setSelectedOption(null);
      setHasAnswered(false);
      setGameState('playing');
    }, 600);
  };

  const handleSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);
    
    if (idx === shuffledQuestions[currentQ].correct) {
      setScore(prev => prev + 1);
    } else if (length === 'infinite') {
      setTimeout(() => {
        setGameState('result');
      }, 4000); 
      return; 
    }
  };

  const nextQuestion = async () => {
    if (currentQ < shuffledQuestions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      if (length === 'infinite') {
         setGameState('loading');
         setTimeout(() => {
           let newPool: Question[] = [];
           newPool = ALL_QUESTIONS.filter(q => q.difficulty === difficulty).sort(() => Math.random() - 0.5);
           
           setShuffledQuestions(prev => [...prev, ...newPool]);
           setCurrentQ(prev => prev + 1);
           setSelectedOption(null);
           setHasAnswered(false);
           setGameState('playing');
         }, 500);
      } else {
         setGameState('result');
      }
    }
  };

  const resetToMenu = () => {
    setGameState('menu');
  };

  const diffStyles = {
    easy: { name: 'Fácil', border: 'border-green-500/30', bg: 'bg-green-500/20', text: 'text-green-400', shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]', hover: 'hover:bg-green-500/20 hover:border-green-500/50 hover:text-green-300' },
    medium: { name: 'Médio', border: 'border-yellow-500/30', bg: 'bg-yellow-500/20', text: 'text-yellow-400', shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.2)]', hover: 'hover:bg-yellow-500/20 hover:border-yellow-500/50 hover:text-yellow-300' },
    hard: { name: 'Difícil', border: 'border-red-500/30', bg: 'bg-red-500/20', text: 'text-red-400', shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]', hover: 'hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300' },
    impossible: { name: 'Impossível', border: 'border-purple-500/30', bg: 'bg-purple-500/20', text: 'text-purple-400', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]', hover: 'hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-300' }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col relative p-4 mb-16 z-10 text-left">
      
      {gameState === 'menu' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col w-full justify-center items-center py-4 md:py-10 text-center"
        >
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center mb-5">
               <Settings2 className="w-8 h-8 md:w-10 md:h-10 text-green-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">Configurar Quiz</h2>
            <p className="text-slate-400 text-xs md:text-sm font-mono tracking-widest uppercase">Personalize seu teste de foco</p>
          </div>
          
          <div className="w-full max-w-xl flex flex-col md:flex-row gap-6 mb-10 text-left">
             <div className="flex-1 flex flex-col gap-2">
               <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1 pl-1">Grau de Dificuldade</label>
               {(['easy', 'medium', 'hard', 'impossible'] as const).map(diff => (
                 <button
                   key={diff}
                   onClick={() => setDifficulty(diff)}
                   className={cn(
                     "px-4 py-3 rounded-2xl border text-xs md:text-sm font-bold tracking-widest uppercase transition-all flex justify-center",
                     difficulty === diff 
                       ? `${diffStyles[diff].bg} ${diffStyles[diff].border} ${diffStyles[diff].text} ${diffStyles[diff].shadow}`
                       : `bg-[#0a0a0a] border-white/5 text-slate-400 ${diffStyles[diff].hover}`
                   )}
                 >
                   {diffStyles[diff].name}
                 </button>
               ))}
             </div>
             
             <div className="flex-1 flex flex-col gap-2">
               <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1 pl-1">Extensão</label>
               {([5, 7, 10, 'infinite'] as const).map(len => (
                 <button
                   key={len}
                   onClick={() => setLength(len)}
                   className={cn(
                     "px-4 py-3 flex justify-between items-center rounded-2xl border text-xs md:text-sm font-bold tracking-widest uppercase transition-all",
                     length === len 
                       ? "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]" 
                       : "bg-[#0a0a0a] border-white/5 text-slate-400 hover:bg-white/5 hover:text-white"
                   )}
                 >
                   <span>{len === 'infinite' ? 'Infinito' : `${len} Perguntas`}</span>
                   {len === 'infinite' && <Layers className="w-4 h-4 opacity-50" />}
                 </button>
               ))}
             </div>
          </div>
          
          <button 
             onClick={startQuiz}
             className="w-full md:w-auto px-10 py-4 bg-white text-black hover:bg-slate-200 rounded-full font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-xs md:text-sm"
          >
             <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
             Iniciar Teste
          </button>
        </motion.div>
      )}

      {gameState === 'loading' && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col w-full justify-center items-center py-20 text-center"
        >
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
          <h2 className="text-xl md:text-2xl font-serif text-white mb-2">Gerando Teste Dinâmico...</h2>
          <p className="text-slate-400 text-xs md:text-sm font-mono tracking-widest uppercase">Consultando base de conhecimento da Nave à Vela</p>
        </motion.div>
      )}

      {gameState === 'playing' && shuffledQuestions.length > 0 && (
        <motion.div 
           initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
           className="relative z-10 w-full flex flex-col py-2"
        >
          <div className="flex justify-between items-center mb-6 text-[10px] tracking-widest uppercase text-slate-500 font-mono">
            <span>
              {length === 'infinite' ? `Modo ${diffStyles[difficulty].name} | Acertos: ${score}` : `${diffStyles[difficulty].name} | P${currentQ + 1} de ${shuffledQuestions.length}`}
            </span>
            {length !== 'infinite' && (
              <div className="flex flex-wrap gap-1 max-w-[150px] justify-end">
                {shuffledQuestions.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-3 h-1 transition-colors rounded-full",
                      i === currentQ ? "bg-white" : i < currentQ ? "bg-slate-700" : "bg-white/10"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          <h3 className="text-lg md:text-xl font-serif text-white mb-6 md:mb-8 border-l-2 border-white/20 pl-4 md:pl-5 leading-relaxed">
            {shuffledQuestions[currentQ].question}
          </h3>

          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {shuffledQuestions[currentQ].options.map((opt, idx) => {
                const isCorrect = idx === shuffledQuestions[currentQ].correct;
                const isSelected = selectedOption === idx;
                
                let btnStyle = "bg-[#0a0a0a] border-white/5 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/10";
                
                if (hasAnswered) {
                  if (isCorrect) {
                     btnStyle = "bg-green-900/20 border-green-500/50 text-green-300 shadow-[inset_0_0_15px_rgba(34,197,94,0.1)]";
                  } else if (isSelected) {
                     btnStyle = "bg-red-900/20 border-red-500/50 text-red-300";
                  } else {
                     btnStyle = "bg-[#050505] border-white/5 text-slate-600 opacity-40";
                  }
                }

                return (
                   <motion.button
                     key={`${currentQ}-${idx}`}
                     disabled={hasAnswered}
                     onClick={() => handleSelect(idx)}
                     whileHover={!hasAnswered ? { scale: 1.01 } : {}}
                     whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                     className={cn(
                       "w-full text-left p-4 md:p-5 rounded-2xl border transition-all duration-300 shadow-sm leading-relaxed text-sm",
                       btnStyle
                     )}
                   >
                     {opt}
                   </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {hasAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className={cn(
                  "p-4 md:p-5 rounded-2xl border text-sm flex flex-col gap-2",
                  selectedOption === shuffledQuestions[currentQ].correct
                    ? "bg-green-500/10 border-green-500/20 text-green-200"
                    : "bg-red-500/10 border-red-500/20 text-red-200"
                )}>
                  <div className="flex items-center gap-2 font-bold text-sm tracking-wide uppercase">
                    <Brain className="w-4 h-4 opacity-80" />
                    {selectedOption === shuffledQuestions[currentQ].correct 
                      ? "Fato Inegável:" 
                      : (length === 'infinite' ? "Erro Crítico. Sobrecarga de Mentiras:" : "Desmascarado:")
                    }
                  </div>
                  <p className="opacity-90 leading-relaxed text-xs md:text-sm">
                    {shuffledQuestions[currentQ].explanation}
                  </p>
                </div>

                <div className="flex justify-end mt-6">
                  {!(length === 'infinite' && selectedOption !== shuffledQuestions[currentQ].correct) && (
                    <button
                      onClick={nextQuestion}
                      className="px-6 py-3 md:px-8 md:py-4 bg-white text-black hover:bg-slate-200 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs transition-colors flex items-center gap-2"
                    >
                      {currentQ < shuffledQuestions.length - 1 || length === 'infinite' ? 'Próxima Análise' : 'Ver Resultado Global'}
                    </button>
                  )}
                  {length === 'infinite' && selectedOption !== shuffledQuestions[currentQ].correct && (
                     <div className="text-red-400/80 text-[10px] md:text-xs font-mono uppercase tracking-widest animate-pulse">
                        Finalizando simulação...
                     </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {gameState === 'result' && (
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative z-10 flex flex-col items-center justify-center py-10 md:py-16 text-center"
        >
          <div className="w-24 h-24 md:w-28 md:h-28 mb-6 md:mb-8 rounded-[2rem] bg-white/5 border border-white/20 flex items-center justify-center flex-col shadow-[0_0_50px_rgba(255,255,255,0.05)] ring-1 ring-white/10">
            <span className="text-4xl font-serif text-white">{score}</span>
            {length !== 'infinite' && (
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">/ {shuffledQuestions.length}</span>
            )}
          </div>
          
          <h2 className="text-xl md:text-2xl font-serif text-white mb-3">
             {length === 'infinite' 
               ? `Fim da Simulação! Desvios totais: ${score}`
               : score === shuffledQuestions.length 
                 ? "Blindado." 
                 : score >= shuffledQuestions.length / 2 
                   ? "Mente Alerta, Mas Vulnerável." 
                   : "Cópia Falha. Iscas fisgadas."
             }
          </h2>
          
          <p className="text-slate-400 max-w-md text-xs md:text-sm mb-10 leading-relaxed px-4">
             {length === 'infinite' 
               ? "Basta um único elo quebrado para contaminar a rede. Você resistiu até aqui."
               : score === shuffledQuestions.length
                 ? "Agentes críticos não são dobrados pelo algoritmo de retenção das redes hiperconectadas."
                 : "Táticas de engenharia social focam na emoção acelerada das vítimas que pararam de raciocinar com o detector natural."
             }
          </p>

          <button
            onClick={resetToMenu}
            className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 border border-white/20 hover:bg-white/10 text-white rounded-full transition-all text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
            Recomeçar Triagem
          </button>
        </motion.div>
      )}
    </div>
  );
}
