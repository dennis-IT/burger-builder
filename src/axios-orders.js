import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-f4ec9.firebaseio.com/'
});

export default instance;