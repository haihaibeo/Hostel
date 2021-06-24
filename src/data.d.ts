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
    services: Array<Service>;
    propertyStatus: PropertyStatus;
}

interface Service {
    serviceId: string;
    serviceName: string;
    description?: string;
}

interface Room extends RoomCard {
    maxGuest: number;
    images: Image[];
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
    ownerInfo: UserInfo;
    propertyTypeId?: string;
    streetName?: string;
    note?: string;
    propertyNumber: string;
}

enum Role {
    Admin = "Admin",
    Owner = "Owner",
    User = "User"
}

type PropertyStatus = "IsActive" | "OnValidation" | "IsRejected" | "IsClosed"

interface UserResponse {
    name: string;
    email: string;
    roles: string[] | string;
    token: string;
    userId: string;
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

interface RegisterRequest extends LoginRequest {
    confirmPassword?: string;
}

interface Image {
    id?: string;
    url: string;
    alt?: string;
    deleteHash?: string;
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
    maxGuest: number;
    propTypeId: string;
    images: Image[];
    serviceIdList: string[];
    refundPercent: number;
    basePrice: number;
    serviceFee: number;
    cleaningFee: number;
}

interface BookingInfo {
    roomId?: string;
    userId?: string;
    bookFromDate?: Date;
    bookToDate?: Date;
    children: number;
    guest: number;
}

type AppRole = "User" | "Owner" | "Admin"

interface CheckPricingResponse {
    nightCount: number;
    pricePerNight: number;
    serviceFee: number;
    cleaningFee: number;
    discount: number;
    discountPercent: number;
    totalCost: number;
}

interface ReservationResponse {
    id: string;
    property: RoomCard;
    fromDate: string;
    toDate: string;
    createdAt: string;
    total: number;
    paymentStatus: string;
    reservationStatus: string;
}

interface SearchQuery {
    country?: string;
    city?: string;
    from?: Date;
    to?: Date;
    guestNum: number;
    childrenNum: number;
}

interface PostReviewRequest{
    propertyId: string;
    reservationId?: string;
    starCount: number;
    reviewComment?: string;
}

type UserInfo = {
    userId: string;
    name: string;
    profileImageUrl?: string;
    phoneNumber?: string;
    email: string;
}

interface Review {
    user: UserInfo;
    reviewId: string;
    comment: string;
    starCount: number;
    propertyId: string;
    timeCreated: string;
    timeUpdated: string;
}

interface MessageResponse {
    messages?: string | string[];
    errors?: string | string[];
}