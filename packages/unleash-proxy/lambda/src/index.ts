import { startUnleash, InMemStorageProvider, destroyWithFlush, Unleash } from 'unleash-client'

let unleash: Unleash | undefined

async function init() {
  if (!unleash) {
    console.log('[runtime] Starting unleash')
    try {
      unleash = await startUnleash({
        appName: 'development',
        instanceId: 'glffct-zx8L6J9qMf_6vtsziR4y',
        url: 'https://gitlab.com/api/v4/feature_flags/unleash/56592491/',
        refreshInterval: 5 * 1000,
        metricsInterval: 60 * 1000,
        customHeaders: {
          'UNLEASH_PROXY_SECRETS': 'coredin',
          'Authorization': `Bearer ${process.env.API_TOKEN}`
        },
        storageProvider: new InMemStorageProvider(),
      })
      unleash.on('initialized', () => console.log('[runtime] Unleash initialized'))
    } catch (e) {
      console.error(e)
    }
  }
}

process.on('SIGTERM', async () => {
  console.info('[runtime] SIGTERM received')

  if (unleash) {
    await destroyWithFlush()
    unleash = undefined
  }

  process.exit(0)
})

const getFeature = (name: string) => unleash?.isEnabled(name)

/* eslint-disable @typescript-eslint/naming-convention */
const getFeatures = () => ({
  test_feature: getFeature('test_feature')
})
/* eslint-enable @typescript-eslint/naming-convention */

export const handler = async () => {
  // Only the first invocation will trigger SDK initialization.
  try {
    await init()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(getFeatures()),
    }
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'An error occurred!'
      })
    }
  }
}