import ItemSpot from "@/app/components/itemSpot";
import { api } from "@/app/services/api";
import getImageUrl from "@/app/services/ImageUrl";
import { Restaurant } from "@/types/types";
import Image from "next/image";
export default async function RestaurantPage({ params }: { params: { id: string } }) {

  const restaurantData: Restaurant = await api.post('', {
    query: `
      query GetRestaurants {
        restaurant(id: ${params.id}) {
          id
          name
          description
          imageUrl
          dishes {
            name
            price
            imageUrl
            id
          }
        }
      }
    `,
  }).then(resp => resp.data.data.restaurant);

  const { name, description, imageUrl,dishes } = restaurantData;

  return (
    <div className="">
      {imageUrl && <Image width={250} height={250} src={getImageUrl(imageUrl)} alt={name} />}
      <h1>{name}</h1>
      <h2>{description}</h2>
      <hr />
      {dishes && dishes.map(dish=>{
        return <ItemSpot key={dish.id} imageUrl={dish.imageUrl} title={dish.name} url={dish.id.toString()} />
      })}
      
    </div>
  );
}
