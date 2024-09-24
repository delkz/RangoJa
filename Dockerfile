# Usar uma imagem base do Node.js
FROM node:20

# Definir o diretório de trabalho para a aplicação
WORKDIR /usr/src/app

# Copiar os arquivos de configuração do backend
COPY server/package*.json ./server/

# Copiar os arquivos de configuração do frontend
COPY client/package*.json ./client/

# Instalar as dependências do backend
RUN npm install --prefix ./server

# Instalar as dependências do frontend
RUN npm install --prefix ./client

# Instalar o concurrently
RUN npm install -g concurrently

# Copiar o restante do código da aplicação
COPY . .

# Definir o diretório de trabalho para o Prisma
WORKDIR /usr/src/app/server

# Executar o prisma generate
RUN npx prisma generate

# Voltar para o diretório da aplicação
WORKDIR /usr/src/app

# Expor a porta que a aplicação vai usar
EXPOSE 4000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
