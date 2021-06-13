import java.io.*

object Test {
	@JvmStatic
	fun main(args: Array<String>) {
		print("Hello World")
	}
	
}

class AWSEntry() {
	fun handler(input: InputStream, output: OutputStream): Unit {
		print("Hello AWS Console")
	}
}