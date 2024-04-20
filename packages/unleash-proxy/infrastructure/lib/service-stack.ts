import { App, Stack } from 'aws-cdk-lib'
import {
  Tracing,
  Runtime,
  Code,
  Function as LambdaFunction,
} from 'aws-cdk-lib/aws-lambda'
import {
  ManagedPolicy,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam'
import { UnleashProxyStackProps } from './stack-configuration'
import { Cors, LambdaRestApi } from 'aws-cdk-lib/aws-apigateway'

const PUBLIC_CORS_OPTIONS = {
  allowOrigins: Cors.ALL_ORIGINS,
  allowMethods: Cors.ALL_METHODS
}

export class ServiceStack extends Stack {
  constructor(scope: App, id: string, props: UnleashProxyStackProps) {
    super(scope, id, props)

    const lambda = this.createUnleashProxyLambda(props)
    this.createApiGateway(lambda)
  }

  private createUnleashProxyLambda(props: UnleashProxyStackProps): LambdaFunction {
    const iamRole = new Role(
      this,
      'UnleashProxyLambdaIamRole',
      {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        roleName: `${props.appName}-lambda-role`,
        description:
          'IAM Role for Unleash proxy Lambda',
      }
    )

    iamRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    )

    const lambda = new LambdaFunction(
      this,
      'UnleashProxyLambda',
      {
        description: 'This Lambda function returns feature flags from Unleash',
        runtime: Runtime.NODEJS_20_X,
        code: Code.fromAsset('../lambda/build'),
        functionName: props.appName,
        handler: 'index.handler',
        memorySize: 256,
        tracing: Tracing.ACTIVE,
        role: iamRole,
        environment: {
          REGION: this.region,
          API_TOKEN: props.apiToken
        },
        retryAttempts: 2
      }
    )

    return lambda
  }

  private createApiGateway(lambda: LambdaFunction) {
    const api = new LambdaRestApi(this, 'UnleashProxyRestApi', {
      handler: lambda,
      proxy: false
    })
    api.root.addMethod('GET')
  }
}

export default {}
