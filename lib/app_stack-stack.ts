import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';

export class AppStackStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    var bucket = s3.Bucket.fromBucketName(this, "a----a", "a----a")
    var code: lambda.Code;
    try {
      var key = process.env["ProjectHash"]
      if(!key)
        throw "no key"
      code = lambda.S3Code.fromBucket(
        bucket,
        key
      )
    }
    catch {
      code = lambda.S3Code.fromAsset("./target/KotlinTest-1.0-SNAPSHOT-jar-with-dependencies.jar")
    }

    var lamb = new lambda.Function(this, "LambdaCode", {
      code:code,
      handler:"Test::handler",
      runtime: lambda.Runtime.JAVA_8_CORRETTO
    });
  }
}
