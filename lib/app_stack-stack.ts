import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

export class AppStackStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    var code = lambda.Code.fromAsset("./target/KotlinTest-1.0-SNAPSHOT-jar-with-dependencies.jar")
    
    var lamb = new lambda.Function(this, "LambdaCode", {
      code:code,
      handler:"Test",
      runtime: lambda.Runtime.JAVA_8_CORRETTO
    });
  }
}
