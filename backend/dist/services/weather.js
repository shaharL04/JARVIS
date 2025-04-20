import axios from "axios";
class weatherApi {
    constructor() {
        this.getWheatherPerLocation = async (location) => {
            /*https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=8a363841a75a1d1e6f3576c5e4d42273 */
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=8a363841a75a1d1e6f3576c5e4d42273`);
                const celsiusTemp = response.data.main.temp - 273.15;
                const minTemp = response.data.main.temp_min - 273.15;
                const maxTemp = response.data.main.temp_max - 273.15;
                // Extract other relevant information
                const weatherDescription = response.data.weather[0].description;
                const humidity = response.data.main.humidity;
                const pressure = response.data.main.pressure;
                const windSpeed = response.data.wind.speed;
                const locationName = response.data.name;
                const country = response.data.sys.country;
                // Create a structured object to return
                const weatherInfo = {
                    location: `${locationName}, ${country}`,
                    temperature: celsiusTemp.toFixed(2),
                    minTemperature: minTemp.toFixed(2),
                    maxTemperature: maxTemp.toFixed(2),
                    description: weatherDescription,
                    humidity: `${humidity}%`,
                    pressure: `${pressure} hPa`,
                    windSpeed: `${windSpeed} m/s`
                };
                console.log("Weather Info: ", weatherInfo);
                return weatherInfo;
            }
            catch (error) {
                console.log("error retriving wheather data for your location: " + error);
            }
        };
    }
}
export default new weatherApi();
//# sourceMappingURL=weather.js.map