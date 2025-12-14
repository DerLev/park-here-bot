import { 
  CognitoUserPool, 
  CognitoUser, 
  AuthenticationDetails, 
  CognitoUserSession 
} from 'amazon-cognito-identity-js'
import { 
  CognitoIdentityClient, 
  GetIdCommand, 
  GetCredentialsForIdentityCommand 
} from "@aws-sdk/client-cognito-identity"
import { SignatureV4 } from "@aws-sdk/signature-v4"
import { Sha256 } from "@aws-crypto/sha256-js"
import { HttpRequest } from "@aws-sdk/protocol-http"

import { appConfig } from './config.js'

interface AwsCredentials {
  accessKeyId: string
  secretAccessKey: string
  sessionToken: string
}

class AuthService {
  private credentials: AwsCredentials | null = null

  /**
   * Performs SRP Login -> Identity Exchange -> Stores Credentials
   */
  public async login(): Promise<void> {
    console.log("Authenticating...")
    
    /* Setup Cognito User */
    const poolData = { UserPoolId: appConfig.USER_POOL_ID, ClientId: appConfig.CLIENT_ID }
    const userPool = new CognitoUserPool(poolData)
    const cognitoUser = new CognitoUser({
      Username: appConfig.USERNAME,
      Pool: userPool,
    })
    const authDetails = new AuthenticationDetails({
      Username: appConfig.USERNAME,
      Password: appConfig.PASSWORD,
    })

    /* SRP Login */
    const idToken = await new Promise<string>((resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (res: CognitoUserSession) => resolve(res.getIdToken().getJwtToken()),
        onFailure: (err: Error) => reject(err),
        newPasswordRequired: () => reject(new Error("New Password Required")),
      })
    })

    /* Exchange ID Token for Temporary AWS Credentials */
    const cognitoIdentity = new CognitoIdentityClient({ region: appConfig.REGION })
    const loginMapKey = `cognito-idp.${appConfig.REGION}.amazonaws.com/${appConfig.USER_POOL_ID}`
    
    /* Get Identity ID */
    const idRes = await cognitoIdentity.send(new GetIdCommand({
      IdentityPoolId: appConfig.IDENTITY_POOL_ID,
      Logins: { [loginMapKey]: idToken },
    }))

    if (!idRes.IdentityId) throw new Error("Failed to get IdentityId")

    /* Get Credentials */
    const credRes = await cognitoIdentity.send(new GetCredentialsForIdentityCommand({
      IdentityId: idRes.IdentityId,
      Logins: { [loginMapKey]: idToken },
    }))

    if (!credRes.Credentials || !credRes.Credentials.AccessKeyId || !credRes.Credentials.SecretKey || !credRes.Credentials.SessionToken) {
      throw new Error("Failed to get Credentials")
    }

    /* Save Credentials */
    this.credentials = {
      accessKeyId: credRes.Credentials.AccessKeyId,
      secretAccessKey: credRes.Credentials.SecretKey,
      sessionToken: credRes.Credentials.SessionToken,
    }

    console.log("Authentication Complete.")
  }

  /**
   * A wrapper around global fetch that automatically signs requests with SigV4
   */
  public async signedFetch(inputUrl: string, options: RequestInit = {}): Promise<Response> {
    if (!this.credentials) throw new Error("Not logged in! Call login() first.")

    const urlObj = new URL(inputUrl)
    const signer = new SignatureV4({
      credentials: this.credentials,
      region: appConfig.REGION,
      service: 'execute-api', 
      sha256: Sha256,
    })

    /* Prepare Request */
    const request = new HttpRequest({
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      protocol: urlObj.protocol,
      method: options.method || 'GET',
      headers: {
        host: urlObj.hostname,
        'ph-client-datetime': Date.now().toString(),
        ...(options.headers as Record<string, string>)
      },
      body: options.body ? (options.body as string) : undefined,
    })

    /* Sign Request */
    const signedRequest = await signer.sign(request)

    /* Execute Fetch */
    return fetch(inputUrl, {
      method: signedRequest.method,
      headers: signedRequest.headers,
      body: signedRequest.body,
    })
  }
}

export const authService = new AuthService()
