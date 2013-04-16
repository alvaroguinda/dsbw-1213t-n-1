package dsbw.enquestes

import dsbw.server.{Server, HttpStatusCode, Response, Api}
import dsbw.json.JSON
import Config.{dbHostName, dbPort, dbName, username, pwd, webServerPort}
import java.util.Date

case class NovaEnquesta(titol: String, inici: String, fi: String, preguntes: List[List[String]])
case class NovaPregunta(tipus: String, enunciat: String)

/** Enquestes API */
class EnquestesApi(enquestesService:EnquestesService) extends Api {
  val getEnquestaAdmin = "GET /api/enquestes/admin([0-9]+)/enq([a-zA-z0-9]+)".r
  val putEnquestaAdmin = "PUT /api/enquestes/admin([0-9]+)/enq([a-zA-z0-9]+)".r
  val postPreguntaAdmin = "POST /api/enquestes/admin([0-9]+)/enq([a-zA-z0-9]+)".r
  val deletePreguntaAdmin = "DELETE /api/enquestes/admin([0-9]+)/enq([a-zA-z0-9]+)/preg([a-zA-z0-9]+)".r
  def service(method: String, uri: String, parameters: Map[String, List[String]] = Map(), headers: Map[String, String] = Map(), body: Option[JSON] = None): Response = {
    try {
      (method + " " + uri) match {
        //case "GET /api/enquestes" => Response(HttpStatusCode.Ok, enquestesService.listEnquestes)
        case "POST /api/enquesta" => Response(HttpStatusCode.Created, enquestesService.creaEnquesta(JSON.fromJSON[NovaEnquesta](body.getOrElse(throw new Exception("Bad Request")))))
        case getEnquestaAdmin(idAdmin,idEnquesta) => Response(HttpStatusCode.Ok, enquestesService.getEnquesta(idAdmin,idEnquesta))
        case putEnquestaAdmin(idAdmin,idEnquesta) => Response(HttpStatusCode.Ok, enquestesService.putEnquesta(idAdmin,idEnquesta,JSON.fromJSON[NovaEnquesta](body.getOrElse(throw new Exception("Bad Request")))))
        case postPreguntaAdmin(idAdmin,idEnquesta) => Response(HttpStatusCode.Created, enquestesService.postPregunta(idAdmin,idEnquesta,JSON.fromJSON[NovaPregunta](body.getOrElse(throw new Exception("Bad Request")))))
        case deletePreguntaAdmin(idAdmin,idEnquesta,idPregunta) => Response(HttpStatusCode.Ok, enquestesService.deletePregunta(idAdmin,idEnquesta,idPregunta))
        case _ => Response(HttpStatusCode.Ok, "Hello world!")
      }
    } catch {
      case e: HttpException => Response(HttpStatusCode.apply(e.statusCode), e.message)
      case e: Exception => Response(HttpStatusCode.ServerError, "Error en el sistema")
    }
  }

}

object EnquestesApp extends App {

  val db = new DB(dbHostName, dbPort, dbName, username, pwd)
  val enquestesRepository = new EnquestesRepository(new EnquestesDao(db))
  val enquestesService = new EnquestesService(enquestesRepository)

  val server = new Server(new EnquestesApi(enquestesService), webServerPort)
  server.start()

}
