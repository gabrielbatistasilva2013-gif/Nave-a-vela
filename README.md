# Segurança Online com Nave à Vela - Oitavo Ano

Bem-vindo ao projeto sobre Segurança da Informação e Ética em Dados!
Esta aplicação ajuda a conscientizar sobre os perigos reais das Fake News e fornece ferramentas baseadas em Inteligência Artificial para detectar notícias falsas.

## Pré-requisitos
- Node.js
- Uma chave de API do Gemini (Google AI Studio)

## Como baixar e executar no seu computador (Passo a passo fácil)

**Passo 1: Baixar os arquivos (O famoso "Clone")**
"Clonar" significa apenas copiar os arquivos do GitHub para o seu computador. Se não souber usar o Git, faça o seguinte:
1. No topo desta página no GitHub, clique no botão verde escrito **"<> Code"**.
2. No menu que abrir, clique em **"Download ZIP"**.
3. Encontre o arquivo baixado no seu computador e extraia (descompacte) a pasta.

**Passo 2: Abrir a pasta no terminal**
Abra o programa de terminal do seu computador (como o Prompt de Comando no Windows) ou o terminal do seu editor de código (como o VS Code) e navegue até a pasta que você extraiu.

**Passo 3: Instalar as dependências**
No terminal, digite o seguinte comando e aperte Enter:
```bash
npm install
```

**Passo 4: Configurar a chave da Inteligência Artificial**
1. Crie um arquivo chamado `.env.local` dentro da pasta do projeto.
2. Abra esse arquivo no Bloco de Notas (ou VS Code) e coloque a sua chave do Gemini lá dentro, neste formato:
```env
GEMINI_API_KEY=sua_chave_api_aqui
```

**Passo 5: Rodar o projeto!**
No terminal, digite:
```bash
npm run dev
```
Dê permissão caso o Windows peça, e abra o link que aparecer no terminal (geralmente será algo como `http://localhost:3000`).

## Tecnologias utilizadas
- React + Vite
- Tailwind CSS
- Framer Motion para animações
- Gemini AI
