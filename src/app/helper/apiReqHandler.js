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

    send_email: async(args) => {

      const emailData = {
        message: {
            subject: "Hello from Microsoft Graph",
            body: {
                contentType: "Text", // or "HTML"
                content: "This is a test email sent using Microsoft Graph API."
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: "shaharliba9@gmail.com" // Replace with the recipient's email
                    }
                }
            ],
            ccRecipients: [
                {
                    emailAddress: {
                        address: "shaharliba10@gmail.com" // Optional: Replace with CC email
                    }
                }
            ],
            attachments: [
                {
                    "@odata.type": "#microsoft.graph.fileAttachment",
                    name: "hello_world.txt", // Replace with the name of the attachment
                    contentBytes: "aGVsbG8gd29ybGQh" // Base64-encoded content of the file
                }
            ]
        },
        saveToSentItems: "true" // or "false" to not save the sent email
    };

      try {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
          const response = await axios.post("http://localhost:5000/sendNewEmail", {
            emailData: emailData,
          }, {
              headers: {
                  Authorization: `Bearer ${accessToken}`, // Send the token in the Authorization header
              },
          });
          console.log('email created:', response.data);
        }
    
        
      } catch (error) {
        console.error('Error creating event:', error);
      }
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
          console.log('Event created:', response.data);
        }
    
        
      } catch (error) {
        console.error('Error creating event:', error);
      }
    },


    get_events_on_certain_dates: async(args) => {

      const exampleData = {
        "startDate": "2024-10-21T00:00:00",
        "endDate": "2024-10-26T23:59:59"
      };

      try {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
          const response = await axios.post("http://localhost:5000/getEventsOnCertainDates", {
            eventDatesData: exampleData,
          }, {
              headers: {
                  Authorization: `Bearer ${accessToken}`, // Send the token in the Authorization header
              },
          });
          console.log('got the following events back:', response.data);
        }
    
        
      } catch (error) {
        console.error('Error creating event:', error);
      }
    },

    convert_one_currency_to_another: async(args) => {

      const exampleData = {
        base_currency: "THB",
        amount: 1,
        target_currency: "USD"
      };

      try {

          const response = await axios.get("http://localhost:5000/convertTwoCurrencies", {
            params: {
              currenciesData: exampleData
            }
          });
          console.log('currencies: ', response.data);
        
      } catch (error) {
        console.error('Error creating event:', error);
      }

    }
  };