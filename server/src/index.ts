import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';  // Importa o Prisma Client

const prisma = new PrismaClient();  // Inicializa o Prisma Client
const SECRET = process.env.JWT_SECRET || 'defaultsecret'; // Mesma chave usada na geração do JWT


// Inicialização do servidor
const server = new ApolloServer({
  typeDefs,  // Define o esquema GraphQL
  resolvers, // Define como os dados serão resolvidos
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    let user = null;

    if (token) {
      try {
        const decodedToken = jwt.verify(token, SECRET);
        user = decodedToken.userId; // Pega o userId do token
      } catch (error) {
        console.log("Token inválido", error);
      }
    }

    return { user, prisma };
  },
});

// Iniciar o servidor
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
