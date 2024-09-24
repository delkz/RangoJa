# Usar uma imagem base do Node.js
FROM node:20

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar os arquivos de configuração para o contêiner
COPY package*.json ./

RUN apt-get update && apt-get install -y \
  build-essential \
  && rm -rf /var/lib/apt/lists/*
# Instalar as dependências
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta que a aplicação vai usar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
