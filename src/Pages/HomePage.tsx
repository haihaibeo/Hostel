import React from 'react'
import PropertyTypeList from '../Components/HomeComponents/PropertyTypeList'
import SearchBar from '../Components/NavComponents/SearchBar';
import { Box, DarkMode } from "@chakra-ui/react"
import BG from "../Images/HomeBG.webp";
import Navbar from '../Components/NavComponents/Navbar';

const px = "10%";

const HomePage = () => {
    return (
        <Box>
            <Box minH={["50vh", "75vh", "85vh"]} style={{ background: "url('" + BG + "') center/cover no-repeat" }}>
                <Box px={px} pt="5">
                    <Navbar></Navbar>
                    <SearchBar />
                    <Box as="h1" fontFamily="mono" opacity="0.5" fontWeight="bold" fontSize={["3xl", "4xl", "6xl", "8xl"]}
                        position="relative" mt={["5vh", "10vh", "20vh", "30vh"]}>EXPLORE AROUND</Box>
                </Box>
            </Box>
            <Box px={px} mt="10">
                <Box as="h2" fontWeight="bold" fontSize="4xl" mb="5">
                    LIVE ANYWHERE
                </Box>
                <PropertyTypeList></PropertyTypeList>
            </Box>
        </Box>
    )
}
export default HomePage;