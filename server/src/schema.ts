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

    type User {
      id: ID!
      email: String!
      name: String!
    }

    type AuthPayload {
      token: String!
      user: User!
    }

    # Queries
    type Query {
      restaurants: [Restaurant!]!
      restaurant(id: ID!): Restaurant
    }

    type Mutation {
      createRestaurant(name: String!, description: String): Restaurant!
      createDish(restaurantId: ID!,name: String!, price: Float!): Dish!
      signup(email: String!, password: String!, name: String!): AuthPayload!
      login(email: String!, password: String!): AuthPayload!
    }


    
    


`;

export default typeDefs;