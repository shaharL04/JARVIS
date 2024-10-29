import axios from "axios";
class outlookService {
    constructor() {
        this.createEvent = async (eventData, accessToken) => {
            console.log("this is event data and token: " + JSON.stringify(eventData), accessToken);
            try {
                const graphResponse = await axios.post('https://graph.microsoft.com/v1.0/me/events', eventData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                console.log(graphResponse.data);
                return graphResponse.data;
            }
            catch (error) {
                if (error.response) {
                    console.error("Error creating event:", error.response.data);
                    console.error("Status Code:", error.response.status);
                    console.error("Error Headers:", error.response.headers);
                }
                else {
                    console.error("Error creating event:", error.message);
                }
            }
        };
        this.sendEmail = async (emailData, accessToken) => {
            console.log("this is event data and token: " + JSON.stringify(emailData), accessToken);
            try {
                const graphResponse = await axios.post('https://graph.microsoft.com/v1.0/me/sendMail', emailData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                console.log(graphResponse.data);
                return graphResponse.data;
            }
            catch (error) {
                if (error.response) {
                    console.error("Error creating event:", error.response.data);
                    console.error("Status Code:", error.response.status);
                    console.error("Error Headers:", error.response.headers);
                }
                else {
                    console.error("Error creating event:", error.message);
                }
            }
        };
        this.getEventsOnCertainDates = async (startDate, endDate, accessToken) => {
            const url = `https://graph.microsoft.com/v1.0/me/calendarview?startDateTime=${startDate}&endDateTime=${endDate}`;
            try {
                const graphResponse = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                console.log("those are the events I have on the dates: " + graphResponse.data);
                return graphResponse.data;
            }
            catch (error) {
                if (error.response) {
                    console.error("Error creating event:", error.response.data);
                    console.error("Status Code:", error.response.status);
                    console.error("Error Headers:", error.response.headers);
                }
                else {
                    console.error("Error creating event:", error.message);
                }
            }
        };
    }
}
export default new outlookService();
//# sourceMappingURL=outlookService.js.map