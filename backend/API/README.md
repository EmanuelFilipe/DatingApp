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
