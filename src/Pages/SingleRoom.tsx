import { Box, Button, Divider, Grid, GridItem, Spacer, Image, Popover, PopoverContent, PopoverTrigger, HStack, Flex, VStack, Avatar, useToast } from '@chakra-ui/react';
import { userInfo } from 'os';
import React from 'react'
import { BsStarFill, BsStar, BsHeart, BsHeartFill } from 'react-icons/bs';
import { useMutation, useQuery } from 'react-query';
import { Link, Redirect, useParams } from 'react-router-dom';
import { fetchProperty, toggleLike } from '../API';
import Navbar from '../Components/NavComponents/Navbar';
import PickRangeDay from '../Components/NavComponents/PickRangeDay';
import PopDetail from '../Components/NavComponents/PopDetail';
import SearchBar from '../Components/NavComponents/SearchBar';
import MyRoomBadge, { defaultRoomBadges } from '../Components/SingleRoomComponents/MyRoomBadge';
import { AuthContext } from '../Contexts/AuthContext';

type SlugProps = {
    slug: string;
}

interface RoomType extends RoomCardType {
    images: string[];
    roomIntroduction: string;
    liked?: boolean;
    roomBadges?: RoomBadge[];
}

type SingleRoomProps = {
    room: RoomType;
}

type OwnerInfo = {
    id: string;
    name: string;
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

const SingleRoom: React.FC<SingleRoomProps> = ({ room, children }) => {
    room = defaultRoom;
    const auth = React.useContext(AuthContext);
    const { slug } = useParams<SlugProps>();
    const [bookInfo, setBookInfo] = React.useState<BookingInfo>({ adult: 1, children: 0, roomQuant: 1 });
    const [owner, setOwner] = React.useState<OwnerInfo>();
    const [didLike, setDidLike] = React.useState(room.liked);
    const toast = useToast();

    const { data } = useQuery(["property", slug], () => fetchProperty(slug));
    console.log(data?.data);

    const mutateLike = useMutation(toggleLike, {
        onSuccess: (res) => {
            setDidLike(res.data.liked);
            toast({
                description: res.data.liked ? "Saved room" : "Removed from wishlist",
                status: "info",
                duration: 1000
            });
        },
        onError: (error) => console.log(error)
    })

    React.useEffect(() => {
        setOwner(defaultOwner);
    }, [])

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

    const handleLike = () => {
        if (!auth.user) {
            toast({
                description: "Login is required",
                status: "info",
                duration: 1000
            });
            return;
        }
        mutateLike.mutate({ roomId: room.id, token: auth.user.token })
    }

    return (
        <Box>
            <Divider my="5" />
            {/* title */}
            <Box as="h2" fontSize="3xl" fontWeight="semibold">{room.name}</Box>

            {/* rating, location, like button */}
            <Box d="flex" mt="1" flexDir={{ base: "column", sm: "row" }}>
                <Box d="flex" alignItems="start">
                    <Box d="flex" flexDir={{ base: "column", sm: "row" }}>
                        <Box d="flex" flexDir={{ base: "row" }}>
                            {Array(5).fill("").map((_, i) => {
                                return (i < Math.round(room.totalStar / room.totalReview) ? <BsStarFill key={i} colorRendering="teal.400" /> : <BsStar key={i} />)
                            })}
                        </Box>
                        <Box as="span" ml="2" color="gray.500">{room.totalReview} reviews</Box>
                    </Box>
                    <Spacer />
                    <Link to="/">
                        <Button variant="link">
                            <Box mx="4">&bull;</Box>
                            {room.location}
                        </Button>
                    </Link>
                </Box>

                <Spacer />

                <Button alignSelf="start" variant="ghost" size="sm"
                    onClick={() => handleLike()}
                    leftIcon={!didLike ? <BsHeart /> : <BsHeartFill color="red" />}>Like</Button>
            </Box>

            {/* image display */}
            <Box borderRadius="lg" overflow="hidden" mt="4">
                <Grid gap="2" h="40%" maxH="450px" objectFit="cover"
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(4, 1fr)">
                    {room.images.map((image, i) => {
                        return (
                            <GridItem key={i} colSpan={i === 0 ? 2 : 1} rowSpan={i === 0 ? 2 : 1} overflow="hidden" >
                                <Image src={image} h="auto" height="100%" w="100%" objectFit="cover" loading="lazy"></Image>
                            </GridItem>
                        )
                    })}
                </Grid>
            </Box>

            {/* info  */}
            <Box mt="4" d={["flex", "flex", "flex", "block"]} flexDir="column-reverse">
                {/* floating form */}
                <Box w={["100%", "100%", "100%", "35%"]} boxShadow="2xl" mt={{ base: "4", lg: "0" }} top="30%" float={{ lg: "right" }} position={{ lg: "sticky" }}
                    borderRadius="lg"
                    display="inline-flex" flexDir="column" zIndex={1} borderWidth="thin"
                    p="4" alignContent="center" justifyContent="center">
                    <Flex alignItems="baseline">
                        <Box as="h2" fontFamily="mono" fontSize="3xl" fontWeight="semibold">{room.formattedPrice + "$"}
                        </Box>
                        <Box as="span" color="gray.500">
                            /per night
                        </Box>
                        <Spacer />
                        <Box d="flex" alignItems="center">
                            {Array(5).fill("").map((_, i) => {
                                return (i < Math.round(room.totalStar / room.totalReview) ? <BsStarFill key={i} colorRendering="teal.400" /> : <BsStar key={i} />)
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
                                        {bookInfo?.bookFromDate?.toLocaleDateString() || "From"}
                                    </Button>
                                    <Button variant="outline" borderTopRightRadius="lg"
                                        size="lg" w="100%"
                                        _focusVisible={{ border: "0" }}
                                        borderRadius="0">
                                        {bookInfo?.bookToDate?.toLocaleDateString() || "To"}
                                    </Button>
                                </HStack>
                            </PopoverTrigger>
                            <PopoverContent flexWrap="nowrap" alignItems="center" w="550px" borderRadius="0" bg="inherit" bgColor="rgba(66, 153, 225, 0.8)">
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

                {/* Detail information about this room */}
                <Box height="1000px" w={["100%", "100%", "100%", "60%"]}>
                    {/* name, avatar */}
                    <Flex alignItems="center">
                        <VStack alignItems="start">
                            <Box as="h1" fontSize="2xl" fontWeight="semibold" >{"Owner: " + owner?.name}</Box>
                            <HStack>
                                {room.services.map((s, i) => {
                                    return (
                                        <Box
                                            key={i}
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
                            </HStack>
                        </VStack>

                        <Spacer />
                        <Avatar name={owner?.name}></Avatar>
                    </Flex>
                    <Divider my="3" />

                    {/* room badges */}
                    {room.roomBadges?.map((b, i) => {
                        return <MyRoomBadge id={b.id} key={i}></MyRoomBadge>
                    })}
                    <Divider my="3" />

                    {/* room introduction */}
                    <Box as="h5" fontWeight="semibold" fontSize="2xl">More about room</Box>
                    <Box as="p">{room.roomIntroduction}</Box>
                    <Divider my="3" />

                    {/* another datepicker here */}
                    <Box w="100%" display={{ base: "none", sm: "block", md: "block" }}>
                        <PickRangeDay updateDate={updateDate}></PickRangeDay>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const badges: RoomBadge[] = defaultRoomBadges;

const defaultRoom: RoomType = {
    id: "1",
    name: "Crystal palace",
    thumbnailUrl: "https://bit.ly/2Z4KKcF",
    images: ["https://picsum.photos/1100/1000", "https://picsum.photos/700/1200",
        "https://picsum.photos/1000/1000", "https://picsum.photos/1200/1000",
        "https://picsum.photos/1100/900"],
    thumbnailAlt: "rear view house with pool",
    roomIntroduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum congue eros id ligula porta, id fermentum ligula semper. Pellentesque eget pulvinar justo. Phasellus eu risus dolor. Aliquam mollis urna vel lectus ornare, nec ultricies augue gravida. Nunc dignissim diam vel massa cursus condimentum. Nulla pharetra molestie nunc, ac hendrerit felis posuere a. Sed finibus magna ut nibh luctus, ac dapibus mauris cursus. Sed eu porttitor lacus. Nulla venenatis erat quis orci consectetur efficitur. Phasellus nisl nisl, luctus et sapien nec, dictum feugiat felis. Nam nec ullamcorper mi, eu vulputate justo. Nullam nibh ipsum, dictum at commodo nec, molestie et ipsum. Aliquam sit amet tincidunt augue, sit amet consectetur mi.",
    description: "Best place in town",
    location: "Dark side, the moon",
    totalReview: 4,
    totalStar: 19,
    formattedPrice: 2021.00,
    services: ["Pet", "Kitchen", "Breakfast", "Wifi"],
    roomBadges: badges,
}



const defaultOwner: OwnerInfo = {
    id: "1234",
    name: "Ivanov Ivan Ivanovich",
}

export default SingleRoom;