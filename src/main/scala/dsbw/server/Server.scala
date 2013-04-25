package dsbw.server

import org.eclipse.jetty.server.{Server => JettyServer}
import org.eclipse.jetty.servlet.{ServletHolder, ServletContextHandler}
import org.eclipse.jetty.server.handler.{HandlerList, ResourceHandler}
import scala.Array
import dsbw.json.JSON
import javax.servlet.http.{HttpSession, HttpServletResponse, HttpServletRequest, HttpServlet}
import io.Source
import collection.JavaConversions.{enumerationAsScalaIterator, mapAsScalaMap}
import java.io.PrintWriter
import javax.servlet.RequestDispatcher
import scala.util.control.Breaks._

/** Trait to be implemented by HTTP apis */
trait Api{
  def service(method:String, uri:String, parameters:Map[String, List[String]] = Map(), headers:Map[String, String]=Map(), body:Option[JSON]=None, session: HttpSession):Response
}

/** Main servlet interfacing between Java Servlet APIs and the Api trait */
class Servlet(api:Api) extends HttpServlet {

  override def service(request: HttpServletRequest, response: HttpServletResponse) {

    def parseRequest(request: HttpServletRequest): Tuple3[Option[JSON],Map[String, List[String]],Map[String, String]] = {

      def parseBody(request: HttpServletRequest): Option[JSON] = {
        val sBody = Source.fromInputStream(request.getInputStream, "UTF-8").getLines().mkString("\n")
        val body = if (sBody == "") {
          None
        } else {
          Some(JSON(sBody))
        }
        body
      }

      (parseBody(request),
        request.getParameterMap.toMap.mapValues(_.toList),
        request.getHeaderNames.map((h: String) => (h, request.getHeader(h))).toMap)

    }

    def setAccessControlHeaders(response: HttpServletResponse){
      response.setHeader("Access-Control-Allow-Headers","Content-Type, Accept, X-Auth-Token, X-Requested-With")
      response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
      response.setHeader("Access-Control-Max-Age","1728000")
      //response.setHeader("Access-Control-Allow-Origin", "*")
      response.setStatus(200)
    }

    def initializeResponse(response:HttpServletResponse): PrintWriter = {
      response.setContentType("application/json")
      response.setCharacterEncoding("utf-8")
      response.setHeader("Access-Control-Allow-Origin","*")
      response.getWriter
    }

    def writeResponse(r: Response, out:PrintWriter) {
      response.setStatus(r.status.id)
      if (r.body.nonEmpty) {
        val json = JSON.toJSON(r.body.get.asInstanceOf[AnyRef])
        out println json.value
      }
    }



    val initialTimeMillis = System.currentTimeMillis()

    val out = initializeResponse(response)

    try {

      if (request.getMethod == "OPTIONS") {
        setAccessControlHeaders(response)
        return
      }

      /*** TRACTAMENT DE HTTP SESSIONS ***/
      val session:HttpSession = request.getSession(true)
      //println("sessionID: "+session.getId)

      if (session.isNew){
        session.setAttribute("autenticat",false)
      }
      /*
      if (request.getRequestURI.split("/")(1) == "login"){
          val hashes = request.getQueryString.split("&")
          val user = hashes(0).split("=")(1)
          val pass = hashes(1).split("=")(1)
          println("User: "+user+" , Pass: "+pass)
          // Consultar a la BD si request.user & request.pass existeixen
          val existeix = true
          if (existeix){
              session.setAttribute("autenticat",true)
              session.setAttribute("user",user)
              writeResponse(Response(HttpStatusCode.Ok,true),out)
          }
          else{
              session.setAttribute("autenticat",false)
              writeResponse(Response(HttpStatusCode.Ok,false),out)
          }
          println("autenticat? "+session.getAttribute("autenticat"))
          return
      }
      */
      /*** AFEGIT PER FER LA REDIRECCIÓ CAP A INDEX.HTML ***/
      //println("requestURI: "+request.getRequestURI)
      if (request.getRequestURI.split("/")(1) != "api"){
        // Com avisar al client si la sessio segueix activa despres d'un "refresh"??
        getServletContext.getRequestDispatcher( "/index.html" ).forward( request, response)
        return
      }
      /*****************************************************/

      val (body, parameters, headers) = parseRequest(request)

      val r = api.service(request.getMethod,request.getRequestURI, parameters, headers, body, session)
      writeResponse(r,out)

    } catch {
      case e: Throwable => {
        response.setStatus(500)
        e.printStackTrace()
        out.println("""{"error":"Internal error"}""")
      }
    } finally {
      logRequest(request,response,initialTimeMillis)
    }
  }

  private def logRequest(request:HttpServletRequest, response:HttpServletResponse, initialTimeMillis:Long){
    println("%s %s => %s (%s ms)".format(request.getMethod,request.getRequestURI,response.getStatus,System.currentTimeMillis-initialTimeMillis))
  }

}

class Server(api:Api, port:Int) {
  val server: JettyServer = new JettyServer(port)

  val context = new ServletContextHandler(ServletContextHandler.SESSIONS)
  context.setContextPath("/")
  context.addServlet(new ServletHolder(new Servlet(api)), "/")

  val resourceHandler = new ResourceHandler
  resourceHandler.setDirectoriesListed(true)
  resourceHandler.setWelcomeFiles(Array("index.html"))
  resourceHandler.setResourceBase("src/main/docroot")

  /** DECLAREM UN SEGON RESOURCE HANDLER PER AFEGIR-LO AL CONTEXT HANDLER **
   ** I QUE PUGUI SERVIR TANT RECURSOS LOGICS COM EXISTENTS               **/
  val resourceHandlerContext = new ResourceHandler
  resourceHandlerContext.setDirectoriesListed(true)
  resourceHandlerContext.setWelcomeFiles(Array("index.html"))
  resourceHandlerContext.setResourceBase("src/main/docroot")

  context.setHandler(resourceHandlerContext)
  /*************************************************************************/

  val handlers = new HandlerList()
  handlers.setHandlers(Array(resourceHandler,context))
  server.setHandler(handlers)

  def start() {
    server.start()
  }
}
