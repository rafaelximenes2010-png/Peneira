# Ponte oficial do Peneira — passo a passo

Modelo **híbrido**:

| O quê | Como chega ao Peneira | Precisa do notebook? |
|---|---|---|
| Conversas individuais (1:1) | Ponte oficial (API da Meta, "coexistência") — em tempo real, 24h | Não |
| Grupos, @menções em grupos, relatórios por grupo | Varredura de hora em hora pelo Chrome | Sim |

Na coexistência você **continua usando o WhatsApp Business no celular** normalmente. Os grupos não passam pela API (limite da Meta), por isso seguem na varredura.

## O que a ponte faz e não faz

- Recebe cada mensagem nova, separa o que importa (VIP, critérios aprovados, prazos, cobranças, suspeita de golpe) e entrega ao app.
- Dá baixa sozinha quando você responde pelo WhatsApp e mede seu tempo de resposta.
- **Não tem função de enviar ou responder.** Não baixa fotos, áudios, documentos nem abre links.
- "Marcar como lida" é opcional e vem **desligado**: quando ligado, o remetente vê o tique azul.

## Passo 1 — Conectar o número à API (escolha uma rota)

**Rota A — por um provedor oficial (recomendada, mais simples).**
Use um provedor parceiro da Meta (BSP) que aceite *coexistência* e permita encaminhar os webhooks para um endereço seu (ex.: 360dialog). Confira o preço do plano antes.
1. Crie a conta no provedor e escolha "conectar número que já usa o WhatsApp Business app" (coexistência).
2. No celular, o WhatsApp Business mostra um QR/confirmação — aceite. Pode compartilhar até 6 meses de histórico das conversas individuais.
3. No provedor, configure o webhook para: `https://SEU-ENDERECO.workers.dev/webhook?k=SUA_WEBHOOK_KEY` (passo 2).

**Rota B — direto com a Meta (sem provedor).**
Exige app no developers.facebook.com, empresa verificada no Meta Business e cadastro como *Tech Provider* com Embedded Signup em modo coexistência. É mais burocrático e a Meta não deixa claro se aceita uma empresa conectando o próprio número; use só se a Rota A não servir.
Webhook: `https://SEU-ENDERECO.workers.dev/webhook`, token de verificação = `VERIFY_TOKEN`, assine os campos `messages`, `smb_message_echoes`, `smb_app_state_sync` e `history`.

## Passo 2 — Publicar a ponte (Cloudflare Workers, plano grátis)

No notebook, com Node instalado, dentro da pasta `server/` deste repositório:

```bash
npx wrangler login
npx wrangler kv namespace create PENEIRA        # cole o id em wrangler.toml
npx wrangler secret put PENEIRA_TOKEN           # senha longa que você inventa (vai no app)
npx wrangler secret put WEBHOOK_KEY             # Rota A: senha do fim do endereço do webhook
npx wrangler secret put VERIFY_TOKEN            # Rota B
npx wrangler secret put APP_SECRET              # Rota B
npx wrangler secret put ANTHROPIC_API_KEY       # opcional: resumos com Claude
npx wrangler deploy
```

O comando final mostra o endereço, algo como `https://peneira-ponte.SEU-NOME.workers.dev`.

## Passo 3 — Ligar no app

Peneira → **Ajustes → Ponte oficial** → cole o endereço e a senha (`PENEIRA_TOKEN`) → **Conectar e testar**.
O app sincroniza a cada minuto, envia sua lista VIP e os critérios aprovados para a ponte e mostra quantas mensagens chegaram hoje.

## Privacidade

A ponte guarda por 35 dias só o necessário: nome do contato, resumo curto (sem números de conta/cartão/códigos), categoria e horário. Números de telefone ficam só como código embaralhado. Com `ANTHROPIC_API_KEY`, o texto da mensagem é enviado à Anthropic apenas para classificar e resumir.
