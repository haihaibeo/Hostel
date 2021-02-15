import { Box, Divider } from '@chakra-ui/react';
import React from 'react'
import { useParams } from 'react-router-dom';
import RoomCardList from '../Components/FilterComponents/RoomCardList';
import Navbar from '../Components/NavComponents/Navbar';
import SearchBar from '../Components/NavComponents/SearchBar';

type RoomTypeSlugProps = {
    slug: string;
}

const RoomsPage = () => {
    const { slug } = useParams<RoomTypeSlugProps>();


    return (
        <Box mx="10%" mt="5">
            <Navbar></Navbar>
            <SearchBar></SearchBar>
            <Divider my="10" />
            <Box as="h3" mb="5" fontSize="4xl" fontWeight="bold" >Find place that fits you most...</Box>
            <RoomCardList></RoomCardList>
            {slug}
        </Box>
    )
}

export default RoomsPage;