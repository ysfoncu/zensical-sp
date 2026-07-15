// Runtime configuration for the help-center tracking frontend.
//
// All tracking (emails, progress, feedback) goes to the AWS Lambda +
// DynamoDB API below — both when the site runs locally (zensical serve)
// and when it is published on GitHub Pages.

export const CONFIG = {
  API_BASE_URL: "https://mwkwaveovl.execute-api.eu-north-1.amazonaws.com",
};
