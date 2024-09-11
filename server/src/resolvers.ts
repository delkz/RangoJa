import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

const SECRET = process.env.JWT_SECRET || 'defaultsecret';

const resolvers = {
  Query: {
    restaurants: async (_, __, { user, prisma }) => {
      return await prisma.restaurant.findMany({
        include: {
          dishes: true,
        },
      });
    },
    restaurant: async (_, { id }) => {
      return await prisma.restaurant.findUnique({
        where: { id: Number(id) },
        include: {
          dishes: true,
        },
      });
    },
    myOrders: async (_, __, { user, prisma }) => {
      if (!user) {
        throw new Error("Autentificação necessária");
      }

      return await prisma.order.findMany({
        where: { userId: user },
        include: {
          items: {
            include: {
              dish: true
            }
          }
        }
      })
    },
  },
  Mutation: {
    createRestaurant: async (_, { name, description }, { user, prisma }) => {
      if (!user) {
        throw new Error("Autenticação necessária");
      }

      return await prisma.restaurant.create({
        data: {
          name,
          description,
        },
      });
    },
    createDish: async (_, { restaurantId, name, price }, { user, prisma }) => {

      if (!user) {
        throw new Error("Autenticação necessária");
      }

      if (price <= 0) {
        throw new Error("Price must be greater than 0");
      }

      return await prisma.dish.create({
        data: {
          name,
          price,
          restaurant: {
            connect: { id: Number(restaurantId) },
          },
        },
      });
    },

    createOrder: async (_, { items }, { user, prisma }) => {
      if (!prisma) {
        throw new Error("Prisma não foi definido no contexto!");
      }

      if (!user) {
        throw new Error("Autentificação necessária");
      }

      const order = await prisma.order.create({
        data: {
          user: { connect: { id: user } },
          items: {
            create: items.map(item => ({
              dish: { connect: { id: parseInt(item.dishId) } },
              quantity: item.quantity
            })),
          },
        },
        include: { items: { include: { dish: true } } }
      });
      return order
    },

    // Mutation para registrar novo usuário
    signup: async (_, { email, password, name }, { prisma }) => {

      const existingUser = await prisma.iser.findUnique({
        where: { email },
      })

      if (existingUser) {
        throw new Error("Usuário já existe com esse email");

      }

      const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const token = jwt.sign({ userId: user.id }, SECRET);

      return {
        token,
        user,
      };
    },

    // Mutation para login de usuário
    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Senha incorreta");
      }

      const token = jwt.sign({ userId: user.id }, SECRET);

      return {
        token,
        user,
      };
    },
  },
  Restaurant: {
    dishes: async (parent) => {
      return await prisma.dish.findMany({
        where: { restaurantId: parent.id },
      });
    }
  },
};

export default resolvers;
