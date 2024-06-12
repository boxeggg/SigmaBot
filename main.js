import ApiService from "./ApiService.js";
let apiService = new ApiService("localhost:5205");
while(await apiService.getRequestCount() > 0){
    console.log(await apiService.getLastRequest())
    await apiService.deleteLastRequest();
}
