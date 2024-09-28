import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import typeDefs from './schema';
import resolvers from './resolvers';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'defaultsecret';

const app = express();

// Configuração para servir a pasta "uploads" como pública
const uploadDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

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
        console.log('Token inválido', error);
      }
    }

    return { user, prisma };
  },
});

server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
