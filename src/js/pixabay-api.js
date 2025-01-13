import axios from "axios";
axios.defaults.baseURL = 'https://pixabay.com';
export const fetchPhotosByQuery = (searchedQuery, page) => {
    const requestParams = {
        q: searchedQuery,
        page: page,
        key: "48186759-c0bb4a6385eae122fd1e343f0",
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: 15,
    };

    return axios.get('/api/', { params: requestParams });
}