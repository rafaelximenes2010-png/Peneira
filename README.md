# Peneira · Central do WhatsApp

Peneirando mensagens e notificações.

> Passa tudo pela peneira. Fica só o que importa.

Projeto pessoal de **Rafael Ximenes**. O Peneira lê as conversas do WhatsApp pessoal, marca como lidas,
favorita (⭐) o que é importante e organiza tudo num painel: prazos, prioridade e próxima ação.

## O que conta como importante
Você aprova a lista de critérios no próprio app. Sugestões iniciais:

- Bancos e cartões (fatura, débito, alerta de transação)
- Órgãos oficiais e governo (Receita, gov.br, Detran, INSS, prefeitura)
- Contas e boletos
- Alerta de segurança / possível golpe
- Família direta
- Pedidos com prazo ou sem resposta
- Menções a você em grupos
- Ignorar: correntes, "bom dia", promoções

## O que o Peneira nunca faz
- Responder ou enviar mensagem sem aprovação
- Abrir links, baixar arquivos ou usar códigos de verificação
- Fazer Pix, pagamento ou qualquer transação
- Guardar número de cartão, conta ou senha

## Versões
- **Esta página (GitHub Pages):** modo demonstração, com exemplos fictícios. As aprovações ficam só no seu aparelho.
- **Versão privada (Claude):** onde ficam os dados reais, visível só para o dono.

## Estrutura
Veja `docs/ARQUITETURA.md` (contas individuais, lojas, proteção da marca).
Mesmo formato do SOLA: HTML único (`index.html`) + PWA (`manifest.webmanifest`, `sw.js`, `icons/`).
Instale pelo navegador do celular: *Adicionar à tela de início*.

> WhatsApp é marca registrada da Meta. O Peneira é um projeto independente, sem vínculo com a Meta.
