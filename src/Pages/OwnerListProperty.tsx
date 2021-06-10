import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react'
import { useQuery } from 'react-query';
import { fetchOwnerProperty } from '../API';
import RoomCardList from '../Components/FilterComponents/RoomCardList';

const OwnerListProperty = (props: BoxProps) => {
    const { data } = useQuery("host", () => fetchOwnerProperty(), {
        onSuccess: (data) => {
            console.log(data);
        }
    })

    return (
        <Box {...props}>
            <Box as="h1" fontSize="4xl" fontWeight="bold" mb='10' my="4">Your hosted properties</Box>
            <RoomCardList rooms={data?.data} columns={{ base: 1, md: 2, lg: 3 }}></RoomCardList>
        </Box>
    )
}

export default OwnerListProperty;