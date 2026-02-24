import axios from 'axios';

const API_URL = 'http://localhost:4000/api/mood'; // Adjust if needed

export const logMood = async (userId: string, emoji: string, moodScore: number, note: string) => {
    const response = await axios.post(`${API_URL}/log`, { userId, emoji, moodScore, note });
    return response.data;
};

export const getMoodHistory = async (userId: string, days: number = 7) => {
    const response = await axios.get(`${API_URL}/history/${userId}?days=${days}`);
    return response.data;
};

export const generateReport = async (userId: string) => {
    const response = await axios.post(`${API_URL}/generate-report/${userId}`);
    return response.data;
};

export const getReports = async (userId: string, limit: number = 5) => {
    const response = await axios.get(`${API_URL}/reports/${userId}?limit=${limit}`);
    return response.data;
};

export const getLatestReport = async (userId: string) => {
    const response = await axios.get(`${API_URL}/latest-report/${userId}`);
    return response.data;
};
