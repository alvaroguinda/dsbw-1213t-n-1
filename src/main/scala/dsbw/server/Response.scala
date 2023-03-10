package dsbw.server

object HttpStatusCode extends Enumeration{

  val Ok = Value(200)
  val Created = Value(201)
  val Accepted = Value(202)
  val NoContent = Value(204)
  val PartialContent = Value(206)

  val BadRequest = Value(400)
  val Unauthorized = Value(401)
  val Forbidden = Value(403)
  val NotFound = Value(404)
  val NotAcceptable = Value(406)

  val ServerError = Value(500)
}

case class Response private (status: HttpStatusCode.Value, body:Option[Any]=None)

object Response{
  def apply(status:HttpStatusCode.Value) = new Response(status)
  def apply(status:HttpStatusCode.Value, body:Any) = new Response(status,Some(body))
}


