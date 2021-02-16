import { Box, Button, Divider, Spacer } from '@chakra-ui/react';
import React from 'react'
import { BsStarFill, BsStar, BsHeart } from 'react-icons/bs';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../Components/NavComponents/Navbar';

type SlugProps = {
    slug: string;
}

interface RoomType extends RoomCardType {
    images?: string[];
}

type SingleRoomProps = {
    room: RoomType;
}

const GetRoomById = (id: string) => {
}

const SingleRoom: React.FC = () => {
    const { slug } = useParams<SlugProps>();
    const room = defaultRoom;

    return (
        <Box mx="10%" mt="5">
            <Navbar></Navbar>
            <Divider my="10" />

            {/* title */}
            <Box as="h2" fontSize="3xl" fontWeight="semibold">{room.name}</Box>

            {/* rating, location, like button */}
            <Box d="flex" mt="1">
                <Box d="flex" alignItems="center">
                    {Array(5).fill("").map((_, i) => {
                        return (i < room.rating - 1 ? <BsStarFill colorRendering="teal.400" /> : <BsStar />)
                    })}

                    <Box as="span" ml="2" color="gray.500">{room.rating} reviews</Box>

                    <Box mx="4">&bull;</Box>

                    <Link to="/">
                        <Button variant="link">{room.location}</Button>
                    </Link>
                </Box>

                <Spacer />

                <Button variant="ghost" size="sm" leftIcon={<BsHeart />}>Like</Button>
            </Box>
        </Box>
    )
}

const defaultRoom: RoomType = {
    id: "random-id-12321",
    name: "Crystal palace",
    thumbnailUrl: "https://bit.ly/2Z4KKcF",
    images: ["https://bit.ly/2Z4KKcF", "https://bit.ly/2Z4KKcF",
        "https://bit.ly/2Z4KKcF", "https://bit.ly/2Z4KKcF",
        "https://bit.ly/2Z4KKcF"],
    thumbnailAlt: "rear view house with pool",
    description: "Best place in town",
    location: "Dark side, the moon",
    rating: 4.5,
    rateCounter: 23,
    formattedPrice: "2021.00$",
    services: ["Pet", "Kitchen", "Breakfast", "Wifi"]
}

export default SingleRoom;