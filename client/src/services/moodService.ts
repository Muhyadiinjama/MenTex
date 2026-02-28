import axios from 'axios';

import { API_URL as BASE_API_URL } from '../config';

const API_URL = `${BASE_API_URL}/api/mood`;



export const logMood = async (userId: string, emoji: string, moodScore: number, note: string) => {
    const response = await axios.post(`${API_URL}/log`, { userId, emoji, moodScore, note });
    return response.data;
};

export const getMoodHistory = async (userId: string, days: number = 7) => {
    const response = await axios.get(`${API_URL}/history/${userId}?days=${days}`);
    return response.data;
};

export const deleteMoodEntry = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const updateMoodNote = async (id: string, note: string) => {
    const response = await axios.put(`${API_URL}/${id}/note`, { note });
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

export const sendTherapistReport = async (
    userId: string,
    payload: { therapistName: string; therapistEmail: string; subject: string; body: string }
) => {
    const response = await axios.post(`${API_URL}/send-therapist-report/${userId}`, payload, {
        timeout: 20000
    });
    return response.data as { success: boolean; sentAt: string };
};
