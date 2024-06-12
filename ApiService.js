import axios from "axios";
class ApiService {
    constructor(url) {
        this.url = url
    }
    async getLastRequest() {
        try {
            const response = await axios.get(`http://${this.url}/api/Request/last`);
            return response.data;
        } catch (error) {
            if (error.response) {
                return {
                    status: false,
                    message: error.response.data || error.message
                };
            } else if (error.request) {

                return {
                    status: false,
                    message: 'No response received from server'
                };
            } else {
                return {
                    status: false,
                    message: error.message
                };
            }
        }
    }

    async getAllRequest() {
        const response = await axios.get(`http://${this.url}/api/Request/all`);
        return response.data;
    }
    async deleteLastRequest() {
        try {
            const response = await axios.delete(`http://${this.url}/api/Request/last`);
            return response.data;
        } catch (error) {
            if (error.response) {
                return {
                    status: false,
                    message: error.response.data || error.message
                };
            } else if (error.request) {

                return {
                    status: false,
                    message: 'No response received from server'
                };
            } else {
                return {
                    status: false,
                    message: error.message
                };
            }


        }

    }
    async getRequestCount() {
        const response = await axios.get(`http://${this.url}/api/Request/count`);
        return response.data;
    }

}
export default ApiService;