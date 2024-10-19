const getWeatherPerLocationTool = {
  type: "function",
  name: "get_weather_per_location",
  description: "Use this function when asked to retrieve weather data for a specific location, for example when asked 'What's the weather like in New York?'.",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "The name of the city or location to get the weather for."
      }
    },
    required: ["location"]
  }
};

const getLatestNewsByCategoryTool = {
  type: "function",
  name: "get_latest_news_by_category",
  description: "Use this function when asked to retrieve the latest news for a specific category, for example when asked 'What's the latest business news?'.",
  parameters: {
    type: "object",
    properties: {
      category: {
        type: "string",
        description: "The news category (e.g., 'business', 'sports', 'technology')."
      }
    },
    required: ["category"]
  }
};

export { getWeatherPerLocationTool, getLatestNewsByCategoryTool };
