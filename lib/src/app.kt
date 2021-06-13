import java.io.*
import com.fasterxml.jackson.module.kotlin.*

object Test {
	@JvmStatic
	fun main(args: Array<String>) {
		print("Hello World")
	}
	
	 fun handler(input: InputStream, output: OutputStream): Unit {
		print("Hello AWS Console")
	}
}