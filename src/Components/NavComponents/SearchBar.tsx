import { Box, Button, Center, Flex, Input, InputGroup, InputLeftElement, InputRightElement, Popover, PopoverContent, PopoverTrigger, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react';
import { BsSearch } from 'react-icons/bs';
import { useQuery } from 'react-query';
// import 'react-day-picker/lib/style.css';
import PickRangeDay from './PickRangeDay';
import PopDetail from './PopDetail';

type CityResponse = {
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
    adultNum?: number;
    childrenNum?: number;
    bedRoom?: number;
}

const defaultValue: SearchBarProps = {
    adultNum: 1,
    childrenNum: 0,
    bedRoom: 1
}

const URL = "http://localhost:44343";

const fetchCities = async () => {
    // const res = await axios({
    //     method: "GET",
    //     url: URL + "api/city",
    //     timeout: 5000
    // });
    // return res;
    const res = await fetch(URL + "/api/cities");
    const data = res.json();
    return data;
}

const SearchBar = () => {
    const { data: cities, isLoading, status } = useQuery<unknown, unknown, CityResponse[]>("cities", fetchCities);
    // console.log(cities);
    const [form, setForm] = React.useState<SearchBarProps>(defaultValue);
    const cityRef = React.useRef<HTMLInputElement>(null);

    // if (isLoading) return <>loading...</>;

    const UpdateDate = (from?: Date, to?: Date) => {
        setForm(s => ({
            ...s,
            from: from,
            to: to
        }))
    }

    const UpdatePeople = (adult: number, children: number, room: number) => {
        setForm(s => ({
            ...s,
            childrenNum: children,
            adultNum: adult,
            bedRoom: room
        }))
        console.log(adult, children, room);
    }

    return (<div>
        <Box p="2" border="1px" borderColor="yellow.400" style={{ backdropFilter: "blur(5px)" }}>
            <Flex display={{ lg: "flex" }} alignItems="center">
                <InputGroup>
                    <InputLeftElement pointerEvents="none" children={<BsSearch />} />
                    <Input list="datalist-cities" placeholder="Country" size="lg" borderRadius="0" ref={cityRef} />
                    {isLoading ? <InputRightElement children={<Spinner alignSelf="center" />}></InputRightElement> :
                        <datalist id="datalist-cities" style={{}}>
                            <Box>
                                {cities?.map(c => {
                                    return <option key={c.cityId} value={c.cityName} />
                                })}
                                {status === 'error' && <>
                                    <option value="Hanoi" />
                                    <option value="Moscow" />
                                    <option value="Danang" />
                                    <option value="Ivanovo" />
                                </>}
                            </Box>
                        </datalist>
                    }
                </InputGroup>
                <Popover closeOnBlur={true}>
                    <PopoverTrigger>
                        <Button variant="outline" w={["100%", "100%", "100%", "150%"]} size="lg" _focusVisible={{ border: "0" }} borderRadius="0" px="2">{form?.from?.toDateString() || "From"} - {form?.to?.toDateString() || "To"}</Button>
                    </PopoverTrigger>
                    <PopoverContent flexWrap="nowrap" alignItems="center" w={["100%", "100%", "200%", "200%"]} left={["0%", "0%", "-50%", "-50%"]} borderRadius="0" bgColor="rgba(66, 153, 225, 0.5)">
                        <PickRangeDay updateDate={UpdateDate} />
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger>
                        <Button variant="outline" w={["100%", "100%", "100%", "150%"]} size="lg" borderRadius="0" px="2">{form.adultNum + ' adult(s) - ' + form.childrenNum + ' child(s) - ' + form.bedRoom + ' room(s)'}</Button>
                    </PopoverTrigger>
                    <PopoverContent flexWrap="nowrap" borderRadius="0" bg="inherit" bgColor="rgba(66, 153, 225, 0.8)">
                        <PopDetail updatePeople={UpdatePeople} adult={form.adultNum!} bedRoom={form.bedRoom!} children={form.childrenNum!}></PopDetail>
                    </PopoverContent>
                </Popover>
                <Button alignSelf="center" size="lg" minW="100px" ml={[0, 0, 0, 2]}
                    mt={[2, 2, 2, 0]} w={["100%", "100%", "100%", "30%"]} borderRadius="0">Search</Button>
            </Flex>
        </Box>
    </div>)
}

export default SearchBar;