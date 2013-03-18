package dsbw.chirps

import dsbw.server.{Server, HttpStatusCode, Response, Api}
import dsbw.json.JSON
import Config.{dbHostName, dbPort, dbName, username, pwd, webServerPort}

/** Chirps API */
class ChirpsApi(chirpsService:ChirpsService) extends Api {
  val getEnquestaAdmin = "GET /api/enquestes/admin([0-9]+)/enq([0-9]+)".r
  def service(method: String, uri: String, parameters: Map[String, List[String]] = Map(), headers: Map[String, String] = Map(), body: Option[JSON] = None): Response = {
    (method + " " + uri) match {
      case "GET /api/chirps" => Response(HttpStatusCode.Ok, chirpsService.listChirps)
      case "POST /api/enquestes" => Response(HttpStatusCode.Ok, chirpsService.novaEnquesta())
      case getEnquestaAdmin(idAdmin,idEnquesta) => Response(HttpStatusCode.Ok, chirpsService.getEnquesta(idAdmin,idEnquesta))
      case _ => Response(HttpStatusCode.Ok, "Hello world!")
    }
  }

}

object ChirpsApp extends App {

  val db = new DB(dbHostName, dbPort, dbName, username, pwd)
  val chirpsRepository = new ChirpsRepository(new ChirpsDao(db))
  val chirpersRepository = new ChirpersRepository(new ChirpersDao(db))
  val chirpsService = new ChirpsService(chirpsRepository,chirpersRepository)

  val server = new Server(new ChirpsApi(chirpsService), webServerPort)
  server.start()

}
