package:
	mvn package
	
deploy: package
	cdk deploy
	
run: package
	java -cp target/KotlinTest-1.0-SNAPSHOT-jar-with-dependencies.jar Test
