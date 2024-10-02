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
    getAllDishes: async (_, __, { prisma }) => {
      const dishes = await prisma.dish.findMany({
        include: {
          restaurant: true, // Inclui o restaurante relacionado
        },
      });
      return dishes;
    },
    getOrders: async (_, __, { user, prisma }) => {
      if (!user) {
        throw new Error("Autenticação necessária");
      }

      // Obtém todos os pedidos do usuário
      const orders = await prisma.order.findMany({
        where: {
          userId: user,
        },
        include: {
          items: {
            include: {
              dish: true,
            },
          },
        },
      });

      return orders;
    },
    getOrderById: async (_, { orderId },{ user, prisma }) => {
      if (!user) {
        throw new Error("Autenticação necessária");
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              dish: true,
            },
          },
        },
      });

      if (!order || order.userId !== user) {
        throw new Error("Pedido não encontrado ou você não tem permissão");
      }

      return order;
    },
    validateToken: async (parent: any, args: any, context: any) => {
      const { user, prisma } = context;

      // Verifica se o usuário foi autenticado (token é válido)
      if (!user) {
        throw new Error('Token inválido ou não fornecido');
      }

      // Recupera o usuário do banco de dados
      const validUser = await prisma.user.findUnique({
        where: { id: user },
      });

      if (!validUser) {
        throw new Error('Usuário não encontrado');
      }

      return validUser;
    },
  },
  Mutation: {
    createRestaurant: async (_,args: { name: string; description: string; imageUrl?: string }, { user, prisma }) => {
      if (!user) {
        throw new Error("Autenticação necessária");
      }
      const { name, description,imageUrl } = args
      return await prisma.restaurant.create({
        data: {
          name,
          description,
          imageUrl
        },
      });
    },
    createDish: async (_,  args: { name: string; price: number; imageUrl?: string; restaurantId: number }, { user, prisma }) => {
      const { name, price,imageUrl,restaurantId } = args
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
          imageUrl,
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

      const existingUser = await prisma.user.findUnique({
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

    updateOrderStatus: async (_, { orderId, status }, { prisma, user }) => {
      if (!user) {
        throw new Error("Autenticação necessária");
      }

      // Atualiza o status do pedido
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: {
          items: {
            include: {
              dish: true,
            },
          },
        },
      });

      return updatedOrder;
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
