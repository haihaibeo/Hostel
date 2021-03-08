type RoomCardType = {
    id: string;
    name: string;
    thumbnailUrl: string;
    thumbnailAlt: string;
    description: string;
    location: string;
    totalReview: number;
    totalStar: number;
    formattedPrice: string;
    services: Array<string>;
}

type RoomBadge = {
    id: string;
    title: string;
    description: string;
    icon?: any;
}