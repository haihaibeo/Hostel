import { Box, Divider } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react'
import { useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router-dom';
import { API_URL } from '../App';
import RoomCardList from '../Components/FilterComponents/RoomCardList';
import Navbar from '../Components/NavComponents/Navbar';
import SearchBar from '../Components/NavComponents/SearchBar';

const fetchPropertyView = (typeId: string | null) => {
    let URI = `/api/properties`;
    if (typeId) {
        URI += `?typeId=${typeId}`;
    }
    return axios.get(API_URL + URI);
}

const RoomsPage = () => {
    const queryStr = new URLSearchParams(useLocation().search);
    const queryTypeId = queryStr.get("typeId");

    const { data, isLoading, error } = useQuery("propertyView", () => fetchPropertyView(queryTypeId))

    console.log(data?.data);
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