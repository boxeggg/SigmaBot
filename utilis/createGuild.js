const { ApiService } = require("../utilis/ApiService");
let apiService = ApiService.getInstance(process.env.API_URL);
async function createGuild(guild_ids){
    guild_ids.forEach(async element => {
        await apiService.getStatusWithCreate(element);
    });
}
module.exports = { createGuild};