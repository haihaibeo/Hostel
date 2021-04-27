interface RoomCard {
    id: string;
    name: string;
    thumbnailUrl: string;
    thumbnailAlt?: string;
    description: string;
    location: string;
    totalReview: number;
    totalStar: number;
    formattedPrice: number;
    services: Array<string>;
}

interface Room extends RoomCard {
    images: {
        id?: string,
        alt?: string,
        url?: string
    }[],
    introduction: string;
    liked?: boolean;
    roomBadges?: RoomBadge[];
    reservedDates?: {
        fromDate: string,
        toDate: string,
    }[];
    daysOff?: Date[];
    serviceFee: number;
    cleaningFee: number;
}

interface UserResponse {
    userId: string;
    name: string;
    email: string;
    token: string;
}

interface RoomBadge {
    id: string;
    title: string;
    description: string;
    icon?: any;
}

interface PropertyTypeType {
    id: string;
    propertyType: string;
    thumbnailImg: string;
    description: string;
    count: number;
}

interface Comment {
    id: string;
    commentUserId: string;
    comment: string;
    datetime: Date;
    belongToCommentId?: string;
}

interface LoginRequest {
    email?: string;
    password?: string;
    remember?: boolean;
}

interface PublishRoomState {
    name: string;
    description: string;
    introdution?: string;
    countryId: string;
    cityId: string; 
    streetName: string;
    addressDesc?: string;
    number: string;
    images: {
        url: string;
        alt?: string;
        deleteHash?: string;
    }[],
    services: {
        wifi: boolean;
        kitchen: boolean;
        breakfast: boolean;
        pet: boolean;
        parking: boolean;
    },
    refundPercent: number;
    pricing: {
        basePrice: number;
        serviceFee: number;
        cleaningFee: number;
    }
}
