import Image from "next/image";
import getImageUrl from "../services/ImageUrl";

type ItemSpotProps = {
    title: string;
    description?: string;
    url: string;
    imageUrl?:string;
}

const ItemSpot = ({ title, description, url,imageUrl }: ItemSpotProps) => {
    return (
        <div>
            <a href={url}>
                {imageUrl && <Image width={250} height={250} src={getImageUrl(imageUrl)} alt={title} />}
                <h2>{title}</h2>
                {description && <h3>{description}</h3>}
            </a>
        </div>
    )
}

export default ItemSpot