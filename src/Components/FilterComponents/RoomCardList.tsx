import { SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import RoomCard from './RoomCard'

const RoomCardList = () => {
    return (
        <SimpleGrid spacing="8" columns={[1, 1, 2, 2, 3]}>
            {rooms.map((r, index) => {
                return (
                    <RoomCard key={index} room={r}></RoomCard>
                )
            })}
        </SimpleGrid>
    )
}

const defaultRoom: RoomCardType = {
    id: "random-id-12321",
    name: "Crystal palace",
    thumbnailUrl: "https://picsum.photos/1100/1000?random=1",
    thumbnailAlt: "rear view house with pool",
    description: "Best place in town",
    location: "Dark side, the moon",
    rating: 4.5,
    rateCounter: 23,
    formattedPrice: "2021.00$",
    services: ["Pet", "Kitchen", "Breakfast", "Wifi"]
}

const rooms: Array<RoomCardType> = [
    { ...defaultRoom, thumbnailUrl: "https://picsum.photos/1100/1000?random=1" },
    { ...defaultRoom, thumbnailUrl: "https://picsum.photos/1100/1000?random=2" },
    { ...defaultRoom, thumbnailUrl: "https://picsum.photos/1100/1000?random=3" },
    { ...defaultRoom, thumbnailUrl: "https://picsum.photos/1100/1000?random=4" },
    { ...defaultRoom, thumbnailUrl: "https://picsum.photos/1100/1000?random=5" },
]

export default RoomCardList;