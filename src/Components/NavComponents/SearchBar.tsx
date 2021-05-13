import { Box, Button, Center, Flex, Input, InputGroup, InputLeftElement, InputRightElement, Popover, PopoverContent, PopoverTrigger, Portal, Spinner, useColorModeValue } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react';
import { BsSearch } from 'react-icons/bs';
import { useQuery } from 'react-query';
import { Redirect, useHistory } from 'react-router';
import { fetchCities } from '../../API';
// import 'react-day-picker/lib/style.css';
import PickRangeDay from './PickRangeDay';
import PopDetail from './PopDetail';

export type CityResponse = {
    cityName: string;
    cityId: string;
    countryName: string;
    countryId: string;
}

type SearchBarProps = {
    search: SearchQuery;
    isLoading?: boolean;
    updateSearch?: (search: SearchQuery) => void;
    onClickSearch?: () => void;
}

const defaultValue: SearchQuery = {
    guestNum: 0,
    childrenNum: 0,
}


const SearchBar = (props: SearchBarProps) => {
    const { data: cities, isLoading, status } = useQuery<unknown, unknown, CityResponse[]>("cities", fetchCities, {
        staleTime: 1000 * 60 * 10
    });
    const history = useHistory();

    const { search: form } = props;

    React.useEffect(() => {
        if (props.updateSearch) {
            console.log("update form")
            props.updateSearch(form);
        }
    }, [form])

    // if (isLoading) return <>loading...</>;

    const UpdateDate = (from?: Date, to?: Date) => {
        if (props.updateSearch) {
            props?.updateSearch({
                ...props.search,
                from: from,
                to: to
            });
        }
    }

    const UpdatePeople = (adult: number, children: number) => {
        if (props.updateSearch) {
            props?.updateSearch({
                ...props.search,
                guestNum: adult,
                childrenNum: children
            });
        }
    }

    const UpdateCity = (city: string) => {
        if (props.updateSearch) {
            props?.updateSearch({
                ...props.search,
                city: city
            });
        }
    }

    const handleSearchClick = () => {
        history.push({
            pathname: "/rooms",
            state: {
                search: props.search
            }
        })
    }

    return (
        <Box p="2" border="1px" borderColor="yellow.400" style={{ backdropFilter: "blur(5px)" }}>
            <Flex display={{ lg: "flex" }} alignItems="center">
                <InputGroup>
                    <InputLeftElement pointerEvents="none" children={<BsSearch />} />
                    <Input list="datalist-cities" placeholder="City" size="lg" borderRadius="0"
                        onChange={(e) => UpdateCity(e.target.value)}
                        value={props.search.city}
                    />
                    {isLoading ? <InputRightElement children={<Spinner alignSelf="center" />}></InputRightElement> :
                        <datalist id="datalist-cities">
                            {cities?.map(c => {
                                return <option key={c.cityId} value={c.cityName} />
                            })}
                        </datalist>
                    }
                </InputGroup>
                <Popover closeOnBlur={true}>
                    <PopoverTrigger>
                        <Button variant="outline" w={["100%", "100%", "100%", "150%"]}
                            size="lg" _focusVisible={{ border: "0" }} borderRadius="0" px="2">
                            {form?.from?.toLocaleDateString() || "From"} - {form?.to?.toLocaleDateString() || "To"}
                        </Button>
                    </PopoverTrigger>
                    <Portal>
                        <PopoverContent
                            flexWrap="nowrap" alignItems="center" style={{ backdropFilter: "blur(5px)" }}
                            w="550px" borderRadius="0"
                            bgColor={useColorModeValue("gray.100", "gray.800")}
                        >
                            <PickRangeDay updateDate={UpdateDate} />
                        </PopoverContent>
                    </Portal>
                </Popover>
                <Popover>
                    <PopoverTrigger>
                        <Button variant="outline" w={["100%", "100%", "100%", "150%"]} size="lg"
                            borderRadius="0" px="2"
                        >
                            {form.guestNum + ' guests - ' + form.childrenNum + ' children'}
                        </Button>
                    </PopoverTrigger>
                    <Portal>
                        <PopoverContent flexWrap="nowrap" borderRadius="0" bg="inherit"
                            bgColor={useColorModeValue("gray.100", "gray.800")}
                        >
                            <PopDetail updatePeople={UpdatePeople} guest={form.guestNum!} children={form.childrenNum!}></PopDetail>
                        </PopoverContent>
                    </Portal>
                </Popover>
                <Button alignSelf="center" size="lg" minW="100px" ml={[0, 0, 0, 2]}
                    onClick={props.onClickSearch ? props.onClickSearch : handleSearchClick}
                    isLoading={props.isLoading}
                    mt={[2, 2, 2, 0]} w={["100%", "100%", "100%", "30%"]} borderRadius="0">
                    Search
                </Button>
            </Flex>
        </Box>
    )
}

export default SearchBar;