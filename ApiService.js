import axios from "axios";
class ApiService{

async getLastRequest () {
    const response =  await axios.get("http://localhost:5205/api/Request/last");
    return response.data.user;
}

    
}
export default ApiService;