import { Box, Button, Center, Flex, Input, InputGroup, InputLeftElement, InputRightElement, Popover, PopoverContent, PopoverTrigger, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react';
import { BsSearch } from 'react-icons/bs';
import { useQuery } from 'react-query';
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
    country?: string;
    city?: string;
    from?: Date;
    to?: Date;
    guestNum?: number;
    childrenNum?: number;
}

const defaultValue: SearchBarProps = {
    guestNum: 0,
    childrenNum: 0,
}



const SearchBar = () => {
    const { data: cities, isLoading, status } = useQuery<unknown, unknown, CityResponse[]>("cities", fetchCities, {
        staleTime: 1000 * 60 * 10
    });
    // console.log(cities);
    const [form, setForm] = React.useState<SearchBarProps>(defaultValue);

    // if (isLoading) return <>loading...</>;

    const UpdateDate = (from?: Date, to?: Date) => {
        setForm(s => ({
            ...s,
            from: from,
            to: to
        }))
    }

    const UpdatePeople = (adult: number, children: number) => {
        setForm(s => ({
            ...s,
            childrenNum: children,
            guestNum: adult,
        }))
    }

    return (<div>
        <Box p="2" border="1px" borderColor="yellow.400" style={{ backdropFilter: "blur(5px)" }}>
            <Flex display={{ lg: "flex" }} alignItems="center">
                <InputGroup>
                    <InputLeftElement pointerEvents="none" children={<BsSearch />} />
                    <Input list="datalist-cities" placeholder="City" size="lg" borderRadius="0" />
                    {isLoading ? <InputRightElement children={<Spinner alignSelf="center" />}></InputRightElement> :
                        <datalist id="datalist-cities" style={{}}>
                            {cities?.map(c => {
                                return <option key={c.cityId} value={c.cityName} />
                            })}
                            {status === 'error' && <>
                                <option value="Hanoi" />
                                <option value="Moscow" />
                                <option value="Danang" />
                                <option value="Ivanovo" />
                            </>}
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
                    <PopoverContent
                        flexWrap="nowrap" alignItems="center" style={{ backdropFilter: "blur(5px)" }}
                        w="550px" borderRadius="0" bgColor="rgba(66, 153, 225, 0.5)">
                        <PickRangeDay updateDate={UpdateDate} />
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger>
                        <Button variant="outline" w={["100%", "100%", "100%", "150%"]} size="lg"
                            borderRadius="0" px="2"
                        >
                            {form.guestNum + ' guests - ' + form.childrenNum + ' children'}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent flexWrap="nowrap" borderRadius="0" bg="inherit" bgColor="rgba(66, 153, 225, 0.5)">
                        <PopDetail updatePeople={UpdatePeople} guest={form.guestNum!} children={form.childrenNum!}></PopDetail>
                    </PopoverContent>
                </Popover>
                <Button alignSelf="center" size="lg" minW="100px" ml={[0, 0, 0, 2]}
                    mt={[2, 2, 2, 0]} w={["100%", "100%", "100%", "30%"]} borderRadius="0">Search</Button>
            </Flex>
        </Box>
    </div>)
}

export default SearchBar;