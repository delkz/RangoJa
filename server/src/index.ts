import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import typeDefs from './schema';
import resolvers from './resolvers';
import multer from 'multer';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'defaultsecret';

const app = express();

// Configuração do Multer para armazenamento de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Pasta onde os arquivos serão armazenados
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nome do arquivo
  }
});

const upload = multer({ storage: storage });

// Rota REST para upload de arquivos
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    res.json({
      filename: file.filename,
      mimetype: file.mimetype,
      path: file.path,
    });
  } catch (error) {
    res.status(400).send('Erro ao fazer upload do arquivo.');
  }
});

// Inicializar o Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    let user = null;

    if (token) {
      try {
        const decodedToken = jwt.verify(token, SECRET);
        user = decodedToken.userId;
      } catch (error) {
        console.log("Token inválido", error);
      }
    }

    return { user, prisma };
  },
});

// Aplicar o middleware do Apollo Server ao Express
server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
