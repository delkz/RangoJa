import prisma from './prisma';

const resolvers = {
  Query: {
    restaurants: async () => {
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
  },
  Restaurant: {
    dishes: async (parent) => {
      return await prisma.dish.findMany({
        where: { restaurantId: parent.id },
      });
    },
  },
};

export default resolvers;
