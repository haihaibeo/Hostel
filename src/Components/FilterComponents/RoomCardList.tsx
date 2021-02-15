import { SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import RoomCard from './RoomCard'

const RoomCardList = () => {
    return (
        <SimpleGrid spacing="8" columns={[1, 1, 2, 2, 3]}>
            <RoomCard></RoomCard>
            <RoomCard></RoomCard>
            <RoomCard></RoomCard>
            <RoomCard></RoomCard>
            <RoomCard></RoomCard>
        </SimpleGrid>
    )
}

export default RoomCardList;