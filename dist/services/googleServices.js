import axios from "axios";
import base64 from 'base-64';
class googleServices {
    constructor() {
        this.createEvent = async (eventData, accessToken) => {
            console.log("This is event data and token:", JSON.stringify(eventData), accessToken);
            try {
                const response = await axios.post('https://www.googleapis.com/calendar/v3/calendars/primary/events', eventData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                console.log(response.data);
                return response.data;
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
            const message = [
                `MIME-Version: 1.0`,
                `Content-Type: ${emailData.message.body.contentType === "HTML" ? "text/html" : "text/plain"}; charset=UTF-8`,
                `Subject: ${emailData.message.subject}`,
                `To: ${emailData.message.toRecipients.map((r) => r.emailAddress.address).join(', ')}`,
                `Cc: ${emailData.message.ccRecipients.map((r) => r.emailAddress.address).join(', ')}`,
                ``,
                emailData.message.body.content
            ].join('\r\n');
            // Encoding the message to base64url format
            const raw = base64.encode(message).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            const payload = { raw };
            console.log("This is payload:", payload);
            try {
                const response = await axios.post('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response.data);
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error("Error sending email:", error.response.data);
                    console.error("Status Code:", error.response.status);
                    console.error("Error Headers:", error.response.headers);
                }
                else {
                    console.error("Error sending email:", error.message);
                }
            }
        };
        this.getEventsOnCertainDates = async (startDate, endDate, accessToken) => {
            const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startDate}&timeMax=${endDate}`;
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                console.log("Events within date range:", response.data);
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error("Error retrieving events:", error.response.data);
                    console.error("Status Code:", error.response.status);
                    console.error("Error Headers:", error.response.headers);
                }
                else {
                    console.error("Error retrieving events:", error.message);
                }
            }
        };
    }
}
export default new googleServices();
//# sourceMappingURL=googleServices.js.map