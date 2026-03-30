# daisyui
https://daisyui.com/components/

# heroicons
https://heroicons.com/

# install ef
dotnet tool install --global dotnet-ef --version 9.0.5
dotnet tool list -g

## if necessesary uninstall ef
dotnet tool uninstall --global dotnet-ef

## migrations - be sure to run this command in the backend/API folder
dotnet ef migrations add InitialCreate -o Data/Migrations // specify output folder for the migration files
dotnet ef database update // apply the migration to the database

## check if needs update the migrations
dotnet ef migrations has-pending-model-changes

## deleting database
dotnet ef database drop
'y' // confirm deletion

# SignalR
create SignalR folder > PresenceHub.css
add AddSignalR on Program.css and .MapHub middleware que redireciona chamadas signalR para a classe PresenceHub.css

# Publicação - issues
* quando damos refresh na url "https://localhost:5001/members" da erro 404
  isso pq nao tem rota definida pra esse componente na API... 
  deve-se criar um fallback controller que joga a responsabilidade de roteamento para o client

# Docker
docker compose up -d  // sobe os containers em background
docker compose down   // derruba os containers

# Azure
Resource groups > create > Web App (configuration > web socket)> 
da-app-2025

** publicando a aplicação: na pasta "API" > dotnet publish -c Release -o ./bin/Publish

botao direito na pasta Publish > Deploy to Web App > da-app-2025 > publish > acessar url de produção
para erros: Diagnostic Tools > Application Event Logs
se der erro de token, copie o value do tokenkey em app.settings.development > Environment variables > adicione a chave com o mesmo nome e cole o value