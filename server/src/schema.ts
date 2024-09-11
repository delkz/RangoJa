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

    type Order {
      id: ID!
      createdAt: String!
      status: String!
      items: [OrderItem!]!
    }

    type OrderItem{
      id: ID!
      quantity: Int!
      dish: Dish!
    }

    # Queries
    type Query {
      restaurants: [Restaurant!]!
      restaurant(id: ID!): Restaurant
      myOrders: [Order!]!
      getOrders: [Order!]!
      getOrderById(orderId: Int!): Order
      getAllDishes: [Dish!]!
    }

    type Mutation {
      createRestaurant(name: String!, description: String): Restaurant!
      createDish(restaurantId: ID!,name: String!, price: Float!): Dish!
      createOrder(items: [OrderItemInput!]!):Order!
      signup(email: String!, password: String!, name: String!): AuthPayload!
      login(email: String!, password: String!): AuthPayload!
      updateOrderStatus(orderId: Int!, status: String!): Order!
    }

    #Input
    input OrderItemInput {
      dishId: ID!
      quantity: Int!
    }
    

`;

export default typeDefs;