import { StackProps } from 'aws-cdk-lib'

export interface UnleashProxyStackProps extends StackProps {
  appName: string
  apiToken: string
}
