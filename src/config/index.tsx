export const clientId: string | undefined = process.env.REACT_APP_CLIENT_ID;
export const redirectUri: string =
  process.env.REACT_APP_REDIRECT_URI || "/login/github/return";
export const apiEndPoint: string =
  process.env.REACT_APP_API_ENDPOINT || "http://localhost:3002";
export const gaKey = process.env.REACT_APP_GA_KEY;
