const axios = require("axios");

class ApiService {
    connection = false;
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
            return {
               status: true,
               message: response.data
            }

        } catch (error) {
            return this.handleError(error);
        }
    }
    async resetStatus(){
        try {
            const response = await axios.put(`http://${this.url}/api/Status`);
            return {
               status: true,
               message: response.data
            }

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
    async setGuildId(id) {
        try{
        return await this.updateStatus(
        [{
            value:`${id}`,
            path: "/GuildId",
            op: "replace"
        }]);
        
        }
        catch(error){
            return this.handleError(error)

        }

        
    }
    
    async setLoopMode(mode) {
        try {
            return await this.updateStatus([{
                value: mode,
                path: "/LoopMode",
                op: "replace"
            }]);
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async setOnVoiceChannel(isOn) {
        try {
          return await this.updateStatus([{
                value: isOn,
                path: "/OnVoiceChannel",
                op: "replace"
            }]);
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async setVolume(volume) {
        try {
           return await this.updateStatus([{
                value: volume,
                path: "/Volume",
                op: "replace"
            }]);
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async setSkipQueued(skip) {
        try {
           return await this.updateStatus([{
                value: skip,
                path: "/SkipQueued",
                op: "replace"
           }]);
        } catch (error) {
            return this.handleError(error);
        }
    }

    handleError(error) {
        throw error;

    }
}

module.exports = { ApiService };