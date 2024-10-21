
"use client"; 

import React from 'react';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';

// MSAL Configuration
const msalConfig = {
    auth: {
        clientId: "986d3145-3f34-43a8-ac98-95edd1e1e918", 
        authority: "https://login.microsoftonline.com/common", 
        redirectUri: "http://localhost:3000", 
    },
};

// Login Request
const loginRequest = {
    scopes: [
        "Mail.Read",
        "Mail.Send",
        "Calendars.Read",
        "Calendars.ReadWrite",
        "User.Read"
    ],
};

const msalInstance = new PublicClientApplication(msalConfig);

// AuthProvider Component
export function AuthProvider({ children }) {
    return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}


export { msalConfig, loginRequest };
