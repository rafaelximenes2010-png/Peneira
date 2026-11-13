// Instala a ponte do Peneira na sua conta Cloudflare com um comando:
//   node instalar.mjs
// Abre o navegador para você entrar na Cloudflare, cria o armazenamento, gera as senhas,
// publica e mostra o endereço + senha para colar no app.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

const sh = process.platform === "win32";
function wr(args, input) {
  const r = spawnSync("npx", ["--yes", "wrangler@latest", ...args], { encoding: "utf8", shell: sh, input, stdio: input === undefined && args[0] === "login" ? "inherit" : ["pipe", "pipe", "pipe"] });
  return { ok: r.status === 0, out: (r.stdout || "") + (r.stderr || "") };
}
const passo = t => console.log("\n▸ " + t);

passo("Entrando na Cloudflare (vai abrir o navegador — clique em Allow)");
if (!wr(["login"]).ok) { console.log("Não consegui entrar. Rode de novo."); process.exit(1); }

let toml = readFileSync("wrangler.toml", "utf8");
if (toml.includes("COLE_AQUI_O_ID_DO_KV")) {
  passo("Criando o armazenamento");
  const r = wr(["kv", "namespace", "create", "PENEIRA"]);
  const id = (r.out.match(/id\s*[=:]\s*"?([0-9a-f]{32})/i) || [])[1];
  if (!id) { console.log(r.out); console.log("Não achei o id do armazenamento."); process.exit(1); }
  toml = toml.replace("COLE_AQUI_O_ID_DO_KV", id); writeFileSync("wrangler.toml", toml);
}

passo("Publicando a ponte");
const d = wr(["deploy"]);
if (!d.ok) { console.log(d.out); process.exit(1); }
const url = (d.out.match(/https:\/\/[a-z0-9.-]+\.workers\.dev/i) || [])[0] || "(veja no painel da Cloudflare → Workers)";

passo("Gerando e guardando as senhas");
const token = randomBytes(24).toString("base64url");
const chave = randomBytes(18).toString("base64url");
for (const [k, v] of [["PENEIRA_TOKEN", token], ["WEBHOOK_KEY", chave]]) {
  const s = wr(["secret", "put", k], v + "\n");
  if (!s.ok) { console.log(s.out); process.exit(1); }
}

const txt =
`PONTE DO PENEIRA — guarde este arquivo em lugar seguro

1) No app Peneira → Ajustes → Ponte oficial:
   Endereço: ${url}
   Senha:    ${token}

2) No provedor do WhatsApp (ex.: Kapso), endereço do webhook:
   ${url}/webhook?k=${chave}
`;
writeFileSync("ponte-dados.txt", txt);
console.log("\n" + txt + "\n(salvo também em ponte-dados.txt)");
