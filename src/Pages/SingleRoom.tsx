import { Box, Button, Divider, Grid, GridItem, Spacer, Image, Popover, PopoverContent, PopoverTrigger, HStack, Flex, VStack, Avatar, useToast, useDisclosure, Collapse, Tooltip, Spinner } from '@chakra-ui/react';
import React from 'react'
import { BsStarFill, BsStar, BsHeart, BsHeartFill } from 'react-icons/bs';
import { useMutation, useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { fetchPricing, fetchPropertyById, toggleLike } from '../API';
import PickRangeDay, { getDatesBetween } from '../Components/NavComponents/PickRangeDay';
import PopDetail from '../Components/NavComponents/PopDetail';
import FloatingForm from '../Components/ReservationForm';
import MyRoomBadge, { defaultRoomBadges } from '../Components/SingleRoomComponents/MyRoomBadge';
import { AuthContext } from '../Contexts/AuthContext';

type SlugProps = {
    slug: string;
}

type SingleRoomProps = {
    initRoom: Room;
}

type OwnerInfo = {
    id: string;
    name: string;
    profileImageUrl?: string;
}

const SingleRoom: React.FC<SingleRoomProps> = ({ initRoom, children }) => {
    const auth = React.useContext(AuthContext);

    const [room, setRoom] = React.useState(defaultRoom);
    const [bookInfo, setBookInfo] = React.useState<BookingInfo>({ guest: 0, children: 0 });
    const [owner, setOwner] = React.useState<OwnerInfo>();
    const [didLike, setDidLike] = React.useState(false);

    const { slug } = useParams<SlugProps>();
    const toast = useToast();

    const { data, isError, error, isLoading } = useQuery(["property", slug],
        () => {
            return fetchPropertyById(slug);
        },
        {
            // staleTime: 1000 * 60 * 3,
            retry: 2,
            onError: (error) => {
                console.log(error);
            },
            onSuccess: (rs) => {
                if (rs.data.liked) setDidLike(rs.data.liked);
                setRoom({ ...rs.data, roomBadges: badges });
                setBookInfo(bi => ({ ...bi, roomId: rs.data.id }))
            },
            onSettled: () => {
            }
        });

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

    const updatePeople = (adult: number, children: number) => {
        setBookInfo((s) => ({
            ...s,
            guest: adult,
            children: children,
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

    // if (isError) {
    //     return <Box>{"Something 's wrong"}</Box>
    // }

    if (data) return (
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
                    leftIcon={(!didLike || !auth.user) ? <BsHeart /> : <BsHeartFill color="red" />}>Like</Button>
            </Box>

            {/* image display */}
            <Box borderRadius="lg" overflow="hidden" mt="4">
                <Grid gap="2" h="40%" maxH="450px" objectFit="cover"
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(4, 1fr)">
                    {room.images.slice(0, 5).map((image, i) => {
                        return (
                            <GridItem key={i} colSpan={i === 0 ? 2 : 1} rowSpan={i === 0 ? 2 : 1} overflow="hidden" >
                                <Image src={image.url} h="auto" height="100%" w="100%" objectFit="cover" loading="lazy"></Image>
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
                    <FloatingForm room={room} bookInfo={bookInfo} updateDate={updateDate} updatePeople={updatePeople} />
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
                        <Avatar name={owner?.name} src={owner?.profileImageUrl}></Avatar>
                    </Flex>
                    <Divider my="3" />

                    {/* room badges */}
                    {room.roomBadges?.map((b, i) => {
                        return <MyRoomBadge id={b.id} key={i}></MyRoomBadge>
                    })}
                    <Divider my="3" />

                    {/* room introduction */}
                    <Box as="h5" fontWeight="semibold" fontSize="2xl">More about room</Box>
                    <Box as="p">{room.introduction}</Box>
                    <Divider my="3" />

                    {/* another datepicker here */}
                    <Box w="100%" display={{ md: "none", lg: "block" }}>
                        <PickRangeDay schedules={{ reservedDates: room.reservedDates, dayOff: room.daysOff }} updateDate={updateDate} />
                    </Box>
                    <Divider my="3" />

                </Box>
            </Box>
        </Box>
    )
    return <></>
}

const badges: RoomBadge[] = defaultRoomBadges;

const defaultRoom: Room = {
    id: "1",
    name: "Crystal palace",
    thumbnailUrl: "https://bit.ly/2Z4KKcF",
    maxGuest: 1,
    images: [
        { url: "https://picsum.photos/1100/1000" },
        { url: "https://picsum.photos/700/1200" },
        { url: "https://picsum.photos/1000/1000" },
        { url: "https://picsum.photos/1200/1000" },
        { url: "https://picsum.photos/1100/900" }
    ],
    thumbnailAlt: "rear view house with pool",
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum congue eros id ligula porta, id fermentum ligula semper. Pellentesque eget pulvinar justo. Phasellus eu risus dolor. Aliquam mollis urna vel lectus ornare, nec ultricies augue gravida. Nunc dignissim diam vel massa cursus condimentum. Nulla pharetra molestie nunc, ac hendrerit felis posuere a. Sed finibus magna ut nibh luctus, ac dapibus mauris cursus. Sed eu porttitor lacus. Nulla venenatis erat quis orci consectetur efficitur. Phasellus nisl nisl, luctus et sapien nec, dictum feugiat felis. Nam nec ullamcorper mi, eu vulputate justo. Nullam nibh ipsum, dictum at commodo nec, molestie et ipsum. Aliquam sit amet tincidunt augue, sit amet consectetur mi.",
    description: "Best place in town",
    location: "Dark side, the moon",
    totalReview: 4,
    totalStar: 19,
    formattedPrice: 2021.00,
    services: ["Pet", "Kitchen", "Breakfast", "Wifi"],
    roomBadges: badges,
    serviceFee: 0.00,
    cleaningFee: 40.00
}



const defaultOwner: OwnerInfo = {
    id: "1234",
    name: "Ivanov Ivan Ivanovich",
    profileImageUrl: "https://scontent-arn2-1.xx.fbcdn.net/v/t1.6435-9/168934405_1649568108574870_2922711241924143290_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=NE0y-9oTNT4AX_6yZvA&_nc_ht=scontent-arn2-1.xx&oh=4a47294ccdbae32c261080108427acd1&oe=6096A09B"
}

export default SingleRoom;