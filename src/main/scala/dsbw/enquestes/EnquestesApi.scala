package dsbw.enquestes

import dsbw.server.{Server, HttpStatusCode, Response, Api}
import dsbw.json.JSON
import Config.{dbHostName, dbPort, dbName, username, pwd, webServerPort}
import java.util.Date
import com.mongodb.casbah.commons.MongoDBList
import javax.servlet.http.HttpSession

case class NovaEnquesta(titol: String, inici: String, fi: String, preguntes: List[List[String]])
case class NovaPregunta(tipus: String, enunciat: String, respostes: List[String])
case class EstatEnquesta(ident: Integer)
case class Respostes(respostes:List[List[String]])

/** Enquestes API */
class EnquestesApi(enquestesService:EnquestesService) extends Api {
  val getEnquestaAdmin = "GET /api/enquestes/admin([0-9]+)/enq([a-zA-z0-9]+)".r
  val getEnquestaResp = "GET /api/enquestes/user([a-zA-z0-9]+)/enq([a-zA-z0-9]+)".r
  val putEnquestaAdmin = "PUT /api/enquestes/admin([0-9]+)/enq([a-zA-z0-9]+)".r
  val postPreguntaAdmin = "POST /api/enquestes/admin([0-9]+)/enq([a-zA-z0-9]+)".r
  val deletePreguntaAdmin = "DELETE /api/enquestes/admin([0-9]+)/enq([a-zA-z0-9]+)/preg([a-zA-z0-9]+)".r
  val putPreguntaAdmin = "PUT /api/enquestes/admin([0-9]+)/enq([a-zA-z0-9]+)/preg([a-zA-z0-9]+)".r
  val patchEnquestaAdmin = "PATCH /api/enquestes/admin([0-9]+)/enq([a-zA-z0-9]+)".r
  val respondreEnquestaUserPrimera = "POST /api/enquestes/user([a-zA-z0-9]+)/enq([a-zA-z0-9]+)".r
  val respondreEnquestaUser = "PUT /api/enquestes/user([a-zA-z0-9]+)/enq([a-zA-z0-9]+)".r
  val respostesUser = "GET /api/enquestes/user([a-zA-z0-9]+)/enq([a-zA-z0-9]+)/respostes".r
  def service(method: String, uri: String, parameters: Map[String, List[String]] = Map(), headers: Map[String, String] = Map(), body: Option[JSON] = None, session: HttpSession): Response = {
    try { 
      (method + " " + uri) match {
        case "GET /api/login" => Response(HttpStatusCode.Ok, enquestesService.validaUser(parameters,session))
        case "GET /api/logout" => Response(HttpStatusCode.Ok, enquestesService.tancaSessio(session))
        case "GET /api/auth" => Response(HttpStatusCode.Ok, enquestesService.authUser(session))
        case "GET /api/enquestes" => Response(HttpStatusCode.Ok, enquestesService.getListEnquestes(session))
        case "POST /api/enquesta" => Response(HttpStatusCode.Created, enquestesService.creaEnquesta(JSON.fromJSON[NovaEnquesta](body.getOrElse(throw new Exception("Bad Request")))))
        case getEnquestaAdmin(idAdmin,idEnquesta) => Response(HttpStatusCode.Ok, enquestesService.getEnquesta(idAdmin,idEnquesta))
        case getEnquestaResp(idUser,idEnquesta) => Response(HttpStatusCode.Ok, enquestesService.getEnquestaResp(idUser,idEnquesta))
        case putEnquestaAdmin(idAdmin,idEnquesta) => Response(HttpStatusCode.Ok, enquestesService.putEnquesta(idAdmin,idEnquesta,JSON.fromJSON[NovaEnquesta](body.getOrElse(throw new Exception("Bad Request")))))
        case postPreguntaAdmin(idAdmin,idEnquesta) => Response(HttpStatusCode.Created, enquestesService.postPregunta(idAdmin,idEnquesta,JSON.fromJSON[NovaPregunta](body.getOrElse(throw new Exception("Bad Request")))))
        case deletePreguntaAdmin(idAdmin,idEnquesta,idPregunta) => Response(HttpStatusCode.Ok, enquestesService.deletePregunta(idAdmin,idEnquesta,idPregunta))
        case putPreguntaAdmin(idAdmin,idEnquesta,idPregunta) => Response(HttpStatusCode.Ok, enquestesService.putPregunta(idAdmin,idEnquesta,idPregunta,JSON.fromJSON[NovaPregunta](body.getOrElse(throw new Exception("Bad Request")))))
        case patchEnquestaAdmin(idAdmin,idEnquesta) => Response(HttpStatusCode.Ok, enquestesService.patchEnquesta(idAdmin,idEnquesta,JSON.fromJSON[EstatEnquesta](body.getOrElse(throw new Exception("Bad Request")))))
        case respondreEnquestaUserPrimera(idUser,idEnquesta) => Response(HttpStatusCode.Ok, enquestesService.postRespondreEnquesta(idUser,idEnquesta,JSON.fromJSON[Respostes](body.getOrElse(throw new Exception("Bad Request")))))
        case respondreEnquestaUser(idUser,idEnquesta) => Response(HttpStatusCode.Ok, enquestesService.putRespondreEnquesta(idUser,idEnquesta,JSON.fromJSON[Respostes](body.getOrElse(throw new Exception("Bad Request")))))
        case respostesUser(idUser,idEnquesta) => Response(HttpStatusCode.Ok, enquestesService.respostesUser(idUser,idEnquesta))
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
  val usersRepository = new UsersRepository(new UsersDao(db))
  val enquestesService = new EnquestesService(enquestesRepository,usersRepository)

  val server = new Server(new EnquestesApi(enquestesService), webServerPort)
  server.start()

}
