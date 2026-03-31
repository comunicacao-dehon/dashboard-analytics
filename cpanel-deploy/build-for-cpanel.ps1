# SCRIPT DE BUILD AUTOMATIZADO PARA CPANEL/HOSTGATOR
# Este script compila o React e junta os arquivos PHP necessários.

Write-Host "--- Iniciando Build para cPanel ---" -ForegroundColor Cyan

# 1. Limpeza
if (Test-Path "cpanel-dist") {
    Write-Host "Limpando pasta de build antiga..."
    Remove-Item -Recurse -Force "cpanel-dist"
}

# 2. Executar Build do Vite
Write-Host "Executando npm run build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha no build do Vite!" -ForegroundColor Red
    exit 1
}

# 3. Criar estrutura final
Write-Host "Organizando arquivos para o cPanel..." -ForegroundColor Green
New-Item -ItemType Directory -Path "cpanel-dist"
New-Item -ItemType Directory -Path "cpanel-dist/api"

# 4. Copiar arquivos do React (dist)
Copy-Item -Path "dist/*" -Destination "cpanel-dist" -Recurse

# 5. Copiar arquivos PHP e .htaccess
Copy-Item -Path "cpanel-deploy/.htaccess" -Destination "cpanel-dist/"
Copy-Item -Path "cpanel-deploy/api/*.php" -Destination "cpanel-dist/api/"

Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host "SUCESSO! O conteúdo da pasta 'cpanel-dist' está pronto para upload na public_html." -ForegroundColor Green
Write-Host "Não esqueça de configurar o config.php fora da pasta pública!" -ForegroundColor Yellow
Write-Host "------------------------------------------------" -ForegroundColor Cyan
