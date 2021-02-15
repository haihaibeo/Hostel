import { Badge, Box, Image } from '@chakra-ui/react';
import React from 'react';

const defaultRoom: RoomCardType = {
    name: "Crystal palace",
    imageUrl: "https://bit.ly/2Z4KKcF",
    imageAlt: "rear view house with pool",
    description: "Best place in town",
    location: "Dark side, the moon",
    rating: 4.5,
    formattedPrice: "2021.00$",
    services: ["Pet", "Kitchen", "Breakfast", "Wifi"]
}

type RoomCardProps = {
    flex?: string;
    room?: RoomCardType;
}

const RoomCard: React.FC<RoomCardProps> = ({ flex, room: roomt, children }) => {
    const room = defaultRoom;
    return (
        <Box overflow="hidden">
            <Image src={room.imageUrl} alt={room.imageAlt} />
            <Box p="4">
                <Box d="flex" alignItems="baseline">
                    <Badge borderRadius="full" px="2" colorScheme="teal">
                        New
                    </Badge>
                    {room.services.map(s => {
                        return (
                            <Box
                                color="gray.500"
                                fontWeight="semibold"
                                letterSpacing="wide"
                                fontSize="xs"
                                textTransform="uppercase"
                                ml="2"
                                isTruncated
                            >{s} {room.services[room.services.length - 1] !== s && <>&bull;</>} </Box>
                        )
                    })}
                </Box>

                <Box
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated
                >
                    {room.name}
                </Box>
            </Box>
        </Box>
    )
}

export default RoomCard;