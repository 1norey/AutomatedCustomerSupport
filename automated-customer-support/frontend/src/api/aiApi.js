import axios from "axios";

const aiApi = axios.create({
  baseURL: "http://localhost:8080/api", 
});

export default aiApi;
