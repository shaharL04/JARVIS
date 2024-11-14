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

const convertOneCurrencyToAnother = {
  type: "function",
  name: "convert_one_currency_to_another",
  description: "Use this function when asked to convert between two currencies, for example, GBP to ILS.",
  parameters: {
    type: "object", // Added this line to define the structure of the parameters as an object
    properties: {
      base_currency: {
        type: "string",
        description: "The currency you want to convert from, e.g., 'GBP'."
      },
      amount: {
        type: "integer", // Use 'integer' instead of 'int' for JSON schema compatibility
        description: "The amount of the base currency coins you want to convert to the target currency. Defaults to 1 if not specified, but you must provide a value."
      },
      target_currency: {
        type: "string",
        description: "The currency you want to convert to, e.g., 'ILS'."
      }
    },
    required: ["base_currency", "amount", "target_currency"]
  }
};


const sendOutlookEmail = {
  type: "function",
  name: "send_outlook_email",
  description: "This function is designed to send an email. It should be invoked when the user requests to send an email, for instance, by saying, 'Could you send an email to...'. Before executing, ensure you verify the email details with the user, such as the recipient, subject, and body content.",
  parameters: {
    type: "object",
    properties: {
      to: {
        type: "string",
        description: "The email address of the recipient. Ensure that this is a valid email format (e.g., user@example.com) to prevent delivery issues."
      },
      subject: {
        type: "string",
        description: "The subject line of the email. This should summarize the content and purpose of the email succinctly."
      },
      body: {
        type: "string",
        description: "The main content of the email. This should convey the message you intend to send to the recipient."
      }
    },
    required: ["to", "subject", "body"]
  }
};

const createOutlookEvent = {
  type: "function",
  name: "create_outlook_event",
  description: "This function creates a new calendar event. It should be invoked when a user requests to schedule an event, such as by saying, 'Can you create an event for...'. Make sure to verify the event details with the user before proceeding.",
  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "The title of the event. This should be a concise description of the event, easily identifiable by participants."
      },
      startTime: {
        type: "string",
        description: "The start time of the event in ISO 8601 format (e.g., '2024-10-21T09:00:00Z'). Ensure the time zone is specified if needed."
      },
      endTime: {
        type: "string",
        description: "The end time of the event in ISO 8601 format (e.g., '2024-10-21T10:00:00Z'). The end time must be later than the start time."
      },
      location: {
        type: "string",
        description: "The physical or virtual location of the event. This could be an address or a link to a virtual meeting."
      },
      description: {
        type: "string",
        description: "A detailed description of the event. This can include additional information, agenda items, or instructions for attendees."
      },
      attendees: {
        type: "array",
        items: {
          type: "string",
          description: "A list of email addresses of participants who will be invited to the event. Ensure that these are valid email addresses."
        },
        description: "An array of email addresses of attendees to invite to the event."
      }
    },
    required: ["title", "startTime", "endTime"]
  }
};


const getOutlookEventsOnCertainDates = {
  type: "function",
  name: "get_outlook_events_on_certain_dates",
  description: "This function retrieves calendar events occurring between specified dates. It should be invoked when a user asks to view events within a certain date range, such as by saying, 'Can you show me the events from...'.",
  parameters: {
    type: "object",
    properties: {
      startDate: {
        type: "string",
        description: "The start date in ISO 8601 format (e.g., '2024-10-21T00:00:00'). This specifies the beginning of the date range to retrieve events from."
      },
      endDate: {
        type: "string",
        description: "The end date in ISO 8601 format (e.g., '2024-10-21T23:59:59'). This specifies the end of the date range to retrieve events."
      }
    },
    required: ["startDate", "endDate"]
  }
};


const sendGoogleEmail = {
  type: "function",
  name: "send_google_email",
  description: "This function sends an email using Google Gmail. It should be invoked when a user requests to send an email, such as by saying, 'Could you send an email to...'. Verify email details like recipient, subject, and body content with the user before proceeding.",
  parameters: {
    type: "object",
    properties: {
      to: {
        type: "string",
        description: "The recipient's email address, formatted correctly (e.g., user@example.com) to ensure proper delivery."
      },
      subject: {
        type: "string",
        description: "The subject of the email, summarizing the email's content and purpose concisely."
      },
      body: {
        type: "string",
        description: "The main message body of the email, containing the content intended for the recipient."
      }
    },
    required: ["to", "subject", "body"]
  }
};

const createGoogleEvent = {
  type: "function",
  name: "create_google_event",
  description: "This function schedules a new event in Google Calendar. Invoke it when a user requests event scheduling, like 'Can you create an event for...'. Ensure that event details are verified before proceeding.",
  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "A short title for the event, providing a clear description that is easily recognizable by participants."
      },
      startTime: {
        type: "string",
        description: "The start time of the event in ISO 8601 format (e.g., '2024-10-21T09:00:00Z'), specifying the time zone if needed."
      },
      endTime: {
        type: "string",
        description: "The end time of the event in ISO 8601 format (e.g., '2024-10-21T10:00:00Z'), which must be later than the start time."
      },
      location: {
        type: "string",
        description: "The location of the event, either a physical address or a virtual meeting link."
      },
      description: {
        type: "string",
        description: "A detailed description of the event, with information like agenda or instructions for attendees."
      },
      attendees: {
        type: "array",
        items: {
          type: "string",
          description: "An email address of an attendee. Ensure these are valid emails to avoid delivery issues."
        },
        description: "An array of email addresses of attendees to invite to the event."
      }
    },
    required: ["title", "startTime", "endTime"]
  }
};

const getGoogleEventsOnCertainDates = {
  type: "function",
  name: "get_google_events_on_certain_dates",
  description: "This function retrieves events from Google Calendar within a specified date range. Use it when a user asks for events in a specific time range, such as 'Can you show me events from...'.",
  parameters: {
    type: "object",
    properties: {
      startDate: {
        type: "string",
        description: "The starting date in ISO 8601 format (e.g., '2024-10-21T00:00:00'), marking the beginning of the date range to retrieve events."
      },
      endDate: {
        type: "string",
        description: "The ending date in ISO 8601 format (e.g., '2024-10-21T23:59:59'), marking the end of the date range to retrieve events."
      }
    },
    required: ["startDate", "endDate"]
  }
};







export { getWeatherPerLocationTool,getLatestNewsByCategoryTool , convertOneCurrencyToAnother ,sendOutlookEmail, createOutlookEvent, getOutlookEventsOnCertainDates, sendGoogleEmail, createGoogleEvent,getGoogleEventsOnCertainDates };
