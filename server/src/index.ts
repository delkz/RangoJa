import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers';

// Inicialização do servidor
const server = new ApolloServer({
  typeDefs,  // Define o esquema GraphQL
  resolvers, // Define como os dados serão resolvidos
});

// Iniciar o servidor
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
