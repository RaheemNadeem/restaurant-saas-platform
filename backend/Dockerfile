# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution & project files first for layer caching
COPY QuickServe.sln .
COPY QuickServe.API/QuickServe.API.csproj QuickServe.API/
COPY QuickServe.Core/QuickServe.Core.csproj QuickServe.Core/
COPY QuickServe.Infrastructure/QuickServe.Infrastructure.csproj QuickServe.Infrastructure/
COPY QuickServe.Tests/QuickServe.Tests.csproj QuickServe.Tests/

RUN dotnet restore QuickServe.sln

COPY . .

RUN dotnet publish QuickServe.API/QuickServe.API.csproj \
    --no-restore \
    --configuration Release \
    --output /app/publish

# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Non-root user for security
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "QuickServe.API.dll"]
