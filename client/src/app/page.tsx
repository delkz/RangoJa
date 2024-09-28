import { Restaurant } from '@/types/types';
import ItemSpot from './components/itemSpot';
import { api } from './services/api';

export default async function Home() {
  const restaurants:Restaurant[] = await api.post('', {
    query: `
      query GetRestaurants {
        restaurants {
          id
          name
          description
        }
      }
    `,
  }).then(resp=>resp.data.data.restaurants);

  // console.log({restaurants});
  return (
    <div className="">
      {restaurants && restaurants.map((restaurant : Restaurant)=>{
        return <ItemSpot key={restaurant.id} title={restaurant.name} description={restaurant.description || ""} url={'/restaurant/'+restaurant.id}/>
      })}
    </div>
  );
}
