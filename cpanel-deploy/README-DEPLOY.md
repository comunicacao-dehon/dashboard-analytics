# GUIA DE DEPLOY — DASHBOARD UTXICA NO CPANEL (HOSTGATOR)

Este ambiente foi preparado para rodar o Dashboard React + APIs PHP de forma independente da Vercel.

## 🚀 Como fazer o Deploy

### Passo 1: Gerar os arquivos
No seu computador, abra o terminal na pasta do projeto e execute:
```powershell
./cpanel-deploy/build-for-cpanel.ps1
```
Isso criará uma pasta chamada `cpanel-dist` com tudo pronto.

### Passo 2: Configurar Segredos (FORA da public_html)
1. No cPanel, vá em **Gerenciador de Arquivos**.
2. Vá para a pasta principal da sua conta (geralmente `/home/seuusuario/`).
3. Crie um arquivo chamado `config_analytics.php` **UM NÍVEL ACIMA** da `public_html`.
4. Copie o conteúdo de `cpanel-deploy/config.php` para ele e preencha as chaves:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY`

### Passo 3: Upload do Site
1. No **Gerenciador de Arquivos**, entre na `public_html` (ou na pasta que você escolheu para o site).
2. Faça o upload de **TODOS** os arquivos de dentro da pasta `cpanel-dist`.
3. Certifique-se de que o arquivo `.htaccess` foi enviado (ele pode estar oculto no seu computador).

### Passo 4: Agendar Sincronização (Cron Job)
Para que os dados do Instagram/Facebook atualizem sozinhos todo dia:
1. No cPanel, procure por **Cron Jobs** (Tarefas Cron).
2. Adicione uma nova tarefa para rodar **Uma vez por dia** (0 0 * * *).
3. No campo comando, coloque:
   ```bash
   /usr/local/bin/php /home/seu_usuario/public_html/api/cron.php > /dev/null 2>&1
   ```
   *(Ajuste o caminho `u_seu_usuario` e a pasta se necessário).*

---

## 🛠️ Detalhes Técnicos
- **Roteamento:** O arquivo `.htaccess` cuida para que o React Router funcione corretamente (evita erro 404 ao atualizar a página).
- **Segurança:** As APIs agora usam PHP cURL para falar com o Gemini e Supabase, protegendo suas chaves de API.
