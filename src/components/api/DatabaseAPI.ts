import axios from 'axios';

// Axiosインスタンスの作成
const DatabaseAPI = axios.create({
    baseURL: 'http://localhost:58000',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000  // 30秒に設定
});

export default DatabaseAPI;