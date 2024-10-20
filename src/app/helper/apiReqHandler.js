import axios from 'axios'
export const functions = {
    get_weather_per_location: async (args) => {
      const weatherData = await axios.get("http://localhost:5000/getWeatherPerLocation",{
        params: {
          location: args.location
        }
      });
      return weatherData;
    },
    get_latest_news_by_category: async (args) => {
      const newsData = await axios.get("http://localhost:5000/getLatestNewsByCategory",{
        params: {
          category: args.category
        }
      });
      return newsData
    },
    create_event: async(args) => {
      const createEvent = await axios.post("http://localhost:5000/createNewEvent", )
      return createEvent
    }
  };