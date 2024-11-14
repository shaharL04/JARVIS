import axios from "axios";
import base64 from 'base-64';
class googleServices {
    // Function to create an event in Google Calendar
    async createEvent(eventData, accessToken) {
        console.log("Creating event with data:", eventData);
        // Formatting event data as required by Google API
        const formattedEventData = {
            summary: eventData.title,
            start: { dateTime: eventData.startTime },
            end: { dateTime: eventData.endTime },
            location: eventData.location || "",
            description: eventData.description || "",
            attendees: eventData.attendees?.map(email => ({ email })) || []
        };
        try {
            const response = await axios.post('https://www.googleapis.com/calendar/v3/calendars/primary/events', formattedEventData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            console.log("Event created successfully:", response.data);
            return response.data;
        }
        catch (error) {
            this.handleError("Error creating event", error);
        }
    }
    // Function to send an email using Google Gmail API
    async sendEmail(emailData, accessToken) {
        const message = [
            `MIME-Version: 1.0`,
            `Content-Type: text/plain; charset=UTF-8`,
            `Subject: ${emailData.subject}`,
            `To: ${emailData.to}`,
            ``,
            emailData.body
        ].join('\r\n');
        const raw = base64.encode(message).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        const payload = { raw };
        console.log("Sending email with payload:", payload);
        try {
            const response = await axios.post('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', payload, {
                headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
            });
            console.log("Email sent successfully:", response.data);
            return response.data;
        }
        catch (error) {
            this.handleError("Error sending email", error);
        }
    }
    // Function to get events within a specified date range from Google Calendar
    async getEventsOnCertainDates(dateRange, accessToken) {
        const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${dateRange.startDate}&timeMax=${dateRange.endDate}`;
        console.log("Retrieving events from", dateRange.startDate, "to", dateRange.endDate);
        try {
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            console.log("Retrieved events:", response.data);
            return response.data;
        }
        catch (error) {
            this.handleError("Error retrieving events", error);
        }
    }
    // Centralized error handler
    handleError(message, error) {
        if (error.response) {
            console.error(`${message}:`, error.response.data);
            console.error("Status Code:", error.response.status);
            console.error("Headers:", error.response.headers);
        }
        else {
            console.error(`${message}:`, error.message);
        }
    }
}
export default new googleServices();
//# sourceMappingURL=googleServices.js.map