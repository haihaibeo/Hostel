import { Badge, Box, Image, LinkOverlay, Text, Link, BoxProps, useColorModeValue, Spacer, Center } from '@chakra-ui/react';
import React from 'react';
import { BsStar, BsStarFill } from 'react-icons/bs';
import { Link as LinkReact } from 'react-router-dom';

type RoomCardProps = {
    room: RoomCard;
    isSaved: boolean;
}

const RoomCard = ({ room, isSaved, ...props }: RoomCardProps & BoxProps) => {
    return (
        <Box borderWidth="1px" borderRadius="lg" {...props} bg={useColorModeValue("gray.100", "gray.900")} d="flex" flexDir="column">
            <Link as={LinkReact} to={"/rooms/" + room.id} >
                <Box minH="200px" maxH="300px" overflow="hidden">
                    <Image src={room.thumbnailUrl}
                        objectFit="cover" fit="cover"
                        fallback={<Box bgColor="gray" color="gray" />}
                        alt={room.thumbnailAlt} overflow="hidden"
                        style={{ transition: "ease 0.5s" }}
                        _hover={{ transform: "scale(1.1)" }} />
                </Box>
            </Link>

            <Spacer />

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

                <Box d='flex' flexWrap="wrap" justifySelf="end" alignItems="baseline" flexDir="row">
                    <Box as="h4" fontSize="3xl">
                        {room.formattedPrice + "$"}
                    </Box>
                    <Box as="span" color="gray.500" fontStyle="italic">
                        / per night
                    </Box>

                    <Box d="flex" alignItems="center" alignSelf="center" ml="auto">
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