type RoomProps = {
    id: string;
    name: string;
    special: string;
    kitchen: boolean;
    size: number;
    freeWifi: boolean;
    breakfast: boolean;
    type: string; // TODO: specify type list
    refundable: boolean;
    extras: string[];
    image: string[];
    location: string;
}