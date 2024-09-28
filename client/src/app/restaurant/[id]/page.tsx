import ItemSpot from "@/app/components/itemSpot";
import { api } from "@/app/services/api";
// import { Restaurant } from "@/types/types";
export default async function Restaurant({ params }: { params: { id: string } }) {

  const restaurantData= await api.post('', {
    query: `
      query Query() {
        restaurant(id: ${params.id}) {
          id
          name
          description
        }
      }
    `,
  }).then(resp=>resp);

  console.log(restaurantData)

  return (
    <div className="">
      <ItemSpot title={'Prato A'} description={'Descrição do Prato A'} url={'url do Prato a'}/>
      <ItemSpot title={'Prato B'} description={'Descrição do Prato B'} url={'url do Prato b'}/>
      <ItemSpot title={'Prato C'} description={'Descrição do Prato C'} url={'url do Prato c'}/>
    </div>
  );
}
