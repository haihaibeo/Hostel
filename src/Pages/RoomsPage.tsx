import { Box, CircularProgress, Divider, HStack, InputLeftAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Portal, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spinner, Tag, TagCloseButton, TagLabel, TagProps, useColorModeValue } from '@chakra-ui/react';
import React from 'react'
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { fetchPropertiesView } from '../API';
import RoomCardList from '../Components/FilterComponents/RoomCardList';
import SearchBar from '../Components/NavComponents/SearchBar';
import { MdGraphicEq } from "react-icons/md";

type RoomsPageLocationState = {
    type?: PropertyTypeType;
    search?: SearchQuery;
}


const RoomsPage = () => {
    const queryStr = new URLSearchParams(useLocation().search);
    const searchBoxColor = useColorModeValue("gray.100", "gray.900");

    const location = useLocation<RoomsPageLocationState>();

    const [search, setSearch] = React.useState<SearchQuery>({ childrenNum: 0, guestNum: 0 });
    const [type, setType] = React.useState<PropertyTypeType>();

    const updateSearch = (search: SearchQuery) => {
        setSearch(search);
    }

    React.useEffect(() => {
        if (location.state !== undefined && location.state.search) {
            setSearch(location.state.search)
        }
        if (location.state !== undefined && location.state.type) {
            setType(location.state.type);
        }
    }, [])

    let queryKeys = [type?.id, search];

    const { data, isLoading, error, refetch, remove } = useQuery(["propertyView", queryKeys], () => fetchPropertiesView(type?.id, search),
        {
            staleTime: 1000 * 60
        });

    if (error) {
        return <>Error</>
    }

    return (
        <Box d="flex" flexDir="column" gridGap="5">
            <Box position={{ lg: "sticky" }} top={0}
                bgColor={searchBoxColor} d="flex" flexDir="column"
                boxShadow="2xl"
                gridGap="5" pb="5"
            >
                <SearchBar search={search}
                    updateSearch={updateSearch}
                    isLoading={isLoading}
                    onClickSearch={() => { remove(); refetch(); }}
                />
                <HStack>
                    {/* type tag */}
                    {type && <QueryTag label={"Property type: " + type.propertyType}
                        onClose={() => { setType(undefined) }}
                    />}

                    {/* city tag */}
                    {search.city && <QueryTag label={search.city}
                        onClose={() => { setSearch(s => ({ ...s, city: "" })) }}
                    />}

                    {/* from date tag */}
                    {search.from && <QueryTag label={"From: " + search.from.toLocaleDateString()}
                        onClose={() => { setSearch(s => ({ ...s, from: undefined })) }}
                    />}

                    {/* to date tag */}
                    {search.to && <QueryTag label={"To: " + search.to.toLocaleDateString()}
                        onClose={() => { setSearch(s => ({ ...s, to: undefined })) }}
                    />}

                    {/* guest num tag */}
                    {search.guestNum > 0 && <QueryTag label={search.guestNum + " guests"}
                        onClose={() => { setSearch(s => ({ ...s, guestNum: 0 })) }}
                    />}

                    {/* children num tag */}
                    {search.childrenNum > 0 && <QueryTag label={search.childrenNum + " children"}
                        onClose={() => { setSearch(s => ({ ...s, childrenNum: 0 })) }}
                    />}
                </HStack>
            </Box>
            <Box as="h3" mb="5" fontSize="4xl" fontWeight="bold" >Find place that fits you most...</Box>
            {isLoading ?
                <Spinner color="green" size="lg" alignSelf="center" />
                :
                <RoomCardList rooms={data?.data}></RoomCardList>
            }
        </Box>
    )
}

type QueryTagProps = {
    label: string;
    onClose: () => void;
}
const QueryTag = (props: QueryTagProps & TagProps) => {
    const { label, onClose, ...tagProps } = props;

    return (
        <Tag size="lg" colorScheme="green" {...tagProps}>
            <TagLabel>
                {props.label}
            </TagLabel>
            <TagCloseButton onClick={() => props.onClose()} />
        </Tag>
    );
}

export default RoomsPage;