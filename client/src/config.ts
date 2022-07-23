// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'dbqpx4v3nh'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-70pi3ul9.us.auth0.com',            // Auth0 domain
  clientId: 'TRUMHHEGb56X4oGkkQWvujaMVYkCzrIH',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
