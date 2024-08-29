import axios from 'axios';

// Axiosインスタンスの作成
const DatabaseAPI = axios.create({
    baseURL: 'http://localhost:58000',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 5000  // 5秒に設定
});

export default DatabaseAPI;