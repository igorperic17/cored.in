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
import {  Deployment, LambdaIntegration, RestApi, Stage } from 'aws-cdk-lib/aws-apigateway'

const FEATURES_RESOURCE = 'features'

export class ServiceStack extends Stack {
  constructor(scope: App, id: string, props: UnleashProxyStackProps) {
    super(scope, id, props)

    this.createProxyForEnvironment(props, 'DEV')
    this.createProxyForEnvironment(props, 'PROD')
  }

  private createApi(lambda: LambdaFunction, environment: string) {
    const api = new RestApi(this, `UnleashProxyRestApi${environment}`, { deploy: false })
    const resource = api.root.addResource(FEATURES_RESOURCE)
    resource.addMethod('GET', new LambdaIntegration(lambda))
    const deployment = new Deployment(this, `UnleashProxyRestApiDeployment${environment}`, { api })
    new Stage(this, `UnleashProxyRestApiStage${environment}`, { deployment, stageName: environment.toLowerCase() })
  }

  private createProxyForEnvironment(props: UnleashProxyStackProps, environment: string) {
    const lambda = this.createUnleashProxyLambda(props, environment)
    this.createApi(lambda, environment)
  }

  private createUnleashProxyLambda(props: UnleashProxyStackProps, environment: string): LambdaFunction {
    const iamRole = new Role(
      this,
      `UnleashProxyLambdaIamRole$${environment}`,
      {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        roleName: `${props.appName}-${environment}-lambda-role`,
        description:
          `IAM Role for Unleash proxy Lambda (${environment})`,
      }
    )

    iamRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    )

    const lambda = new LambdaFunction(
      this,
      `UnleashProxyLambda${environment}`,
      {
        description: `This Lambda function returns feature flags from Unleash (${environment})`,
        runtime: Runtime.NODEJS_20_X,
        code: Code.fromAsset('../lambda/build'),
        functionName: `${props.appName}-${environment}`,
        handler: 'index.handler',
        memorySize: 256,
        tracing: Tracing.ACTIVE,
        role: iamRole,
        environment: {
          REGION: this.region,
          API_TOKEN: props.apiToken,
          APP_NAME: environment
        },
        retryAttempts: 2
      }
    )

    return lambda
  }
}

export default {}
