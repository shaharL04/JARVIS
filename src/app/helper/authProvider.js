"use client"; // This directive ensures it's treated as a client component

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


const msalInstance = new PublicClientApplication(msalConfig);

export default function AuthProvider({ children }) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
