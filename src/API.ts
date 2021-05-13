import axios, { AxiosResponse } from "axios";

export const API_URL = "http://localhost:44344";
const API_IMAGE_UPLOADER_URL = "https://api.imgur.com/3/upload";
const API_IMAGE_CLIENT_ID = "30ca2ca5dd1f71d";
// const API_IMAGE_CLIENT_SECRET = "5e497c2ba20ff36c20aa512366ddee25300c56e1";

export const axAuth = axios.create();

axAuth.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;

    return config;
})

axAuth.interceptors.response.use((response) => {
    return response;
}, function (error) {
    if (error.response.status === 401) {
        console.log('unauthorized, logging out ...');
        localStorage.removeItem("token");
    }
    // else if(error.response.status === 404){
    //     return Promise.reject("Connection error")
    // }
    return Promise.reject(error.response);
});

// axios.interceptors.request.use((req) => {
//     req.headers.Authorization = `Client-ID : ${API_IMAGE_CLIENT_ID}`
//     return req;
// })

type ReviewRequest = {
    comment?: string;
    reviewStar: number;
    
}
export const postReview = () => {

}

export const postRoom = (data: PublishRoomState) => {
    return axAuth({
        method: "POST",
        url: API_URL + "/api/properties/",
        data: data,
    })
}

export const postImage = (data : any) => axAuth({
    method: "post",
    url: API_IMAGE_UPLOADER_URL,
    data: data,
    headers: {
        'Content-Type' : 'multipart/form-data',
    },
})

export const deleteImage = (delHash: string) => axAuth({
    method: "DELETE",
    url: `https://api.imgur.com/3/image/${delHash}`,
})

export const authenticate = (req: LoginRequest) => {
    return axAuth.post<UserResponse>(API_URL + "/api/user/authenticate", {
            "email": req.email,
            "password": req.password
        });
}

export const registerHost = () => axAuth.post<UserResponse>(API_URL + "/api/user/register-host");

export const register = (req: RegisterRequest) =>{
    return axios.post<UserResponse>(API_URL + "/api/user/register-user", {
        "email": req.email,
        "password": req.password,
        "confirmPassword": req.confirmPassword
    })
}

export const fetchPropertiesView = async (typeId: string | undefined, query: SearchQuery) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let URI = `/api/properties`;
    console.log(query);
    return axios.get<RoomCard[]>(API_URL + URI,{
        params: {
            typeId : typeId,
            city: query.city,
            from: query.from,
            to: query.to,
            guestNum : query.guestNum,
            childrenNum: query.childrenNum,
        }
    });
}

export const fetchCities = async () => {
    // const res = await ax({
    //     method: "GET",
    //     url: URL + "api/city",
    //     timeout: 5000
    // });
    // return res;
    const res = await fetch(API_URL + "/api/cities");
    const data = res.json();
    return data;
}

export const fetchPropertyTypes = async () => {
    const res = await fetch(API_URL + "/api/propertytypes");
    const data: PropertyTypeType[] = await res.json();
    return data;
}

export const fetchPropertyById = async (id: string) => {
    return axAuth.get(API_URL + "/api/properties/" + id);
}

export const fetchPropertiesSaved = () => {
    return axAuth.get<RoomCard[]>(API_URL + "/api/properties/saved");
}

export const fetchUserReservation = async () => {
    return axAuth.get<Reservation[]>(API_URL + "/api/reservations/user");
}

export const fetchPricing = (bookInfo: BookingInfo) => {
    console.log(bookInfo);
    return axios.get<CheckPricingResponse>(API_URL + "/api/reservations/check-pricing",{
        params: {
            fromDate: bookInfo.bookFromDate,
            toDate: bookInfo.bookToDate,
            propertyId: bookInfo.roomId,
            guestNum: bookInfo.guest,
            childrenNum: bookInfo.children
        }
    })
}

interface ToggleLikeProps {
    roomId: string,
    token: string,
}

type ToggleLikeResponse = {
    liked: boolean
}

export const toggleLike = ({roomId, token}: ToggleLikeProps) => {
    return axAuth.post<ToggleLikeResponse>(`${API_URL}/api/likes/${roomId}`,{},{
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
}

export const validateToken = (token: string) => {
    return fetch(`${API_URL}/api/user/validate-token`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}