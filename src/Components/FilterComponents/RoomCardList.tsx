import { SimpleGrid, Box } from '@chakra-ui/react'
import React from 'react'
import RoomCard from './RoomCard'

type RoomCardListProps = {
    rooms?: RoomCard[];
}

const RoomCardList: React.FC<RoomCardListProps> = ({ rooms }) => {
    // rooms = defaultRooms;
    if (!rooms || rooms.length === 0) return <Box>
        Not found any room
    </Box>

    return (
        <SimpleGrid spacing="8" columns={[1, 1, 1, 2, 3]} >
            {rooms && rooms.map((r, index) => {
                return (
                    <RoomCard key={r.id} room={r} isSaved={false}></RoomCard>
                )
            })}
        </SimpleGrid>
    )
}

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
const str = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus non laboriosam blanditiis ipsa voluptas assumenda earum fugiat vel nemo rem totam modi officiis corporis accusamus consectetur, soluta optio, quas maiores!"
export default RoomCardList;