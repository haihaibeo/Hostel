import { Avatar, Box, BoxProps, Button, Divider, Flex, Grid, HStack, Icon, IconButton, ListItem, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, ModalProps, SimpleGrid, Spacer, Stack, Textarea, UnorderedList, useColorModeValue, useDisclosure, useToast, VStack } from '@chakra-ui/react';
import React from 'react'
import { BsStar, BsStarFill } from 'react-icons/bs';
import { FaCheck, FaStar, FaUserShield } from 'react-icons/fa';
import { useMutation, useQuery } from 'react-query';
import { useLocation } from 'react-router';
import { deleteReservation, fetchPropertiesSaved, fetchUserReservation, postReview, toggleLike, useQueryParam } from '../API';
import RoomCard from '../Components/FilterComponents/RoomCard';
import { AuthContext } from '../Contexts/AuthContext';


const ProfilePage = () => {
    const { user } = React.useContext(AuthContext);

    let query = useQueryParam();
    let view = query.get("view")?.toLowerCase();

    return (
        <Box d="flex" flexDir={{ base: "column", md: "row" }}>
            {/* LEFT */}
            <Box w={{ base: "100%", md: "25%" }} minW="300px">
                <Box d="flex" overflow="hidden" borderWidth="1px" borderRadius="lg" p="4" flexDir={{ base: "row-reverse", md: "column" }} spacing="2">
                    <VStack alignSelf="center" justifySelf="start">
                        <Avatar name={user?.name} boxSize={{ base: "20", md: "40" }}></Avatar>
                        <Button variant="link" my="2" fontSize="sm">Update photo</Button>
                    </VStack>

                    <VStack alignItems="start" spacing="2">
                        <Icon as={FaUserShield} boxSize="8" />
                        <Box as="h4" fontWeight="bold" fontSize="lg" fontFamily="mono">Identity verification</Box>
                        <Box as="h4">Show others you’re really you with the identity verification badge.</Box>

                        <Divider />

                        <Box as="h4" fontWeight="bold" fontSize="lg" fontFamily="mono">{user?.name + " confirmed"}</Box>
                        <Box d="flex" flexDir="row" alignItems="baseline">
                            <FaCheck />
                            <Box as="h4" ml="4">Email confirmed</Box>
                        </Box>
                        <Box d="flex" flexDir="row" alignItems="baseline">
                            <FaCheck />
                            <Box as="h4" ml="4">Phone confirmed</Box>
                        </Box>
                    </VStack>
                </Box>
            </Box>

            <Spacer minW="2" />

            {/* RIGHT */}
            <Box w={{ base: "100%", md: "65%" }}>
                {(view === "likes" || view == null) && <UserLikesProperties></UserLikesProperties>}
                {view === "notifications" && <Notifications></Notifications>}
                {view === "reservations" && <Reservations></Reservations>}
            </Box>
        </Box>
    )
}


