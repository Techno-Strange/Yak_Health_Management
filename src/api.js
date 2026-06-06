import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

export async function fetchYaks(q) {
  const res = await API.get("/yaks", { params: q ? { q } : {} });
  return res.data;
}

export async function fetchYakById(id) {
  const res = await API.get(`/yaks/${id}`);
  return res.data;
}

export async function seedYaks() {
  const res = await API.post("/yaks/seed");
  return res.data;
}
