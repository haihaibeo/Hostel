import { Box, Icon, HStack, VStack, Center } from '@chakra-ui/react'
import React from 'react'
import { IconType } from 'react-icons'
import { RiStarLine, RiUserStarLine } from "react-icons/ri";

type MyRoomBadgeProps = {
    id: string;
}

const MyRoomBadge: React.FC<MyRoomBadgeProps> = ({ id }) => {
    const [icon, setIcon] = React.useState<IconType>();
    const [badge, setBadge] = React.useState<RoomBadge>();

    React.useEffect(() => {
        let foundBadge = defaultRoomBadges.find(b => b.id === id);
        setBadge(foundBadge);
        switch (id) {
            case "1":
                setIcon(RiUserStarLine);
                break;

            default:
                setIcon(RiStarLine);
                break;
        }
    }, [id])

    return (
        <HStack alignContent="center" spacing="0" mb="2">
            <Icon d="flex" boxSize="10" alignItems="center" justifyContent="center" mt="2" ml="2">{icon}</Icon>
            <VStack alignItems="start" spacing="0">
                <Box as="h4" fontSize="md" fontWeight="semibold">{badge?.title}</Box>
                <Box as="h5" fontSize="sm" m="0">{badge?.description}</Box>
            </VStack>
        </HStack>
    )
}

export const defaultRoomBadges: RoomBadge[] = [
    {
        id: "1",
        title: "Helpful owner",
        description: "Owner provides best services"
    },
    {
        id: "2",
        title: "Extra clean",
        description: "Owner follows our strict policies of enhanced clealiness"
    },
    {
        id: "3",
        title: "Not smoking",
        description: "Owner does not allow smoking inside"
    },
    {
        id: "4",
        title: "Free cancelation",
        description: "You can cancel with full refund in 24 hours"
    }
]

export default MyRoomBadge;