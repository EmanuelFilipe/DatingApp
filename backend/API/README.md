# install ef
dotnet tool install --global dotnet-ef --version 9.0.5
dotnet tool list -g

## if necessesary uninstall ef
dotnet tool uninstall --global dotnet-ef

dotnet tool uninstall --global dotnet-ef

## migrations - be sure to run this command in the backend/API folder
dotnet ef migrations add InitialCreate -o Data/Migrations // specify output folder for the migration files
dotnet ef datatabase update // apply the migration to the database