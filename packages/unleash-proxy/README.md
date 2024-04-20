# Unleash Proxy
The mission of this service is to yield feature flags from Unleash.

## Getting Started
The project can be set up for local development as follows.

### Requirements
* Node 20.x

### Install
Navigate to the root directory of the Lambda project.

``
cd lambda
``

Install the project dependencies using NPM.

```
npm install
```

### Deploy

Ensure the environment variable `AWS_DEFAULT_PROFILE` is set if you want to use a specific profile (ex: `personal_prod`) over the default profile when deploying the CDK project to AWS.

Run the following commands locally to deploy the AWS CDK project to AWS.

* **Navigate to the `lambda` project and build it using npm:** `cd lambda && yarn install && yarn build && cd ..`
* **Navigate to the `infrastructure` project, verify AWS environment and CDK version and build the CDK project:** `cd infrastructure && cdk doctor && yarn install && yarn build`
* **Verify staged changes:** `npx aws-cdk diff unleash-proxy`
* **Deploy staged changes:** `npx aws-cdk deploy unleash-proxy --require-approval never`