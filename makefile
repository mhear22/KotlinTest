package:
	mvn package
	
deploy:
	cdk deploy
	
run: package
	java -cp target/KotlinTest-1.0-SNAPSHOT.jar MainClass
