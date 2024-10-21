import axios from "axios";
class mailEventsService {
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
    }
}
export default new mailEventsService();
//# sourceMappingURL=mailEventsService.js.map