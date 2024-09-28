export type Restaurant = {
    id: number,
    name: string,
    description?: string,
    imageUrl?:string,
    dishes: Dish[]
}

export type Dish = {
    id: number,
    name: string,
    price: number,
    restaurant: Restaurant,
    restaurantId: number,
    imageUrl?:string,
    orders: OrderItem[],
}

export type User = {
    id: number,
    email: string,
    password: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    Order: Order[],
}

export type Order = {
    id: number,
    createdAt: string,
    user: User,
    userId: number,
    items: OrderItem[],
    status: string, // Status do pedido (ex: PENDING, CONFIRMED, DELIVERED),
}

export type OrderItem = {
    id: number,
    quantity: number,
    dish: Dish,
    dishId: number,
    order: Order,
    orderId: number,
}