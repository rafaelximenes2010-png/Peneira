# Como o Peneira lê o WhatsApp — caminhos

O WhatsApp **pessoal** não tem API oficial. Ler mensagens "como no Business" só é possível
de forma oficial quando o número está no **WhatsApp Business**. Caminhos, do mais simples ao mais completo:

## Caminho A — Agente no WhatsApp Web (hoje, só para o Rafael)
- Claude abre o WhatsApp Web no Chrome do computador, lê, marca como lido e favorita.
- Prós: funciona já, sem mudar nada no celular. Contras: computador ligado; não escala para outras pessoas.

## Caminho B — Leitor de notificações (Android, para todos)
- App Peneira nativo (Capacitor) com permissão de "acesso a notificações".
- Lê o texto das notificações do WhatsApp no próprio aparelho e faz a triagem ali.
- Prós: funciona com qualquer número pessoal. Contras: só vê o que vira notificação; não existe no iPhone.

## Caminho C — WhatsApp Business + Cloud API em coexistência (o "jeito Business")
1. Passar o número para o app **WhatsApp Business** (grátis; mantém as conversas).
2. Conectar o mesmo número à **Cloud API** da Meta via um provedor (BSP) usando o modo **coexistência**.
3. Toda mensagem recebida chega por **webhook** no servidor do Peneira → triagem, relatórios e alertas.
4. O app Business continua no celular para responder normalmente.
- Ganha de brinde no Business: mensagem de ausência automática, saudação, etiquetas e respostas rápidas nativas.
- Atenção: em números conectados à API, **grupos e alguns recursos param de funcionar**; mensagens enviadas pela API são cobradas pela Meta (as do app continuam grátis).
- Recomendação: testar com um **segundo número** antes de usar o número principal.

## Caminho D — Exportar conversa (iPhone, manual)
- No WhatsApp: conversa → Exportar → Peneira. Bom para casos pontuais.
