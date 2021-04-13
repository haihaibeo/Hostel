import axios from "axios";

export const API_URL = "http://localhost:44344";

axios.interceptors.response.use((response) => {
    return response;
}, function (error) {
    if (error.response.status === 401) {
        console.log('unauthorized, logging out ...');
    }
    // else if(error.response.status === 404){
    //     return Promise.reject("Connection error")
    // }
    return Promise.reject(error.response);
});

export const authenticate = (req: LoginRequest) => {
    return axios.post<UserResponse>(API_URL + "/api/user/authenticate", {
            "email": req.email,
            "password": req.password
        });
}

export const fetchPropertyView = (typeId: string | null) => {
    let URI = `/api/properties`;
    if (typeId) {
        URI += `?typeId=${typeId}`;
    }
    return axios.get(API_URL + URI);
}

export const fetchCities = async () => {
    // const res = await axios({
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

export const fetchProperty = async (id: string) => {
    return axios.get(API_URL + "/api/properties/" + id);
}

interface ToggleLikeProps {
    roomId: string,
    token: string,
}

type ToggleLikeResponse = {
    liked: boolean
}

export const toggleLike = ({roomId, token}: ToggleLikeProps) => {
    return axios.post<ToggleLikeResponse>(`${API_URL}/api/likes/${roomId}`,{},{
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
}