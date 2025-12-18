import { config as dotenvConfig } from "dotenv"

export const appConfig = (() => {
  dotenvConfig({ quiet: true })

  return {
    REGION: "eu-central-1",
    USER_POOL_ID: "eu-central-1_fiCD3BPci",
    CLIENT_ID: "1rq16p3rmvo3muipsc4hgkg7id",
    IDENTITY_POOL_ID: "eu-central-1:7377d086-0ed2-442b-ba92-3fdf365e5887",

    USERNAME: process.env.USERNAME ?? "",
    PASSWORD: process.env.PASSWORD ?? "",
  }
})()
