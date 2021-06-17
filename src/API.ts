import axios, { AxiosResponse } from "axios";
import { useLocation } from "react-router-dom";

// export const API_URL = "http://localhost:44344";
export const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:44344" : "https://nicehostel.herokuapp.com";
const API_IMAGE_UPLOADER_URL = "https://api.imgur.com/3/upload";
const API_IMAGE_CLIENT_ID = "30ca2ca5dd1f71d";
// const API_IMAGE_CLIENT_SECRET = "5e497c2ba20ff36c20aa512366ddee25300c56e1";

export const axAuth = axios.create();
export const axImageUpload = axios.create();

axAuth.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;

    return config;
})

axAuth.interceptors.response.use((response) => {
    return response;
}, function (error) {
    if(error.response.status === 403){
        
    }
    // if (error.response.status === 401) {
    //     console.log('unauthorized');
    //     localStorage.removeItem("token");
    // }
    // if (error.response.status === 403){
    //     console.log("Forbidden");
    // }
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
export const postReview = (data: PostReviewRequest) => {
    return axAuth({
        url: API_URL + "/api/reviews/",
        method: "POST",
        data: data,
    })
}

export const postRoom = (data: PublishRoomState) => {
    return axAuth({
        method: "POST",
        url: API_URL + "/api/properties/",
        data: data,
    })
}

export const postImage = (data : any) => axImageUpload({
    method: "post",
    url: API_IMAGE_UPLOADER_URL,
    data: data,
    headers: {
        'Content-Type' : 'multipart/form-data',
    },
})

export const postReservation = (bookInfo: BookingInfo) => axAuth({
    url: API_URL + "/api/reservations",
    method: "POST",
    data: JSON.stringify({
        "propertyId": bookInfo.roomId,
        "fromDate" : bookInfo.bookFromDate,
        "toDate" : bookInfo.bookToDate,
        "adultNum": bookInfo.guest,
        "childrenNum" : bookInfo.children
    }),        
    headers: {
        'Content-Type': "application/json"
    }
});

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
    return axAuth.get<Room>(API_URL + "/api/properties/" + id);
}

export const fetchPropertiesSaved = () => {
    return axAuth.get<RoomCard[]>(API_URL + "/api/properties/saved");
}

export const fetchOwnerProperty = async () => axAuth.get<RoomCard[]>(API_URL + "/api/properties/host");

export const fetchPropertiesByPropStatusId = async (statusId?: string) => {
    return axAuth.get<RoomCard[]>(API_URL + "/api/properties/not-active", {
        params: statusId && statusId
    });
} 

export const fetchUserReservation = async () => {
    return axAuth.get<ReservationResponse[]>(API_URL + "/api/reservations/user");
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

export const fetchReviewsForProperty = async (propId?: string) => {
    return axAuth.get<Review[]>(API_URL + `/api/reviews`, {
        params: {
            propertyId: propId,
        }
    });
}

export const fetchServices = async () => axAuth.get<Service[]>(API_URL + "/api/properties/services");


export const deleteReservation = async (resId: string) => {
    return axAuth.delete(API_URL + "/api/reservations/" + resId);
}

export const closeProperty = async (propId: string) => {
    return axAuth.put(API_URL + "/api/properties/toggle-close/" + propId);
}

export const useQueryParam = () => {
    return new URLSearchParams(useLocation().search);
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