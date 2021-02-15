import { Box, Flex, Grid, Wrap, WrapItem } from '@chakra-ui/react'
import React from 'react'
import RoomCard from './RoomCard'

const RoomCardList = () => {
    return (
        <Wrap spacing="4">
            <WrapItem>
                <RoomCard></RoomCard>
            </WrapItem>
            <WrapItem>
                <RoomCard></RoomCard>
            </WrapItem>
            <WrapItem>
                <RoomCard></RoomCard>
            </WrapItem>
            <WrapItem>
                <RoomCard></RoomCard>
            </WrapItem>
        </Wrap>
    )
}

export default RoomCardList;