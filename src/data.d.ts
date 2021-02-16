type RoomCardType = {
    id: string;
    name: string;
    thumbnailUrl: string;
    thumbnailAlt: string;
    description: string;
    location: string;
    rating: number;
    rateCounter: number;
    formattedPrice: string;
    services: Array<string>;
}