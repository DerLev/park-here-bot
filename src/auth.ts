import { CognitoIdentityClient, GetCredentialsForIdentityCommand, GetIdCommand } from '@aws-sdk/client-cognito-identity'
import { SignatureV4 } from '@aws-sdk/signature-v4'
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import { Sha256 } from "@aws-crypto/sha256-js"
import { HttpRequest } from '@aws-sdk/protocol-http'

const poolData = {
  UserPoolId: "eu-central-1_fiCD3BPci",
  ClientId: "1rq16p3rmvo3muipsc4hgkg7id",
}

const userPool = new CognitoUserPool(poolData)

const userData = {
  Username: "",
  Pool: userPool,
}
const cognitoUser = new CognitoUser(userData)

const authenticationDetails = new AuthenticationDetails({
  Username: userData.Username,
  Password: ""
})

const identityPoolId = "eu-central-1:7377d086-0ed2-442b-ba92-3fdf365e5887"
const region = "eu-central-1"

cognitoUser.authenticateUser(authenticationDetails, {
  onSuccess: async (res) => {
    console.log("Auth successful")
    const idToken = res.getIdToken().getJwtToken()

    const cognitoIdentity = new CognitoIdentityClient({ region })

    const loginMapKey = `cognito-idp.${region}.amazonaws.com/${poolData.UserPoolId}`
    const loginsMap = { [loginMapKey]: idToken }

    const idParams = {
      IdentityPoolId: identityPoolId,
      Logins: loginsMap,
    }

    try {
      const idResponse = await cognitoIdentity.send(new GetIdCommand(idParams))
      const identityId = idResponse.IdentityId

      const credParams = {
        IdentityId: identityId,
        Logins: loginsMap
      }
      const credResponse = await cognitoIdentity.send(new GetCredentialsForIdentityCommand(credParams))
      
      const tempCreds = {
        accessKeyId: credResponse.Credentials?.AccessKeyId ?? "",
        secretAccessKey: credResponse.Credentials?.SecretKey ?? "",
        sessionToken: credResponse.Credentials?.SessionToken ?? "",
      }

      console.log(tempCreds)

      const apiUrl = "https://user-management.api.park-here.eu/v1/me";
      const url = new URL(apiUrl);

      // Prepare the request object for signing
      const request = new HttpRequest({
        hostname: url.hostname,
        path: url.pathname,
        protocol: url.protocol,
        method: "GET",
        headers: {
            host: url.hostname,
            // "ph-client-datetime": Date.now().toString() // Replicating custom header
        }
      });

      const signer = new SignatureV4({
        credentials: {
          accessKeyId: tempCreds.accessKeyId,
          secretAccessKey: tempCreds.secretAccessKey,
          sessionToken: tempCreds.sessionToken
        },
        region,
        service: "execute-api", // Crucial: API Gateway service name
        sha256: Sha256
      });

      const signedRequest = await signer.sign(request);

      const response = await fetch(apiUrl, {
        method: signedRequest.method,
        headers: signedRequest.headers
      });

      const data = await response.json();
      console.log("\n--- API RESPONSE ---");
      console.log(data);
    } catch (err) {
      
    }
  },
  onFailure: (err) => {
    console.error("Auth failed:", err.message || JSON.stringify(err))
  }
})
