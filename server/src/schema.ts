import { gql } from 'apollo-server';

const typeDefs = gql`
    # Tipos de dados

    type Restaurant {
      id: ID!
      name: String!
      description: String
      dishes: [Dish!]!
    }

    type Dish {
      id: ID!
      name: String!
      price: Float!
      restaurant: Restaurant!
    }

    # Queries
    type Query {
      restaurants: [Restaurant!]!
      restaurant(id: ID!): Restaurant
    }

    type Mutation {
      createRestaurant(name: String!, description: String): Restaurant!
      createDish(restaurantId: ID!,name: String!, price: Float!): Dish!
    }

`;

export default typeDefs;