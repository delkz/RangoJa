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
  Mutation: {
    createRestaurant: async (_, { name, description }) => {
      return await prisma.restaurant.create({
        data: {
          name, description
        }
      })
    },
    createDish: async (_, { restaurantId, name, price }) => {

      if(price <= 0) {
        throw new Error("Price must be greater than 0");
      } 

      return await prisma.dish.create({
        data: {
          name, price, restaurant: {
            connect: { id: Number(restaurantId) }
          }
        }
      })
    }
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
