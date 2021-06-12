package:
	mvn package
	
deploy:
	cdk deploy
	
run:
	java -cp target/KotlinTest-1.0-SNAPSHOT.jar main