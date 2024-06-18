const axios = require("axios");

class ApiService {
    constructor(url) {
        if (ApiService.instance) {
            return ApiService.instance;
        }

        ApiService.instance = this;
        this.url = url;
    }

    static getInstance(url) {
        if (!this.instance) {
            this.instance = new ApiService(url);
        }
        return this.instance;
    }

    async getLastRequest() {
        try {
            const response = await axios.get(`http://${this.url}/api/Request/last`);
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }
    async clearQueue() {
        try {
            const response = await axios.delete(`http://${this.url}/api/Request/clear`);
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getAllRequest() {
        try {
            const response = await axios.get(`http://${this.url}/api/Request/all`);
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async deleteLastRequest() {
        try {
            const response = await axios.delete(`http://${this.url}/api/Request/last`);
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getRequestCount() {
        try {
            const response = await axios.get(`http://${this.url}/api/Request/count`);
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getStatus() {
        try {
            const response = await axios.get(`http://${this.url}/api/Status`);
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async updateStatus(status) {
        try {
            const response = await axios.patch(`http://${this.url}/api/Status`, status);
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async addRequest(request) {
        try {
            const response = await axios.post(`http://${this.url}/api/Request/new`, request);
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }
    async addPlaylist(request) {
        try {
            const response = await axios.post(`http://${this.url}/api/Request/playlist`, request);
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    handleError(error) {
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

module.exports = { ApiService };