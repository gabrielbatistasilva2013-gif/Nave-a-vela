# Segurança Online com Nave à Vela - Oitavo Ano

Bem-vindo ao projeto sobre Segurança da Informação e Ética em Dados!
Esta aplicação ajuda a conscientizar sobre os perigos reais das Fake News e fornece ferramentas baseadas em Inteligência Artificial para detectar notícias falsas.

## Pré-requisitos
- Node.js
- Uma chave de API do Gemini (Google AI Studio)

## Como executar localmente

1. Instale as dependências:
```bash
npm install
```

2. Configure a chave de API do Gemini:
Crie um arquivo chamado `.env.local` na raiz do projeto (como o `.env.example`) e adicione sua chave:
```env
GEMINI_API_KEY=sua_chave_api_aqui
```
*(Nota: O arquivo `.env.local` é ignorado pelo Git por segurança)*

3. Inicie a aplicação:
```bash
npm run dev
```

Abra o navegador no endereço indicado no terminal (normalmente http://localhost:3000 ou o porta gerada pelo Vite).

## Tecnologias utilizadas
- React + Vite
- Tailwind CSS
- Framer Motion para animações
- Gemini AI
