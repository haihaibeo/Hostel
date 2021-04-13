import { Box, Divider } from '@chakra-ui/react';
import React from 'react'
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { fetchPropertyView } from '../API';
import RoomCardList from '../Components/FilterComponents/RoomCardList';
import SearchBar from '../Components/NavComponents/SearchBar';



const RoomsPage = () => {
    const queryStr = new URLSearchParams(useLocation().search);
    const queryTypeId = queryStr.get("typeId");

    const { data, isLoading, error } = useQuery("propertyView", () => fetchPropertyView(queryTypeId), { staleTime: 1000 * 60 })

    if (error) {
        return <>Error</>
    }

    if (isLoading) return <>Loading...</>

    return (
        <Box>
            <SearchBar></SearchBar>
            <Divider my="10" />
            <Box as="h3" mb="5" fontSize="4xl" fontWeight="bold" >Find place that fits you most...</Box>
            <RoomCardList rooms={data?.data}></RoomCardList>
        </Box>
    )
}

export default RoomsPage;