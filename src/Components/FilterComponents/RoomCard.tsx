import { Badge, Box, Image } from '@chakra-ui/react';
import React from 'react';
import { BsStar, BsStarFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const defaultRoom: RoomCardType = {
    id: "random-id-12321",
    name: "Crystal palace",
    thumbnailUrl: "https://bit.ly/2Z4KKcF",
    thumbnailAlt: "rear view house with pool",
    description: "Best place in town",
    location: "Dark side, the moon",
    totalReview: 4,
    totalStar: 23,
    formattedPrice: "2021.00$",
    services: ["Pet", "Kitchen", "Breakfast", "Wifi"]
}

type RoomCardProps = {
    room: RoomCardType;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, children }) => {
    return (
        <Link to={"/rooms/" + room.id}>
            <Box overflow="hidden" borderWidth="1px" borderRadius="lg">
                <Image src={room.thumbnailUrl} alt={room.thumbnailAlt} />
                <Box p="4">
                    <Box d="flex" alignItems="baseline">
                        <Badge borderRadius="full" px="2" colorScheme="teal">
                            New
                        </Badge>
                        {room.services.map((s, key) => {
                            return (
                                <Box
                                    key={key}
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
                    <Box
                        as="h3"
                        lineHeight="tight"
                        isTruncated
                    >
                        {room.description}
                    </Box>
                    <Box d='flex' justifyContent="space-between">
                        <Box as="h4" fontSize="3xl">
                            {room.formattedPrice}
                        </Box>

                        <Box d="flex" alignItems="center">
                            {Array(5).fill("").map((_, i) => {
                                return (i < room.totalReview - 1 ? <BsStarFill key={i} colorRendering="teal.400" /> : <BsStar key={i} />)
                            })}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Link>
    )
}

export default RoomCard;