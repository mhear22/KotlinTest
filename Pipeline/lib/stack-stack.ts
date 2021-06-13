import cdk = require('@aws-cdk/core');
import pipeline = require('@aws-cdk/aws-codepipeline');
import actions = require('@aws-cdk/aws-codepipeline-actions');
import build = require('@aws-cdk/aws-codebuild');
import s3 = require('@aws-cdk/aws-s3');
import ssm = require('@aws-cdk/aws-ssm');

export class StackStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    var projectName = "KotlinApp"
    
    
    
    var builder = new build.PipelineProject(this, 'buildProj', {
      environment: {
        buildImage: build.LinuxBuildImage.STANDARD_5_0
      }
    });
    
    
    var sourceOutput = new pipeline.Artifact();
    var buildOutput = new pipeline.Artifact('buildOutput');
    var param = ssm.StringParameter.valueForStringParameter(this,"patoken");
    
    new pipeline.Pipeline(this, 'pipeline', {
      crossAccountKeys: false,
      pipelineName: `${projectName}Pipeline`,
      stages:[
        {
          stageName:"Source",
          actions:[
            new actions.GitHubSourceAction({
              actionName:"Source",
              output:sourceOutput,
              owner:"mhear22",
              repo:"KotlinTest",
              branch:"production",
              oauthToken:cdk.SecretValue.plainText(param)
            })
          ]
        },
        {
          stageName:"Build",
          actions: [
            new actions.CodeBuildAction({
              actionName:"build",
              input:sourceOutput,
              project:builder,
              outputs:[buildOutput]
            })
          ]
        },
        {
          stageName:"Deploy",
          actions: [
            new actions.CloudFormationCreateReplaceChangeSetAction({
              actionName:"CreateChange",
              changeSetName:`${projectName}StackChange`,
              adminPermissions:true,
              stackName:`${projectName}Stack`,
              templatePath:buildOutput.atPath('template.yml'),
              runOrder:1
            }),
            new actions.CloudFormationExecuteChangeSetAction({
              actionName:"ExecuteChange",
              stackName:`${projectName}Stack`,
              changeSetName:`${projectName}StackChange`,
              runOrder:2
            })
          ]
        }
      ]
    });
    
    
  }
}
