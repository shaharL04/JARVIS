import axios from 'axios'
import { getTimeZoneOffset } from './helperFunc';
export const functions = {
    get_weather_per_location: async (args) => {
      const weatherData = await axios.get("http://localhost:5000/getWeatherPerLocation",{
        params: {
          location: args.location
        }
      });
      console.log("weather data: "+weatherData)
      return weatherData;
    },
    get_latest_news_by_category: async (args) => {
      const newsData = await axios.get("http://localhost:5000/getLatestNewsByCategory",{
        params: {
          category: args.category
        }
      });
      console.log(newsData)
      return newsData
    },

    convert_one_currency_to_another: async(args) => {
      console.log("agrs: "+JSON.stringify(args))
      const exampleData = {
        base_currency: "THB",
        amount: 1,
        target_currency: "USD"
      };

      try {

          const response = await axios.get("http://localhost:5000/convertTwoCurrencies", {
            params: {
              currenciesData: args
            }
          });
          console.log('currencies: ', response.data);
        
      } catch (error) {
        console.error('Error creating event:', error);
      }

    },

    send_outlook_email: async(args) => {
      console.log("agrs: "+JSON.stringify(args))
      const emailData = {
        message: {
            subject: args.subject,
            body: {
                contentType: "Text", 
                content: args.body
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: args.to
                    }
                }
            ]
        },
        saveToSentItems: "true"
    };


      try {
        const token = localStorage.getItem("jwtToken");

        
        const response = await axios.post(
          "http://localhost:5000/sendOutlookEmail",
          {emailData: emailData}, 
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
            withCredentials: true,
          }
        );
      
        console.log(response.data); 
      } catch (error) {
        console.error('Error fetching events:', error.response?.data || error.message);
      }
    },


    create_outlook_event: async(args) => {
      console.log("agrs: "+JSON.stringify(args))
      console.log(JSON.stringify(args))
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const exampleData = {
        subject: args.title,
        start: {
            dateTime: args.startTime, 
            timeZone: userTimeZone
        },
        end: {
            dateTime: args.endTime,
            timeZone: userTimeZone
        },
        attendees: [
            {
                emailAddress: {
                    address: args.attendees[0]
                },
                type: "required"
            }
        ]
    };


      try {
        const token = localStorage.getItem("jwtToken");


        const response = await axios.post(
          "http://localhost:5000/createOutlookEvent",
          {eventData: exampleData}, 
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
            withCredentials: true,
          }
        );
      
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching events:', error.response?.data || error.message);
      }
    },


    get_outlook_events_on_certain_dates: async(args) => {
      console.log("agrs: "+JSON.stringify(args))
      const exampleData = {
        "startDate": args.startDate,
        "endDate": args.endDate
      };


        try {
          const token = localStorage.getItem("jwtToken");


          const response = await axios.post(
            "http://localhost:5000/getOutlookEventsOnCertainDates",
            exampleData, 
            {
              headers: {
                Authorization: `Bearer ${token}`, 
              },
              withCredentials: true,
            }
          );
        
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching events:', error.response?.data || error.message);
        }
    
    },

    send_google_email: async (args) => {
      console.log("agrs: "+JSON.stringify(args))
      try {
        const token = localStorage.getItem("jwtToken");

        const response = await axios.post(
          "http://localhost:5000/sendGoogleEmail",
          { emailData: args },
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
            withCredentials: true,
          }
        );
    
        console.log(response.data);
      } catch (error) {
        console.error('Error sending email:', error.response?.data || error.message);
      }
    },
    
    create_google_event: async (args) => {
      console.log("agrs: "+JSON.stringify(args))

      
    
      try {
        const token = localStorage.getItem("jwtToken");

        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const getUserOffsetTimeZone = getTimeZoneOffset(userTimeZone);

        const updatedArgs = {
          ...args,
          timeZone: getUserOffsetTimeZone,
        };
        const response = await axios.post(
          "http://localhost:5000/createGoogleEvent",
          { eventData: updatedArgs },
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
            withCredentials: true,
          }
        );

      } catch (error) {
        console.error('Error creating event:', error.response?.data || error.message);
      }
    },
    
    get_google_events_on_certain_dates: async (args) => {
      console.log("agrs: "+JSON.stringify(args))
      const exampleData = {
        startDate: "2024-12-03T00:00:00Z", 
        endDate: "2024-12-03T23:59:59Z"    
      };
    
      try {
        const token = localStorage.getItem("jwtToken");

        const response = await axios.post(
          "http://localhost:5000/getGoogleEventsOnCertainDates",
          args,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
            withCredentials: true,
          }
        );
        return response
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching events:', error.response?.data || error.message);
      }
    },
      
  };