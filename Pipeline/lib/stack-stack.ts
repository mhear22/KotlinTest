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
      
    });
    
    
    var sourceOutput = new pipeline.Artifact();
    var buildOutput = new pipeline.Artifact('buildOutput');
    var changeSet = new pipeline.Artifact('ChangeSet');
    var param = ssm.StringParameter.valueForStringParameter(this,"patoken");
    
    var pipe = new pipeline.Pipeline(this, 'pipeline', {
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
            new actions.CloudFormationCreateUpdateStackAction({
              actionName:"CreateChange",
              adminPermissions:true,
              stackName:`${projectName}Stack`,
              output:changeSet,
              templatePath:buildOutput.atPath('template.yml'),
              runOrder:1
            }),
            new actions.CloudFormationExecuteChangeSetAction({
              actionName:"ExecuteChange",
              stackName:`${projectName}Stack`,
              changeSetName:changeSet.artifactName||"",
              runOrder:2
            })
          ]
        }
      ]
    });
    
    
  }
}
