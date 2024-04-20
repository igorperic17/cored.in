import { App } from 'aws-cdk-lib'
import { UnleashProxyStackProps } from '../lib/stack-configuration'
import { ServiceStack } from '../lib/service-stack'

const app = new App()

const stackProps: UnleashProxyStackProps = {
  description: 'Unleash Proxy',
  env: {
    account: '138945776678',
    region: 'eu-west-1'
  },
  appName: 'unleash-proxy',
  apiToken: 'tokenNotUsedButRequired',
  apiStageName: 'prod'
}

new ServiceStack(app, 'unleash-proxy', stackProps)