import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

export const requestAIAssistance = async (code, action, customInstruction = "") => {
  const response = await apiClient.post("/ai", { code, action, customInstruction });
  return response.data;
};

export default apiClient;
