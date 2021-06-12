import cdk = require('@aws-cdk/core');
import pipeline = require('@aws-cdk/aws-codepipeline');
import actions = require('@aws-cdk/aws-codepipeline-actions');
import build = require('@aws-cdk/aws-codebuild');
import s3 = require('@aws-cdk/aws-s3');

export class StackStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    var projectName = "KotlinApp"
    
    
    var builder = new build.PipelineProject(this, 'buildProj', {
      
    });
    
    var bucket = new s3.Bucket(this, "Ingest", { })
    var sourceOutput = new pipeline.Artifact();
    var buildOutput = new pipeline.Artifact('buildOutput');
    var changeSet = new pipeline.Artifact('ChangeSet');
    
    var pipe = new pipeline.Pipeline(this, 'pipeline', {
      pipelineName: `${projectName}Pipeline`,
      stages:[
        {
          stageName:"Source",
          actions:[
            new actions.S3SourceAction({
              actionName:"Source",
              bucket:bucket,
              bucketKey:"project",
              output:sourceOutput
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
            }),
            new actions.CloudFormationExecuteChangeSetAction({
              actionName:"ExecuteChange",
              stackName:`${projectName}Stack`,
              changeSetName:changeSet.artifactName||"",
            })
          ]
        }
      ]
    });
    
    
  }
}
