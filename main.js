import ApiService from "./ApiService.js";
let apiService = new ApiService("localhost:5205");

await apiService.getLastRequest()
console.log(status)