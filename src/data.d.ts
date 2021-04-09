type RoomCardType = {
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

type UserResponse = {
    userId: string;
    name: string;
    email: string;
    token: string;
}

type RoomBadge = {
    id: string;
    title: string;
    description: string;
    icon?: any;
}

type PropertyTypeType = {
    id: string;
    propertyType: string;
    thumbnailImg: string;
    description: string;
    count: number;
}

type Comment = {
    id: string;
    commentUserId: string;
    comment: string;
    datetime: Date;
    belongToCommentId?: string;
}

type LoginRequest = {
    email?: string;
    password?: string;
    remember?: boolean;
}