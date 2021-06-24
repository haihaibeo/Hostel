import { Box, Button, Divider, Grid, GridItem, Spacer, Image, HStack, Flex, VStack, Avatar, useToast, BoxProps, Center, Spinner, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import { BsStarFill, BsStar, BsHeart, BsHeartFill } from 'react-icons/bs';
import { useMutation, useQuery } from 'react-query';
import { Link, Redirect, useHistory, useLocation, useParams } from 'react-router-dom';
import { toggleCloseProperty, fetchPropertyById, fetchReviewsForProperty, toggleLike } from '../API';
import PickRangeDay from '../Components/NavComponents/PickRangeDay';
import FloatingForm from '../Components/FloatingForm';
import MyRoomBadge, { defaultRoomBadges } from '../Components/SingleRoomComponents/MyRoomBadge';
import { AuthContext } from '../Contexts/AuthContext';
import { ActionAlert } from '../Components/AlertDialog';

type SlugProps = {
    slug: string;
}

type SingleRoomProps = {
    initRoom: Room;
}

const SingleRoom: React.FC<SingleRoomProps> = ({ initRoom, children }) => {
    const auth = React.useContext(AuthContext);

    // const [room, setRoom] = React.useState<Room>();
    const [bookInfo, setBookInfo] = React.useState<BookingInfo>({ guest: 0, children: 0 });
    const [didLike, setDidLike] = React.useState(false);

    const { slug } = useParams<SlugProps>();
    const toast = useToast();
    const history = useHistory();

    const alertDeleteDialog = useDisclosure();
    const cancelRef = React.useRef(null);

    const { data, isError, error, isLoading } = useQuery(["property", slug],
        () => {
            return fetchPropertyById(slug);
        },
        {
            staleTime: 1000 * 60 * 3,
            retry: 2,
            onError: (error) => {
                console.log(error);
            },
            onSuccess: (rs) => {
                if (rs.data.liked) setDidLike(rs.data.liked);
                console.log(rs.data);
                // setRoom({ ...rs.data, roomBadges: badges });
                setBookInfo(bi => ({ ...bi, roomId: rs.data.id }))
            },
            onSettled: () => {
            }
        });

    const room = data?.data;

    const likeMutation = useMutation(toggleLike, {
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
        if (!room) return;
        if (!auth.user) {
            toast({
                description: "Login is required",
                status: "info",
                duration: 1000
            });
            return;
        }
        likeMutation.mutate({ roomId: room.id, token: auth.user.token })
    }

    let location = useLocation();

    const handleEditProp = () => {
        history.push({ ...location, pathname: `/host/publish`, search: `?id=${room?.id}` });
    }

    const handleLocationOnClick = (location: string) => {
        history.push({
            pathname: "/rooms",
            state: {
                search: {
                    city: location,
                }
            }
        })
    }

    if (isLoading) return (
        <Center><Spinner /></Center>
    )

    if (room) return (
        <Box>
            <Divider my="5" />
            {/* title */}
            <Box as="h2" fontSize="3xl" fontWeight="semibold">{room.name}</Box>

            {/* rating, location, like button */}
            <Box d="flex" mt="1" flexDir={{ base: "column", sm: "row" }} justifyItems="baseline">
                <Box d="flex" alignItems="start">
                    <Box d="flex" flexDir={{ base: "column", sm: "row" }}>
                        <Box d="flex" flexDir={{ base: "row" }}>
                            {Array(5).fill("").map((_, i) => {
                                return (i < Math.round(room.totalStar / room.totalReview) ? <BsStarFill key={i} colorRendering="teal.400" /> : <BsStar key={i} />)
                            })}
                        </Box>
                        <Box as="span" ml="2" color="gray.500">{room.totalReview} reviews</Box>
                    </Box>
                    <Box mx="4">&bull;</Box>
                    <Button variant="link" onClick={() => handleLocationOnClick(room.location)}>
                        {room.location}
                    </Button>
                </Box>

                <Spacer />
                {(room.ownerInfo.userId === auth.user?.userId || auth.user?.roles.includes("Admin")) &&
                    <>
                        {room.propertyStatus == "IsActive" ?
                            <Button colorScheme="red" mr="2" onClick={alertDeleteDialog.onOpen}>
                                Close this property
                            </Button> :
                            <Button colorScheme="green" mr='2' onClick={alertDeleteDialog.onOpen}>
                                Reopen this property
                            </Button>
                        }
                        <Button onClick={() => { handleEditProp() }}>
                            Edit
                        </Button>
                        <ActionAlert
                            isOpen={alertDeleteDialog.isOpen}
                            onClose={alertDeleteDialog.onClose}
                            propertyId={room.id}
                            leastDestructiveRef={cancelRef}
                            headerMessage={room.propertyStatus == "IsActive" ? "Close your property" : "Reopen this property"}
                            message={room.propertyStatus == "IsActive" ?
                                "Closing this property will prevent further reservations. Please confirm your action!" :
                                "Reopen this property will allow guest to find your property and make reservations"}
                        > </ActionAlert>
                    </>
                }
                <Button alignSelf="start" variant="ghost"
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
                <Box w={["100%", "100%", "100%", "60%"]}>
                    {/* name, avatar */}
                    <Flex alignItems="center">
                        <VStack alignItems="start">
                            <Box as="h1" fontSize="2xl" fontWeight="semibold" >{"Owner: " + room.ownerInfo.name}</Box>
                            <HStack>
                                {room.services && room.services.map((s, i) => {
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
                                        >{s.serviceName} {room.services[room.services.length - 1] !== s && <>&bull;</>} </Box>
                                    )
                                })}
                            </HStack>
                        </VStack>

                        <Spacer />
                        <Avatar name={room.ownerInfo.name} src={room.ownerInfo.profileImageUrl}
                            cursor="pointer"
                            onClick={() => alert("go to user's page")}
                        />
                    </Flex>
                    <Divider my="3" />

                    {/* room badges */}
                    {badges?.map((b, i) => {
                        return <MyRoomBadge id={b.id} key={i}></MyRoomBadge>
                    })}
                    <Divider my="3" />

                    {/* room introduction */}
                    <Box as="h5" fontWeight="semibold" fontSize="2xl">More about room</Box>
                    <Box as="p">{room.introduction}</Box>
                    <Divider my="3" />

                    {/* another datepicker here */}
                    <Box w="100%" display={{ base: "none", sm: "block" }}>
                        <PickRangeDay schedules={{ reservedDates: room.reservedDates, dayOff: room.daysOff }} updateDate={updateDate} />
                    </Box>
                </Box>

            </Box>
            <Divider my="5" />
            <ReviewDisplay propId={room.id} />
        </Box>
    )
    return <></>
}

type ReviewDisplayProps = {
    propId: string;
}

const ReviewDisplay = (props: ReviewDisplayProps & BoxProps) => {
    const { propId, ...boxProps } = props;

    const fetchReviews = useQuery(["reviews", propId], () => fetchReviewsForProperty(propId), {
        retry: 2,
        onSuccess: (data) => {
        },
    });

    const reviews: Review[] = fetchReviews.data?.data ? fetchReviews.data.data : [];
    let totalStar = 0;
    reviews.forEach(r => totalStar += r.starCount);

    return (
        <Box>
            <Box d="flex" gridGap="2" alignItems="baseline" fontWeight="semibold" fontSize="2xl" mb="5">
                <BsStarFill />
                <Box as="h2"> {reviews.length != 0 ? (totalStar / reviews.length).toPrecision(2) : 0} ({reviews.length} reviews)</Box>
            </Box>

            {fetchReviews.data?.data.length === 0
                ? <Box fontWeight="light">Looks like this property does not have any reviews</Box>
                :
                <Box d='flex' flexWrap="wrap" gridGap="5">
                    {fetchReviews.data?.data.map(r => <ReviewComment review={r} key={r.reviewId} />)}
                </Box>
            }
        </Box>
    )
}

const testReview: Review = {
    user: {
        name: "Test user name",
        userId: "123",
        profileImageUrl: "",
        email: "email@mail.com",
        phoneNumber: "0-9"
    },
    comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, repellat. Harum, facilis corrupti eligendi laborum minus nihil et a mollitia!",
    propertyId: "1",
    reviewId: "123123",
    starCount: 4,
    timeCreated: "20202020",
    timeUpdated: "20202020"
}

type ReviewCommentProps = {
    review: Review;
}

const ReviewComment = (props: ReviewCommentProps & BoxProps) => {
    const { review, ...boxProps } = props;
    return (
        <Box {...boxProps} flex="1 1 25em">
            <Box d="flex" flexDir="row" gridGap="2">
                <Avatar name={review.user?.name} src={review.user.profileImageUrl}></Avatar>
                <Box d="flex" flexDir="column">
                    <Box as="h4" fontWeight="bold">{review.user.name}</Box>
                    <Box as="h4" fontWeight="light">{review.timeUpdated}</Box>
                </Box>
            </Box>
            <Box as="h4" >{review.comment}</Box>
        </Box>
    )
}

const badges: RoomBadge[] = defaultRoomBadges;

export default SingleRoom;