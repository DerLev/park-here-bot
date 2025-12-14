import { authService } from './auth.js'

async function main() {
  try {
    // 1. Perform the handshake once
    await authService.login()

    // 2. Make authenticated requests
    console.log("Fetching User Profile...")
    
    const response = await authService.signedFetch(`https://user-management.api.park-here.eu/v1/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      console.error(`Request failed: ${response.status} ${response.statusText}`)
      const text = await response.text()
      console.error(text)
      return
    }

    const data = await response.json()
    console.dir(data, { depth: null, colors: true })

  } catch (error) {
    console.error("Error:", error)
  }
}

main()
