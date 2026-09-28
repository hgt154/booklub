# Estante — Discover Independent Bookstores

Protótipo estático do site "Estante", pronto para publicar via GitHub Pages.

## Estrutura

```
index.html    → estrutura da página (HTML)
styles.css    → estilos customizados (além do Tailwind via CDN)
script.js     → toda a lógica/dados/interatividade (JavaScript)
```

## Como publicar no GitHub Pages

### 1. Criar o repositório no GitHub
1. Acesse https://github.com/new
2. Dê um nome ao repositório (ex.: `estante`)
3. Deixe como **Public** (necessário para GitHub Pages no plano gratuito, a menos que você tenha GitHub Pro/Team)
4. **Não** marque "Add a README" (já temos um)
5. Clique em **Create repository**

### 2. Enviar os arquivos (via terminal, na sua máquina)

Baixe estes 3 arquivos (index.html, styles.css, script.js) para uma pasta local e rode:

```bash
cd caminho/para/a/pasta
git init
git add .
git commit -m "Primeira versão do site Estante"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/estante.git
git push -u origin main
```

(Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub.)

### 3. Ativar o GitHub Pages
1. No repositório, vá em **Settings → Pages**
2. Em "Source", selecione a branch **main** e a pasta **/(root)**
3. Clique em **Save**
4. Em alguns minutos o site estará em:
   `https://SEU-USUARIO.github.io/estante/`

## Observação
O site usa o Tailwind CSS via CDN (`cdn.tailwindcss.com`) e fontes do Google Fonts — ambos carregados externamente, então funcionam normalmente no GitHub Pages sem configuração adicional.
