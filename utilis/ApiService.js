const axios = require("axios");
const { Logger } = require("./Logger");

class ApiService {
    connection = true;
    isPolling = false;
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
    
    async getLastRequest(guildId) {
        try {
            const response = await axios.get(`http://${this.url}/api/Request/last`, { params: { guildId } });
            return response.data;
        } catch (error) {
            return this.handleError(`Failed to fetch last request: ${error.message}`);
        }
    }

    async clearQueue(guildId) {
        try {
            const response = await axios.delete(`http://${this.url}/api/Request/clear`, { params: { guildId } });
            return response.data;
        } catch (error) {
            return this.handleError(`Failed to clear queue: ${error.message}`);
        }
    }

    async deleteLastRequest(guildId) {
        try {
            const response = await axios.delete(`http://${this.url}/api/Request/last`, { params: { guildId } });
            return response.data;
        } catch (error) {
            return this.handleError(`Failed to delete last request: ${error.message}`);
        }
    }

    async getRequestCount(guildId) {
        try {
            const response = await axios.get(`http://${this.url}/api/Request/count`, { params: { guildId } });
            return response.data;
        } catch (error) {
            return this.handleError(`Failed to get request count: ${error.message}`);
        }
    }

    async getStatus(guildId) {
        try {
            const response = await axios.get(`http://${this.url}/api/Status`, { params: { guildId } });
            return {
                status: true,
                message: response.data
            };
        } catch (error) {
            return this.handleError(`Failed to get status: ${error.message}`);
        }
    }

    async getStatusWithCreate(guildId,guildName) {
        try {
            let response = await axios.get(`http://${this.url}/api/Status`, { params: { guildId } });
            return response;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                try {
                    await this.createStatus(guildId,guildName);
                    Logger.getLogger().logInfo("Added guild to DB", guildId)
                    return await this.getStatus(guildId);
                    
                } catch (createError) {
                    return this.handleError(`Failed to create or fetch status: ${createError.message}`);
                }
            }
            
            return this.handleError(`Failed to fetch status: ${error}`);
        }
    }

    async createStatus(guildId,guildName) {
        try {
            const response = await axios.post(`http://${this.url}/api/Status`,null, {
                params: {
                    guildId: guildId,
                    guildName: guildName
                }});
            return {
                status: true,
                message: response.data
            };
        } catch (error) {
            return this.handleError(`Failed to create status: ${error}`);
        }
    }

    async resetStatus(guildId) {
        try {
            const response = await axios.put(`http://${this.url}/api/Status`, null, { params: { guildId } });
            return {
                status: true,
                message: response.data
            };
        } catch (error) {
            return this.handleError(`Failed to reset status: ${error}`);
        }
    }

    async updateStatus(status, guildId) {
        try {
            const response = await axios.patch(`http://${this.url}/api/Status`, status, { params: { guildId } });
            return response.data;
        } catch (error) {
            return this.handleError(`Failed to update status: ${error}`);
        }
    }
    async deleteStatus(guildId){
        try {
            const response = await axios.delete(`http://${this.url}/api/Status`, { params: { guildId } });
            Logger.getLogger().logInfo("Deleted guild from DB", guildId)
            return response.data;
        } catch (error) {
            return this.handleError(`Failed to delete last request: ${error.message}`);
        }
    }

    async addRequest(request) {
        try {
            const response = await axios.post(`http://${this.url}/api/Request/new`, request);
            return response.data;
        } catch (error) {
            return this.handleError(`Failed to add request: ${error.message} for`);
        }
    }

    async addPlaylist(request) {
        try {
            const response = await axios.post(`http://${this.url}/api/Request/playlist`, request);
            return response.data;
        } catch (error) {
            return this.handleError(`Failed to add playlist: ${error}`);
        }
    }

    async setLoopMode(mode,guild) {
        try {
            return await this.updateStatus([{
                value: mode,
                path: "/LoopMode",
                op: "replace"
            }],guild);
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async setOnVoiceChannel(isOn,guild) {
        try {
          return await this.updateStatus([{
                value: `${isOn}`,
                path: "/OnVoiceChannel",
                op: "replace"
            }],guild);
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async setVolume(volume,guild) {
        try {
           return await this.updateStatus([{
                value: volume,
                path: "/Volume",
                op: "replace"
            }],guild);
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async setSkipQueued(skip,guild) {
        try {
           return await this.updateStatus([{
                value: skip,
                path: "/SkipQueued",
                op: "replace"
           }],guild);
        } catch (error) {
            return this.handleError(error);
        }
    }

    handleError(message) {
        
        this.connection = false;
        throw new Error(`API error: ${message}`)

        
    }
}

module.exports = { ApiService };
