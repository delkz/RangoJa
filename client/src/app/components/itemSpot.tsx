type ItemSpotProps = {
    title: string;
    description: string;
    url: string;
}

const ItemSpot = ({ title, description, url }: ItemSpotProps) => {
    return (
        <div>
            <a href={url}>
                <h2>{title}</h2>
                <h3>{description}</h3>
            </a>
        </div>
    )
}

export default ItemSpot