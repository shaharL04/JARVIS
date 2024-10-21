import axios from "axios"

class mailEventsService{
    createEvent = async (eventData: any, accessToken: any) =>{
        console.log("this is event data and token: "+JSON.stringify(eventData), accessToken)
        try{
            const graphResponse = await axios.post('https://graph.microsoft.com/v1.0/me/events', eventData, {
                headers: {
                    Authorization: `Bearer ${accessToken}` 
                }
            });
            console.log(graphResponse.data)
            return graphResponse.data
        }catch(error:any){
            if (error.response) {
                console.error("Error creating event:", error.response.data);
                console.error("Status Code:", error.response.status);
                console.error("Error Headers:", error.response.headers);
            } else {
                console.error("Error creating event:", error.message);
            }
        }
    }

    sendEmail = async (emailData: any, accessToken: any) =>{
        console.log("this is event data and token: "+JSON.stringify(emailData), accessToken)
        try{
            const graphResponse = await axios.post('https://graph.microsoft.com/v1.0/me/sendMail', emailData, {
                headers: {
                    Authorization: `Bearer ${accessToken}` 
                }
            });
            console.log(graphResponse.data)
            return graphResponse.data
        }catch(error:any){
            if (error.response) {
                console.error("Error creating event:", error.response.data);
                console.error("Status Code:", error.response.status);
                console.error("Error Headers:", error.response.headers);
            } else {
                console.error("Error creating event:", error.message);
            }
        }
    }
}
export default new mailEventsService()
