import { App } from 'aws-cdk-lib'
import { UnleashProxyStackProps } from '../lib/stack-configuration'
import { ServiceStack } from '../lib/service-stack'

const app = new App()

const stackProps: UnleashProxyStackProps = {
  description: 'Unleash Proxy',
  env: {
    account: '992382799028',
    region: 'eu-west-1'
  },
  appName: 'unleash-proxy',
  apiToken: 'tokenNotUsedButRequired'
}

new ServiceStack(app, 'unleash-proxy', stackProps)