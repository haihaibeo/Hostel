import { Box, Button, Divider, Grid, GridItem, Spacer, Image, Popover, PopoverContent, PopoverTrigger, HStack, Flex } from '@chakra-ui/react';
import { userInfo } from 'os';
import React from 'react'
import { BsStarFill, BsStar, BsHeart } from 'react-icons/bs';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../Components/NavComponents/Navbar';
import PickRangeDay from '../Components/NavComponents/PickRangeDay';
import PopDetail from '../Components/NavComponents/PopDetail';
import SearchBar from '../Components/NavComponents/SearchBar';

type SlugProps = {
    slug: string;
}

interface RoomType extends RoomCardType {
    images: string[];
}

type SingleRoomProps = {
    room: RoomType;
}

type BookingInfo = {
    roomId?: string;
    userId?: string;
    bookFromDate?: Date;
    bookToDate?: Date;
    children: number;
    adult: number;
    roomQuant: number;
}

const GetRoomById = (id: string) => {
}

const SingleRoom: React.FC = () => {
    const { slug } = useParams<SlugProps>();
    const [bookInfo, setBookInfo] = React.useState<BookingInfo>({ adult: 1, children: 0, roomQuant: 1 });

    const updateDate = (from?: Date, to?: Date) => {
        setBookInfo(s => ({
            ...s,
            bookFromDate: from,
            bookToDate: to
        }));
    }

    const updatePeople = (adult: number, children: number, room: number) => {
        setBookInfo((s) => ({
            ...s,
            adult: adult,
            children: children,
            roomQuant: room
        }));
    }

    const room = defaultRoom;

    return (
        <Box mx="10%" mt="5">
            <Navbar></Navbar>
            <Divider my="5" />

            {/* title */}
            <Box as="h2" fontSize="3xl" fontWeight="semibold">{room.name}</Box>

            {/* rating, location, like button */}
            <Box d="flex" mt="1">
                <Box d="flex" alignItems="center">
                    {Array(5).fill("").map((_, i) => {
                        return (i < room.rating - 1 ? <BsStarFill colorRendering="teal.400" /> : <BsStar />)
                    })}

                    <Box as="span" ml="2" color="gray.500">{room.rating} reviews</Box>

                    <Box mx="4">&bull;</Box>

                    <Link to="/">
                        <Button variant="link">{room.location}</Button>
                    </Link>
                </Box>

                <Spacer />

                <Button variant="ghost" size="sm" leftIcon={<BsHeart />}>Like</Button>
            </Box>

            {/* image display */}
            <Box borderRadius="lg" overflow="hidden" mt="4">
                <Grid gap="2" h="40%" maxH="450px" objectFit="cover"
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(4, 1fr)">

                    <GridItem colSpan={2} rowSpan={2} overflow="hidden" >
                        <Image src={room.images[0]} h="auto" height="100%" w="100%" objectFit="cover"></Image>
                    </GridItem>

                    <GridItem colSpan={1} rowSpan={1} overflow="hidden" >
                        <Image src={room.images[0]} h="auto" height="100%" w="100%" objectFit="cover"></Image>
                    </GridItem>
                    <GridItem colSpan={1} rowSpan={1} overflow="hidden" >
                        <Image src={room.images[0]} h="auto" height="100%" w="100%" objectFit="cover"></Image>
                    </GridItem>
                    <GridItem colSpan={1} rowSpan={1} overflow="hidden" >
                        <Image src={room.images[0]} h="auto" height="100%" w="100%" objectFit="cover"></Image>
                    </GridItem>
                    <GridItem colSpan={1} rowSpan={1} overflow="hidden" >
                        <Image src={room.images[0]} h="auto" height="100%" w="100%" objectFit="cover"></Image>
                    </GridItem>
                </Grid>
            </Box>

            {/* info  */}
            <Box mt="4">
                {/* floating form */}
                <Box w="35%" top="30%" float="right" position="sticky" borderRadius="lg"
                    display="inline-flex" flexDir="column" zIndex={1} borderWidth="thin"
                    p="4" alignContent="center" justifyContent="center">
                    <Flex alignItems="baseline">
                        <Box as="h2" fontFamily="mono" fontSize="3xl" fontWeight="semibold">{room.formattedPrice}
                        </Box>
                        <Box as="span" color="gray.500">
                            /per night
                        </Box>
                        <Spacer />
                        <Box d="flex" alignItems="center">
                            {Array(5).fill("").map((_, i) => {
                                return (i < room.rating - 1 ? <BsStarFill colorRendering="teal.400" /> : <BsStar />)
                            })}
                        </Box>
                    </Flex>

                    <Box mt="4">
                        <Popover closeOnBlur={true}>
                            <PopoverTrigger>
                                <HStack spacing="0">
                                    <Button variant="outline" borderTopLeftRadius="lg"
                                        size="lg" w="100%"
                                        _focusVisible={{ border: "0" }}
                                        borderRadius="0">
                                        {bookInfo?.bookFromDate?.toDateString() || "From"}
                                    </Button>
                                    <Button variant="outline" borderTopRightRadius="lg"
                                        size="lg" w="100%"
                                        _focusVisible={{ border: "0" }}
                                        borderRadius="0">
                                        {bookInfo?.bookToDate?.toDateString() || "To"}
                                    </Button>
                                </HStack>
                            </PopoverTrigger>
                            <PopoverContent flexWrap="nowrap" alignItems="center" w={["100%", "100%", "200%", "200%"]} left={["0%", "0%", "-50%", "-50%"]} borderRadius="0" bg="inherit" bgColor="rgba(66, 153, 225, 0.8)">
                                <PickRangeDay updateDate={updateDate} />
                            </PopoverContent>
                        </Popover>
                        <Popover>
                            <PopoverTrigger>
                                <Button variant="outline" w="100%" size="lg" borderRadius="0" borderBottomRadius="lg" px="2">{bookInfo.adult + ' adult(s) - ' + bookInfo.children + ' child(s) - ' + bookInfo.roomQuant + ' room(s)'}</Button>
                            </PopoverTrigger>
                            <PopoverContent flexWrap="nowrap" borderRadius="0" bg="inherit" bgColor="rgba(66, 153, 225, 0.8)">
                                <PopDetail updatePeople={updatePeople} adult={bookInfo.adult} bedRoom={bookInfo.roomQuant} children={bookInfo.children}></PopDetail>
                            </PopoverContent>
                        </Popover>
                    </Box>

                    <Button variant="solid" colorScheme="green" alignSelf="stretch" mt="4">Check for reservation</Button>
                </Box>
                <Box bg="tomato" height="1000px" w="60%" mr="40%" opacity="0.5">

                </Box>
            </Box>

            <Box height="1000px" bg="yellow.600" mt="4"></Box>
        </Box>
    )
}

const defaultRoom: RoomType = {
    id: "random-id-12321",
    name: "Crystal palace",
    thumbnailUrl: "https://bit.ly/2Z4KKcF",
    images: ["https://picsum.photos/1100/1000", "https://picsum.photos/700/1200",
        "https://picsum.photos/1000/1000", "https://picsum.photos/1200/1000",
        "https://picsum.photos/1100/900"],
    thumbnailAlt: "rear view house with pool",
    description: "Best place in town",
    location: "Dark side, the moon",
    rating: 4.5,
    rateCounter: 23,
    formattedPrice: "2021.00$",
    services: ["Pet", "Kitchen", "Breakfast", "Wifi"]
}

export default SingleRoom;