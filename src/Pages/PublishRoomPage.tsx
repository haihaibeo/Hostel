import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, BoxProps, Divider, SimpleGrid, VStack, Link, Flex, Spacer, Center } from '@chakra-ui/layout';
import { Button, chakra, CloseButton, IconButton, Image, NumberInput, NumberInputField, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spinner, Switch, useToast } from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import { Textarea } from '@chakra-ui/textarea';
import React, { FC } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useMutation, useQuery } from 'react-query';
import { Link as RouterLink, Redirect, RouteProps, SwitchProps, useLocation, useParams } from 'react-router-dom';
import { deleteImage, fetchCities, fetchPropertyById, fetchPropertyTypes, fetchServices, postImage, postRoom, useQueryParam } from '../API';
import { CityResponse } from '../Components/NavComponents/SearchBar';


type Country = {
    id: string;
    countryName: string;
}

type QueryParams = {
    isEditting?: boolean;
    propId?: string;
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
    return countries;
}

const PublishRoomPage: FC<BoxProps> = (props) => {
    const toast = useToast();
    const [queryParams, setQueryParams] = React.useState<QueryParams>({ isEditting: false });

    const { data: resCities, isLoading, status } = useQuery<unknown, unknown, CityResponse[]>("cities", fetchCities, {
        staleTime: 1000 * 60 * 10,
        onSuccess: (res) => {
            console.log(res);
            let ctr = getUniqeCountries(res)
            setCountries(ctr);
        }
    });
    const { data: resTypes, isError } = useQuery<unknown, unknown, PropertyTypeType[]>("propertypeList", fetchPropertyTypes, {
        staleTime: 1000 * 60 * 10,
        onSuccess: () => { console.log("got types") }
    });
    const serviceQuery = useQuery("services", fetchServices, {
        onSuccess: (rs) => {
            console.log(rs.data);
        },
        onError: (e) => console.log(e),
    });

    const editingProp = useQuery(["property", queryParams.propId], () => {
        if (queryParams.propId) return fetchPropertyById(queryParams.propId)
    }, {
        onSuccess: (rs) => {
            console.log(rs?.data);
            if (rs?.data) {
                const editing = rs.data;
                setRoom(r => ({
                    ...r,
                    name: editing.name,
                    basePrice: editing.formattedPrice,
                    cleaningFee: editing.cleaningFee,
                    description: editing.description,
                    introdution: editing.introduction,
                    serviceFee: editing.serviceFee,
                    maxGuest: editing.maxGuest,
                    images: editing.images,
                }));
            }
        },
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false
    })

    const [countries, setCountries] = React.useState<Country[] | undefined>(resCities && getUniqeCountries(resCities));

    const query = useQueryParam();
    let location = useLocation();

    // check editting property if location changes
    React.useEffect(() => {
        const id = query.get("id")?.toLocaleLowerCase();
        if (id) {
            console.log(id);
            setQueryParams({ propId: id, isEditting: true });
        }
        return function cleanup() {
            setQueryParams({ propId: undefined, isEditting: false });
        }
    }, [location])

    const [room, setRoom] = React.useState<PublishRoomState>({
        cityId: "1",
        countryId: "",
        description: "Test description",
        images: [
            {
                url: "https://picsum.photos/1100/1000?random=1",
                alt: "alt",
                deleteHash: "delHash"
            },
            {
                url: "https://picsum.photos/1100/1000?random=2",
                alt: "alt",
                deleteHash: "delHash"
            },
            {
                url: "https://picsum.photos/1100/1000?random=3",
                alt: "alt",
                deleteHash: "delHash"
            },
            {
                url: "https://picsum.photos/1100/1000?random=10",
                alt: "alt",
                deleteHash: "delHash"
            },
            {
                url: "https://picsum.photos/1100/1000?random=15",
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
        serviceIdList: ["1", "2"],
        basePrice: 250,
        cleaningFee: 10,
        serviceFee: 0
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
        if (queryParams.isEditting) {

        }
        else {
            publish.mutate(room);
        }
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

    const handleDeleteImage = (image: Image) => {
        const imgs = room.images;
        imgs.find((value, index) => {
            if (value === image) delete imgs[index];
        });
        setRoom(r => ({ ...r, images: imgs }));
    }

    if (editingProp.isLoading) {
        return (<Spinner />)
    }

    if (editingProp.isError) {
        return <Redirect to="/error" />
    }

    return (
        <chakra.form>
            <Box d='flex' flexDir="column" mt="10" {...props}>
                <VStack spacing="8" w="75%" alignSelf="center">
                    <Box as="h1" fontSize="3xl" fontWeight="bold" alignSelf="start">{queryParams.propId ? "Edit your property" : "Publish your new property"}</Box>
                    <Divider borderColor="currentcolor" />

                    {/* Property info */}
                    <Box d={{ base: "inline-block", lg: "flex" }} flexDir="row" w="100%" fontWeight="medium">
                        <Box as="h2" fontSize="lg" w={{ base: "100%", lg: "30%" }} mb="5">Property info</Box>

                        <VStack alignItems="start" w="100%">
                            <FormControl isRequired id="prop-name">
                                <FormLabel as="h2" fontSize="md">Property Name</FormLabel>
                                <Input variant="filled" required
                                    value={room.name}
                                    onChange={(e) =>
                                        setRoom(r => ({
                                            ...r,
                                            name: e.target.value
                                        }))
                                    }
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
                                        return <option value={c.id} key={c.id}>{c.cityName}</option>
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
                            Images
                            <Box as="span" fontStyle="oblique" fontWeight="light">{" (At least 5 images)"}</Box>
                        </Box>
                        <VStack alignItems="start" w="100%">
                            <Input required variant="ghost" type="file" justifySelf="flex-end" multiple accept="image/*" onChange={(e) => handleImagesInput(e)} />
                            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gridGap="2">
                                {room.images.map((i, index) =>
                                    <Box key={index} position="relative" transition="all ease 0.5s">
                                        <Image src={i.url}
                                            display="block"
                                            _hover={{ opacity: "0.5" }}
                                            style={{ backfaceVisibility: "hidden" }} />
                                        <Center opacity="0"
                                            w="100%"
                                            h="100%"
                                            position="absolute"
                                            top="50%" left="50%"
                                            transform="translate(-50%, -50%)"
                                            transition="all ease 0.5s"
                                            _hover={{ opacity: "1" }}>
                                            <CloseButton size="lg" colorScheme="red" color="red" onClick={() => { handleDeleteImage(i) }} />
                                        </Center>
                                    </Box>
                                )}
                            </SimpleGrid>
                        </VStack>
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
                                {
                                    serviceQuery.data?.data.map(d =>
                                        <ServiceDisplay name={d.serviceName} key={d.serviceId}
                                            isOn={room.serviceIdList.includes(d.serviceId)}
                                            toggle={() => {
                                                if (room.serviceIdList.includes(d.serviceId)) {
                                                    const newIdList = room.serviceIdList.filter(s => s != d.serviceId)
                                                    setRoom(r => ({ ...r, serviceIdList: newIdList }));
                                                }
                                                else {
                                                    setRoom(r => ({ ...r, serviceIdList: [...r.serviceIdList, d.serviceId] }));
                                                }
                                            }}
                                        />
                                    )
                                }
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
                                onChange={(percent) => { setRoom((r) => ({ ...r, refundPercent: percent })) }}>
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb boxSize={6} />
                            </Slider>
                            <FormControl isRequired id="prop-price-base" isInvalid={room.basePrice === 0 ? true : false}>
                                <FormLabel opacity={room.basePrice === 0 ? 0.4 : 1} as="h2" fontSize="md">Base price</FormLabel>
                                <NumberInput value={room.basePrice}
                                    onChange={(price) => { setRoom((r) => ({ ...r, basePrice: parseInt(price) | 0 })) }}
                                >
                                    <NumberInputField variant="filled" required />
                                </NumberInput>
                            </FormControl>
                            <FormControl isRequired id="prop-price-cleaning">
                                <FormLabel opacity={room.cleaningFee === 0 ? 0.4 : 1} as="h2" fontSize="md">Cleaning fee</FormLabel>
                                <NumberInput value={room.cleaningFee}
                                    onChange={(price) => { setRoom((r) => ({ ...r, cleaningFee: parseInt(price) | 0 })) }}
                                >
                                    <NumberInputField variant="filled" required />
                                </NumberInput>
                            </FormControl>
                            <FormControl isRequired id="prop-price-service">
                                <FormLabel opacity={room.serviceFee === 0 ? 0.4 : 1} as="h2" fontSize="md">Service fee</FormLabel>
                                <NumberInput value={room.serviceFee}
                                    onChange={(price) => { setRoom((r) => ({ ...r, serviceFee: parseInt(price) | 0 })) }}
                                >
                                    <NumberInputField variant="filled" required />
                                </NumberInput>
                            </FormControl>
                        </VStack>
                    </Box>

                    <Flex justifyContent="space-between" w="100%" px="10%">
                        <Link as={RouterLink} to="/room/preview" _hover={{ textStyle: "none" }} target="_blank" onClick={() => localStorage.setItem("previewRoom", JSON.stringify(room))}>
                            <Button variant="solid" colorScheme="green">
                                See a preview
                            </Button>
                        </Link>

                        <Button variant="solid" type="submit" colorScheme="blue" onClick={(e) => handlePublish(e)}>
                            {queryParams.isEditting ? "Update property" : "Publish"}
                        </Button>

                        {queryParams?.propId &&
                            <Button variant="solid" colorScheme="red">
                                Close this property
                        </Button>}
                    </Flex>
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