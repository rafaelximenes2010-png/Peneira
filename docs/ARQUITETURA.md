# Peneira — estrutura para as lojas (Google Play e App Store)

## Hoje (fase de teste)
- `index.html` único, PWA (instala no iOS e no Android pelo navegador).
- Versão privada no Claude: dados reais do Rafael.
- Versão pública (GitHub Pages): modo demonstração, dados fictícios, salvos só no aparelho.

## Uso individualizado (cada pessoa com os próprios dados)
1. **Login**: e-mail/Google/Apple (a App Store exige "Entrar com a Apple" se houver outro login social).
2. **Banco por usuário**: tabelas `itens`, `criterios`, `acoes`, `relatorios`, `config` com `user_id`;
   regra de acesso por linha (cada pessoa só lê e grava o que é seu). Ex.: Supabase (Postgres + RLS) ou Firebase.
3. **O app** troca a camada de dados (hoje: Claude ou modo demonstração) por essa conta — o resto da tela não muda.

## Como cada pessoa conecta o próprio WhatsApp
- O WhatsApp pessoal **não tem API oficial**. Automatizar conta pessoal pode violar os termos da Meta.
- **Android**: leitura das notificações do WhatsApp no próprio aparelho (permissão de "acesso a notificações"),
  com a triagem feita no celular. É o caminho mais viável para muita gente.
- **iOS**: a Apple não permite ler notificações de outros apps. Alternativas: encaminhar/compartilhar conversas
  para o Peneira, ou usar o WhatsApp Business (API oficial) para números comerciais.
- Silenciar grupos e resposta de ausência automática só são possíveis de forma nativa no **WhatsApp Business**.

## Empacotamento nativo
- Capacitor: o mesmo `index.html` vira app Android (`android/`) e iOS (`ios/`).
- iOS precisa de um Mac (ou build na nuvem) para gerar o app.

## Lojas
- Google Play: conta de desenvolvedor US$ 25 (uma vez); conta pessoal nova exige teste fechado com 12 testadores por 14 dias.
- App Store: Apple Developer US$ 99 por ano; revisão mais rigorosa.
- As duas pedem política de privacidade e explicação clara do uso dos dados (LGPD).

## Proteção
- Software no Brasil é protegido por direito autoral (não por patente). Registro do programa no INPI comprova autoria e data.
- Marca "Peneira": pedido no INPI, por classe (ex.: 9 — software; 42 — serviços de TI).
- WhatsApp é marca da Meta: não usar no nome do produto.
