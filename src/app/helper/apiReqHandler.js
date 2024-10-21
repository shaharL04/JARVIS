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

      const exampleData = {
        subject: "Test Meeting",
        start: {
            dateTime: "2024-10-21T09:00:00", 
            timeZone: "UTC"
        },
        end: {
            dateTime: "2024-10-21T10:30:00",
            timeZone: "UTC"
        },
        attendees: [
            {
                emailAddress: {
                    address: "shaharliba9@gmail.com"
                },
                type: "required"
            }
        ]
    };
    
      try {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
          const response = await axios.post("http://localhost:5000/createNewEvent", {
            eventData: exampleData,
          }, {
              headers: {
                  Authorization: `Bearer ${accessToken}`, // Send the token in the Authorization header
              },
          });
        }
    
        console.log('Event created:', response.data);
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }
  };