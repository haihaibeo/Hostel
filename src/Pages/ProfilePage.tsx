import { Avatar, Box, Button, Divider, Icon, SimpleGrid, Spacer, VStack } from '@chakra-ui/react';
import React from 'react'
import { FaCheck, FaUserShield } from 'react-icons/fa';
import { useLocation } from 'react-router';
import { toggleLike } from '../API';
import RoomCard from '../Components/FilterComponents/RoomCard';
import { AuthContext } from '../Contexts/AuthContext';

const useQueryParam = () => {
    return new URLSearchParams(useLocation().search);
}

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

            <Spacer />

            {/* RIGHT */}
            <Box w={{ base: "100%", md: "65%" }}>
                {(view === "likes" || view === null) && <UserLikesProperties userToken={user?.token}></UserLikesProperties>}
                {view === "notifications" && <Notifications></Notifications>}
            </Box>
        </Box>
    )
}

type LikesProps = {
    userToken?: string;
}

const UserLikesProperties: React.FC<LikesProps> = ({ userToken, children }) => {
    const rooms: RoomCard[] = defaultRooms;
    return (
        <Box>
            <Box as={"h1"} fontFamily={"heading"} fontWeight="bold" fontSize="4xl" mb="3">Rooms that you saved</Box>
            <SimpleGrid spacing="4" columns={[1, 2, 2, 3]}>
                {rooms.map(r => <RoomCard room={r} key={r.id} isSaved={true} />)}
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

const defaultRoom: RoomCard = {
    id: "random-id-12321",
    name: "Crystal palace",
    thumbnailUrl: "https://picsum.photos/1100/1000?random=1",
    thumbnailAlt: "rear view house with pool",
    description: "Best place in townBest place in townBest place in townBest ",
    location: "Dark side, the moon",
    totalReview: 4,
    totalStar: 23,
    formattedPrice: 2021.00,
    services: ["Pet", "Kitchen", "Breakfast", "Wifi"]
}

const defaultRooms: Array<RoomCard> = [
    { ...defaultRoom, thumbnailUrl: "https://picsum.photos/1100/1000?random=1" },
    { ...defaultRoom, thumbnailUrl: "https://picsum.photos/1100/1000?random=2" },
    { ...defaultRoom, thumbnailUrl: "https://picsum.photos/1100/1000?random=3" },
    { ...defaultRoom, thumbnailUrl: "https://picsum.photos/1100/1000?random=4" },
    { ...defaultRoom, thumbnailUrl: "https://picsum.photos/1100/1000?random=5" },
]