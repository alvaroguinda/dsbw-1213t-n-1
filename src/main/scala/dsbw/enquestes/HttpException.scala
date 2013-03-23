package dsbw.enquestes

case class HttpException(statusCode: Int, message:String) extends Exception