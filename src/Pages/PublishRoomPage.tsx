import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, BoxProps, Divider, SimpleGrid, VStack, Link, Flex, Spacer } from '@chakra-ui/layout';
import { Button, chakra, IconButton, NumberInput, NumberInputField, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Switch, useToast } from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import { Textarea } from '@chakra-ui/textarea';
import React, { FC } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useMutation, useQuery } from 'react-query';
import { Link as RouterLink, SwitchProps } from 'react-router-dom';
import { deleteImage, fetchCities, fetchPropertyTypes, postImage, postRoom } from '../API';
import { CityResponse } from '../Components/NavComponents/SearchBar';


type Country = {
    id: string;
    countryName: string;
}

const getUniqeCountries = (res: CityResponse[]) => {
    let countries: Country[] = [];
    let indexes = new Set<string>();
    for (let i of res) {
        if (!indexes.has(i.countryId)) {
            countries.push({ id: i.countryId, countryName: i.countryName });
        }
        indexes.add(i.countryId);
    }
    console.log(countries);
    return countries;
}

const PublishRoomPage: FC<BoxProps> = ({ ...props }) => {
    const toast = useToast();
    const [countries, setCountries] = React.useState<Country[]>();

    const [room, setRoom] = React.useState<PublishRoomState>({
        cityId: "1",
        countryId: "",
        description: "Test description",
        images: [
            {
                url: "url",
                alt: "alt",
                deleteHash: "delHash"
            }
        ],
        maxGuest: 0,
        propTypeId: "",
        introdution: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto minus ad assumenda dignissimos. Perferendis optio est nam accusamus aliquid voluptas?",
        name: "Lorem ipsum",
        refundPercent: 100,
        number: "12",
        streetName: "Street asdfgg",
        services: {
            breakfast: true,
            kitchen: false,
            parking: true,
            pet: false,
            wifi: true
        },
        pricing: {
            basePrice: 250,
            cleaningFee: 10,
            serviceFee: 0
        }
    });

    const { data: resCities, isLoading, status } = useQuery<unknown, unknown, CityResponse[]>("cities", fetchCities, {
        staleTime: 1000 * 60 * 10,
        onSuccess: (res) => {
            setCountries(getUniqeCountries(res));
        }
    });

    const { data: resTypes, isError } = useQuery<unknown, unknown, PropertyTypeType[]>("propertypeList", fetchPropertyTypes, {
        staleTime: 1000 * 60 * 10
    });

    const publish = useMutation(postRoom, {
        onSuccess: (res) => {
            toast({ description: res.data, status: "success" })
        },
        onError: (err) => {
            console.log(err);
            toast({ description: "Something's wrong", status: "error" })
        },
    })

    const handlePublish = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        publish.mutate(room);
    }

    React.useEffect(() => {
        return function cleanup() { localStorage.removeItem("previewRoom"); }
    }, [])

    const handleImagesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
            const files = Array.from(e.target.files);
            const formData = new FormData();

            formData.append("image", files[0]);
            postImage(formData).then((msg) => msg.data).catch(e => console.log(e));
            deleteImage("").then(msg => console.log(msg.data));
        }
    }

    return (
        <chakra.form>
            <Box d='flex' flexDir="column" mt="10" {...props}>
                <VStack spacing="8" w="75%" alignSelf="center">
                    <Box as="h1" fontSize="3xl" fontWeight="bold" alignSelf="start">Publish your new property</Box>
                    <Divider borderColor="currentcolor" />

                    {/* Property info */}
                    <Box d={{ base: "inline-block", lg: "flex" }} flexDir="row" w="100%" fontWeight="medium">
                        <Box as="h2" fontSize="lg" w={{ base: "100%", lg: "30%" }} mb="5">Property info</Box>

                        <VStack alignItems="start" w="100%">
                            <FormControl isRequired id="prop-name">
                                <FormLabel as="h2" fontSize="md">Property Name</FormLabel>
                                <Input variant="filled" required
                                    value={room.name}
                                    onChange={(e) => { setRoom((r) => ({ ...r, name: e.target.value })) }}
                                />
                            </FormControl>
                            <FormControl isRequired id="prop-type">
                                <FormLabel as="h2" fontSize="md">Property's Type</FormLabel>
                                <Select variant="filled" placeholder="--Choose your property type--"
                                    onChange={(e) => setRoom((r) => ({ ...r, propTypeId: e.target.value, cityId: "" }))}
                                >
                                    {resTypes?.map(rt => {
                                        return <option value={rt.id} key={rt.id}>{rt.propertyType}</option>
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl isRequired id="prop-description">
                                <FormLabel as="h2" fontSize="md">Description</FormLabel>
                                <Input variant="filled" required
                                    value={room.description}
                                    onChange={(e) => setRoom((r) => ({ ...r, description: e.target.value }))}
                                />
                            </FormControl>
                            <FormControl isRequired id="prop-introduction">
                                <FormLabel as="h2" fontSize="md">Introduction</FormLabel>
                                <Textarea rows={4} required variant="filled"
                                    value={room.introdution}
                                    onChange={(e) => setRoom((r) => ({ ...r, introdution: e.target.value }))}
                                />
                            </FormControl>
                        </VStack>
                    </Box>
                    <Divider borderColor="currentcolor" />

                    {/* Location info */}
                    <Box d={{ base: "inline-block", lg: "flex" }} flexDir="row" w="100%" fontWeight="medium">
                        <Box as="h2" fontSize="lg" w={{ base: "100%", lg: "30%" }} mb="5">Location info</Box>
                        <VStack alignItems="start" w="100%">
                            <FormControl isRequired id="prop-country">
                                <FormLabel as="h2" fontSize="md">Country</FormLabel>
                                <Select variant="filled" placeholder="--Choose your country--"
                                    onChange={(e) => setRoom((r) => ({ ...r, countryId: e.target.value, cityId: "" }))}
                                >
                                    {countries?.map(c => {
                                        return <option value={c.id} key={c.countryName}>{c.countryName}</option>
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl isRequired id="prop-city">
                                <FormLabel as="h2" fontSize="md">City</FormLabel>
                                <Select variant="filled" placeholder="--Choose your city--"
                                    onChange={(e) => {
                                        setRoom((r) => ({ ...r, cityId: e.target.value }))
                                    }}
                                >
                                    {resCities?.filter(ct => ct.countryId === room.countryId).map(c => {
                                        return <option value={c.cityId} key={c.cityId}>{c.cityName}</option>
                                    })}
                                </Select>
                            </FormControl>
                            <Flex gridGap="2" w="100%" flexDir={{ base: 'column', lg: "row" }}>
                                <FormControl isRequired id="prop-street" flex="0 1 60%">
                                    <FormLabel as="h2" fontSize="md">Street Name</FormLabel>
                                    <Input required variant="filled" value={room.streetName}
                                        onChange={(e) => { setRoom((r) => ({ ...r, streetName: e.target.value })) }}
                                    />
                                </FormControl>
                                <FormControl isRequired id="prop-number" flex="0 1 40%">
                                    <FormLabel as="h2" fontSize="md">Property's number</FormLabel>
                                    <Input required variant="filled" value={room.number}
                                        onChange={(e) => { setRoom((r) => ({ ...r, number: e.target.value })) }}
                                    />
                                </FormControl>
                            </Flex>
                            <FormControl id="prop-add-note">
                                <FormLabel as="h2" fontSize="md">Notes to client<Box as="span" fontStyle="oblique" fontWeight="light">(optional)</Box></FormLabel>
                                <Input variant="filled" value={room.addressDesc}
                                    onChange={(e) => { setRoom((r) => ({ ...r, addressDesc: e.target.value })) }}
                                />
                            </FormControl>
                        </VStack>
                    </Box>
                    <Divider borderColor="currentcolor" />

                    {/* Images */}
                    <Box d={{ base: "inline-block", lg: "flex" }} flexDir="row" w="100%" fontWeight="medium" justifyContent="space-between">
                        <Box as="h2" fontSize="lg" w={{ base: "100%", lg: "30%" }} mb="5" flexWrap="wrap">
                            <Box>Images</Box>
                            <Box as="span" fontStyle="oblique" fontWeight="light">{" (At least 5 images)"}</Box>
                        </Box>
                        <Input required variant="ghost" type="file" justifySelf="flex-end" multiple accept="image/*" onChange={(e) => handleImagesInput(e)} />
                    </Box>
                    <Divider borderColor="currentcolor" />

                    {/* Services */}
                    <Box d={{ base: "inline-block", lg: "flex" }} flexDir="row" w="100%" fontWeight="medium">
                        <Box as="h2" fontSize="lg" w={{ base: "100%", lg: "30%" }} mb="5">Services</Box>
                        <Box w="100%" >
                            <SimpleGrid minChildWidth="12em" spacingX="5rem" spacingY="2">
                                <Flex gridGap="2" alignItems="center">
                                    <Box as="h2" fontSize="md">
                                        Max Guests
                                </Box>
                                    <Spacer />
                                    <IconButton aria-label="Minus" size="sm" icon={<FaMinus />}
                                        isDisabled={room.maxGuest <= 0}
                                        onClick={() => setRoom((r) => ({ ...r, maxGuest: r.maxGuest-- }))}
                                    />
                                    <Box as="h3" fontSize="md" w="3ch" textAlign="center">
                                        {room.maxGuest}
                                    </Box>
                                    <IconButton aria-label="Plus" size="sm" icon={<FaPlus />}
                                        isDisabled={room.maxGuest >= 10}
                                        onClick={() => setRoom((r) => ({ ...r, maxGuest: r.maxGuest++ }))}
                                    />
                                </Flex>
                                <ServiceDisplay name="Wifi"
                                    isOn={room.services.wifi}
                                    toggle={(checked) => { setRoom((r) => ({ ...r, services: ({ ...r.services, wifi: checked }) })) }}
                                />
                                <ServiceDisplay name="Kitchen"
                                    isOn={room.services.kitchen}
                                    toggle={(checked) => { setRoom((r) => ({ ...r, services: ({ ...r.services, kitchen: checked }) })) }}
                                />
                                <ServiceDisplay name="Breakfast"
                                    isOn={room.services.breakfast}
                                    toggle={(checked) => { setRoom((r) => ({ ...r, services: ({ ...r.services, breakfast: checked }) })) }}
                                />
                                <ServiceDisplay name="Pet Allow"
                                    isOn={room.services.pet}
                                    toggle={(checked) => { setRoom((r) => ({ ...r, services: ({ ...r.services, pet: checked }) })) }}
                                />
                                <ServiceDisplay name="Free Parking"
                                    isOn={room.services.parking}
                                    toggle={(checked) => { setRoom((r) => ({ ...r, services: ({ ...r.services, parking: checked }) })) }}
                                />
                            </SimpleGrid>
                        </Box>
                    </Box>
                    <Divider borderColor="currentcolor" />

                    {/* Pricing */}
                    <Box d={{ base: "inline-block", lg: "flex" }} flexDir="row" w="100%" fontWeight="medium">
                        <Box as="h2" fontSize="lg" w={{ base: "100%", lg: "30%" }} mb="5">Pricing ($)</Box>
                        <VStack alignItems="start" w="100%">
                            <ServiceDisplay isOn={room.refundPercent === 100 ? true : false}
                                name="Allow full refund" size="lg"
                                toggle={(checked) => { setRoom((r) => ({ ...r, refundPercent: checked ? 100 : 80 })) }}
                            />
                            {room.refundPercent !== 100 &&
                                <Box>
                                    Amount refund: {room.refundPercent}%
                                </Box>
                            }
                            <Slider value={room.refundPercent} min={0} max={100} step={5} colorScheme="blue"
                                onChangeEnd={(percent) => { setRoom((r) => ({ ...r, refundPercent: percent })) }}>
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb boxSize={6} />
                            </Slider>
                            <FormControl isRequired id="prop-price-base" isInvalid={room.pricing.basePrice === 0 ? true : false}>
                                <FormLabel opacity={room.pricing.basePrice === 0 ? 0.4 : 1} as="h2" fontSize="md">Base price</FormLabel>
                                <NumberInput value={room.pricing.basePrice}
                                    onChange={(price) => { setRoom((r) => ({ ...r, pricing: { ...r.pricing, basePrice: parseInt(price) | 0 } })) }}
                                >
                                    <NumberInputField variant="filled" required />
                                </NumberInput>
                            </FormControl>
                            <FormControl isRequired id="prop-price-cleaning">
                                <FormLabel opacity={room.pricing.cleaningFee === 0 ? 0.4 : 1} as="h2" fontSize="md">Cleaning fee</FormLabel>
                                <NumberInput value={room.pricing.cleaningFee}
                                    onChange={(price) => { setRoom((r) => ({ ...r, pricing: { ...r.pricing, cleaningFee: parseInt(price) | 0 } })) }}
                                >
                                    <NumberInputField variant="filled" required />
                                </NumberInput>
                            </FormControl>
                            <FormControl isRequired id="prop-price-service">
                                <FormLabel opacity={room.pricing.serviceFee === 0 ? 0.4 : 1} as="h2" fontSize="md">Service fee</FormLabel>
                                <NumberInput value={room.pricing.serviceFee}
                                    onChange={(price) => { setRoom((r) => ({ ...r, pricing: { ...r.pricing, serviceFee: parseInt(price) | 0 } })) }}
                                >
                                    <NumberInputField variant="filled" required />
                                </NumberInput>
                            </FormControl>
                        </VStack>
                    </Box>

                    <Box>
                        <Link as={RouterLink} to="/room/preview" _hover={{ textStyle: "none" }} target="_blank" onClick={() => localStorage.setItem("previewRoom", JSON.stringify(room))}>
                            <Button variant="solid" mr="10" colorScheme="green">
                                See a preview
                            </Button>
                        </Link>

                        <Button variant="solid" type="submit" colorScheme="blue" onClick={(e) => handlePublish(e)}>
                            Confirm
                        </Button>
                    </Box>
                </VStack>
            </Box>
        </chakra.form>
    );
}

interface ServiceDisplayProps {
    name: string;
    id?: string;
    isOn: boolean;
    toggle: (checked: boolean) => void;
}

const ServiceDisplay: React.FC<ServiceDisplayProps & SwitchProps> = (props) =>
    <FormControl display="flex" alignItems="center" justifyContent="space-between" pr="2">
        <FormLabel htmlFor={"service_" + props.name} mb="0" opacity={props.isOn ? 1 : 0.4}>
            {props.name}
        </FormLabel>
        <Switch id={"service_" + props.name} isChecked={props.isOn}
            {...props}
            onChange={(e) => { props.toggle(e.target.checked) }} />
    </FormControl>

export default PublishRoomPage;