type ReviewModalProps = {
    reservationId: string;
    propId: string;
}
const ReviewModal = (modalProps: ModalProps & ReviewModalProps) => {
    const [starHover, setStarHover] = React.useState(0);
    const [starReview, setStarReview] = React.useState(0);
    const [comment, setComment] = React.useState<string>();
    const starColor = useColorModeValue("red", "yellow");

    const toast = useToast();

    const { onClose } = modalProps;

    const mutateReview = useMutation(postReview, {
        onSuccess: (res) => {
            console.log(res.data);
            toast({
                description: "Successfully sent review",
                status: "success"
            })
        },
        onError: (e) => {
            console.log(e);
        }
    });
    const sendReview = () => {
        mutateReview.mutate({
            propertyId: modalProps.propId,
            starCount: starReview,
            reviewComment: comment,
            reservationId: modalProps.reservationId
        })
    }

    return (
        <Modal {...modalProps} onClose={() => { setStarReview(0); onClose(); }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Write a review</ModalHeader>
                <ModalBody>
                    <Flex flexDir="column" gridGap="2">
                        <Box>
                            {Array(5).fill(5).map((_, index) => {
                                return (
                                    <IconButton variant="ghost" aria-label="star" key={index}
                                        onClick={() => { setStarReview(index + 1) }}
                                        _focus={{ borderWidth: "1px" }}
                                        borderRadius="full" onMouseOver={() => setStarHover(index + 1)} onMouseLeave={() => setStarHover(0)}
                                        icon={starHover > index || starReview > index ? <BsStarFill color={starColor} /> : <BsStar />} />)
                            })}
                        </Box>
                        <Textarea size="md" placeholder="Please describe some of your thoughts"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button ml="auto" isDisabled={starReview <= 0} onClick={sendReview}>Send</Button>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

const Reservations = (boxprops: BoxProps) => {
    const reviewModal = useDisclosure();
    const auth = React.useContext(AuthContext)
    const toast = useToast();
    const [propIdReview, setPropIdReview] = React.useState("");

    const { data, error, isError } = useQuery(["reservations", auth.user?.token], fetchUserReservation, {
        onSuccess: (res) => {

        },
        retry: 2,
    })

    const deleteRsvMutate = useMutation<any, MessageResponse, any, any>(deleteReservation, {
        onSuccess: () => { toast({ description: "Reservation is canceled", status: "success" }) },
        onError: (error) => {
            toast({ description: error.errors, status: "success" })
        }
    })

    const handleDelete = (resId: string) => {
        deleteRsvMutate.mutate(resId);
    }

    if (data?.data.length === 0) {
        return <Box>
            You don't have any reservations
        </Box>
    }

    if (isError) return <Box>Something's wrong</Box>

    return <Box {...boxprops}>
        <Flex gridGap="2" flexDir="column">
            <Box as={"h1"} fontFamily={"heading"} fontWeight="bold" fontSize="4xl" mb="3">Your reservations</Box>
            {data?.data.map(d =>
                <Box borderWidth="1px" p="2"
                    style={{ transition: "ease 0.3s" }}
                    _hover={{ transform: "scale(1.02)" }}
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    bg={useColorModeValue('gray.100', 'gray.800')}
                    borderRadius="10px"
                >
                    <Flex key={d.id} w="100%" flexDir="row" gridGap="2">
                        <Stack w="100%" gridGap="2">
                            <UnorderedList h="100%">
                                <Grid h="100%" fontWeight="bold" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} templateRows="auto" gridGap="2">
                                    <ListItem><Box as="h3">From Date: </Box></ListItem>
                                    <Box fontWeight="light">{d.fromDate}</Box>
                                    <ListItem><Box as="h3">To Date: </Box></ListItem>
                                    <Box fontWeight="light">{d.toDate}</Box>
                                    <ListItem><Box as="h3">Total Cost: </Box></ListItem>
                                    <Box fontWeight="light">{d.total}</Box>
                                    <ListItem><Box as="h3">Reserved from: </Box></ListItem>
                                    <Box fontWeight="light">{d.createdAt}</Box>
                                    <ListItem><Box as="h3">Reservations Status: </Box></ListItem>
                                    <Box fontWeight="light">{d.reservationStatus}</Box>
                                    <ListItem><Box as="h3">Payment Status: </Box></ListItem>
                                    <Box fontWeight="light">{d.paymentStatus}</Box>
                                    <Button colorScheme="green"
                                        onClick={() => { setPropIdReview(d.property.id); reviewModal.onOpen(); }}>Write a review</Button>
                                    <Button colorScheme="red"
                                        isDisabled={d.reservationStatus.toLowerCase() !== "on reserved"}
                                        onClick={() => { handleDelete(d.id) }}>Cancel reservation</Button>
                                </Grid>
                            </UnorderedList>
                        </Stack>
                        <Box ml="auto" >
                            <Divider orientation="vertical" borderColor="currentcolor" />
                        </Box>
                        <RoomCard room={d.property} isSaved={true} flex='0 0 15em' borderWidth="0px" />
                    </Flex>
                </Box>
            )}
            <ReviewModal isOpen={reviewModal.isOpen} isCentered onClose={reviewModal.onClose} reservationId="" propId={propIdReview}>
            </ReviewModal>
        </Flex>
    </Box>
}

const UserLikesProperties = () => {
    const { data } = useQuery("propertiesLiked", () => fetchPropertiesSaved(), {
        onSuccess: (res) => {
        },
        refetchOnMount: "always",
    })

    if (data?.data.length === 0) return <Box>Looks like you didn't save any room</Box>

    return (
        <Box>
            <Box as={"h1"} fontFamily={"heading"} fontWeight="bold" fontSize="4xl" mb="3">Rooms that you saved</Box>
            <SimpleGrid spacing="4" columns={{ base: 1, lg: 2 }}>
                {data?.data.map(r => <RoomCard room={r} key={r.id} isSaved={true} />)}
            </SimpleGrid>
        </Box>
    );
}

const Notifications: React.FC = () => {
    return (
        <Box>Notification</Box>
    )
}

export default ProfilePage;