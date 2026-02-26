import { API_URL } from "../config";


export interface Chat {
  id: string;
  userId: string;
  title: string;
  messages: {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: number;
  }[];
  createdAt: number;
  updatedAt: number;
}

export async function createChat(userId: string, title: string = "New Chat") {
  const res = await fetch(`${API_URL}/chats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, title })
  });
  if (!res.ok) throw new Error("Failed to create chat");
  return res.json() as Promise<Chat>;
}

export async function getChats(userId: string) {
  const res = await fetch(`${API_URL}/chats?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to load chats");
  return res.json() as Promise<Chat[]>;
}


export async function getChat(chatId: string) {
  const res = await fetch(`${API_URL}/chats/${chatId}`);
  if (!res.ok) throw new Error("Failed to load chat");
  return res.json() as Promise<Chat>;
}

export async function deleteChat(chatId: string) {
  const res = await fetch(`${API_URL}/chats/${chatId}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete chat");
  return res.json();
}


export interface UserProfile {
  name?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  photoURL?: string;
  preferredLanguage?: 'EN' | 'BM';
}

export async function updateUserProfile(userId: string, data: UserProfile) {
  const res = await fetch(`${API_URL}/user/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...data })
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export async function getUserProfile(userId: string) {
  const res = await fetch(`${API_URL}/user/${userId}`);
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json() as Promise<UserProfile>;
}

export async function streamChat(
  payload: {
    messages?: { role: "user" | "model"; content: string }[],
    chatId?: string,
    userId?: string,
    message?: string,
    moodContext?: string
  },
  onChunk: (t: string) => void
) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Stream request failed");
  }

  if (!response.body) return;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let sawTextChunk = false;

  while (true) { // eslint-disable-line no-constant-condition
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let idx;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const event = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);

      if (event.startsWith("data: ")) {
        let json: { error?: string; text?: string };
        try {
          json = JSON.parse(event.slice(6));
        } catch (e) {
          console.error("Parse error", e);
          continue;
        }

        if (json.error) {
          throw new Error(json.error);
        }

        if (json.text) {
          sawTextChunk = true;
          onChunk(json.text);
        }
      }
    }
  }

  if (!sawTextChunk) {
    throw new Error("No response text received from AI.");
  }
}

export async function sendContactMessage(formData: FormData) {
  // Add the Web3Forms Access Key
  formData.append("access_key", "0bcf7858-0832-447a-a52c-43af72c6c159");

  // Make the request directly to Web3Forms API instead of our backend
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to send message");
  }

  return data;
}
