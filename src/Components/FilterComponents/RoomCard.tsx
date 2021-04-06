import { Badge, Box, Image, LinkOverlay, Text, Link } from '@chakra-ui/react';
import React from 'react';
import { BsStar, BsStarFill } from 'react-icons/bs';
import { Link as LinkReact } from 'react-router-dom';

type RoomCardProps = {
    room: RoomCardType;
    isSaved: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, children, isSaved }) => {
    return (
        <Box overflow="hidden" borderWidth="1px" borderRadius="lg">
            <Link as={LinkReact} to={"/rooms/" + room.id}>
                <Image src={room.thumbnailUrl} alt={room.thumbnailAlt} style={{ transition: "ease 0.2s" }} _hover={{ WebkitFilter: "brightness(0.7)" }} />
            </Link>

            <Box p="4" d="flex" flexDir="column">
                {!isSaved &&
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
                }
                <Box
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                >
                    {room.name}
                </Box>

                {!isSaved &&
                    <Box
                        as={"p"}
                        lineHeight="tight"
                        textOverflow="ellipsis"
                        overflow="hidden"
                    >
                        {room.description.length > 100 ? room.description.substring(0, 100) + "..." : room.description}
                    </Box>
                }

                <Box d='flex' justifyContent="space-between" justifySelf="end">
                    <Box as="h4" fontSize="3xl">
                        {room.formattedPrice + "$"}
                    </Box>

                    <Box d="flex" alignItems="center">
                        {Array(5).fill("").map((_, i) => {
                            return (i < Math.round(room.totalStar / room.totalReview) ? <BsStarFill key={i} colorRendering="teal.400" /> : <BsStar key={i} />)
                        })}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default RoomCard;