package dsbw.enquestes

import org.bson.types.ObjectId
import java.util.Date
import com.mongodb.casbah.commons.MongoDBList
import javax.servlet.http.HttpSession

case class Resposta(idEnquestat:String, resposta:String)
case class Pregunta(id:String, text:String, tipus:String, possiblesRespostes:List[String], respostes:List[Resposta])
// estat de l'enquesta: 0 = en creació, 1 = acabada i publicada
case class Enquesta(id:String, idResp:String, estat:Integer, titol: String, inici: String, fi: String, preguntes:List[Pregunta])
case class EnquestaID(id:String)
case class Enquestes(enquestes: Set[EnquestaRecord])
case class User (nom: String, logged: Boolean)

class EnquestesService(enquestesRepository: EnquestesRepository, usersRepository: UsersRepository) {

  def validaUser( parameters: Map[String, List[String]], session: HttpSession): Boolean = {
      val userName = parameters("user")(0)
      val pass = parameters("pass")(0)
      println("UserName: "+userName+" , Pass: "+pass)
      // Consultar a la BD si request.user & request.pass existeixen:
      val userRecord = usersRepository.findUserByName(userName)
      println("user: "+userRecord)
      if (userRecord != None){ //existeix l'usuari userName
        val user = userRecord.get.copy()
        if (user.pass == pass){ //la contrasenya es correspon
          session.setAttribute("autenticat",true)
          session.setAttribute("userID", user._id.toString())
          session.setAttribute("userName",user.nom)
          session.setAttribute("admin",user.admin)
        }
      }
      println("autenticat? "+session.getAttribute("autenticat"))
      println("admin? "+session.getAttribute("admin"))
      session.getAttribute("autenticat").asInstanceOf[Boolean]
  }

  def tancaSessio(session: HttpSession): Boolean = {
    session.invalidate()
    true
  }

  def authUser(session: HttpSession): User = {
    val logged: Boolean = session.getAttribute("autenticat").asInstanceOf[Boolean]
    var nom: String = ""
    if (logged){
      nom = session.getAttribute("userName").toString
    }
    new User(nom,logged)
  }

  //private def getEnquestaById(id:ObjectId) = enquestesRepository.findById(id).map(ar=>Author(ar.name,ar.username,ar.avatar))
  //def listEnquestes = enquestesRepository.findAll.map(cr => Enquesta(getEnquestaById(cr.author).get,cr.date,cr.message))

  def getListEnquestes(session: HttpSession):Enquestes = {
    var enquestes: Set[EnquestaRecord] = null
    if (session.getAttribute("autenticat").asInstanceOf[Boolean]){ //comprovem si l'usuari te permís per obtindre el llistat d'enq.
      if (session.getAttribute("admin").asInstanceOf[Boolean]){ //si l'user es admin retornem totes les enq. existents
        enquestes = enquestesRepository.findAll
      }
      else{ //sinó, nomes les enq. que ha creat ell mateix
        //enquestes = enquestesRepository.findAll
      }
    }
    new Enquestes(enquestes)
  }

  def getEnquesta(idAdmin:String, idEnquesta:String):Enquesta= {
      // Comprobem qui està realitzant la petició
      //val loggedUserId = sessionsRepository.findById(new ObjectId(session_token)).getOrElse(throw new HttpException(401, "Authorization required")).user_id
      // Obtenim els dos usuaris existeixin
      //val enquesta = enquestesRepository.findById(new ObjectId(idAdmin)).getOrElse(throw new HttpException(404, "User not found"))
      val enquesta = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
      if(enquesta.estat == 0){
      	new Enquesta(enquesta._id.toString(),null, enquesta.estat, enquesta.titol,enquesta.inici,enquesta.fi,enquesta.preguntes)
      }
      else new Enquesta(enquesta._id.toString(),enquesta.idResp.toString(), enquesta.estat, enquesta.titol,enquesta.inici,enquesta.fi,enquesta.preguntes)
      // Comprobem que l'usuari autenticat es el follower
      //if (loggedUserId.compareTo(user._id) != 0) throw new HttpException(403, "Forbidden")
      //if (!follower.followees.exists(followee_id => true)) throw new HttpException (404, "Relation non exists")

      //	enquestesRepository.findById(enquesta_id)
	 }

	 def getEnquestaResp(idUser:String, idEnquesta:String):Enquesta= {
		val enquesta = enquestesRepository.findByIdResp(new ObjectId(idEnquesta)).get.copy()
        new Enquesta(null,enquesta.idResp.toString(),enquesta.estat,enquesta.titol,enquesta.inici,enquesta.fi,enquesta.preguntes)
	}

	def creaEnquesta(enquesta: NovaEnquesta):EnquestaID= {
		//println(enquesta.titol)
		//println(enquesta.inici)
		//println(enquesta.fi)
		if(enquesta.titol == "") throw new HttpException(400, "El titol no pot estar en blanc")
		if(enquesta.inici == "") throw new HttpException(400, "La data inici no pot estar en blanc")
		if(enquesta.fi == "") throw new HttpException(400, "La data fi no pot estar en blanc")
		//if(enquestesRepository.findByTitol(enquesta.titol).isDefined) throw new HttpException(400,"El Titol ja existeix")
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(),
			idResp = null,
			estat = 0,
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
			preguntes = List()
		)
		enquestesRepository.save(enquestaR)
		new EnquestaID(enquestaR._id.toString())
	}

	def putEnquesta(idAdmin:String, idEnquesta:String, enquesta: NovaEnquesta){
		if(enquesta.titol == "") throw new HttpException(400, "El titol no pot estar en blanc")
		if(enquesta.inici == "") throw new HttpException(400, "La data inici no pot estar en blanc")
		if(enquesta.fi == "") throw new HttpException(400, "La data fi no pot estar en blanc")
		if(idAdmin == "")  throw new HttpException(400, "El ID no pot estar en blanc")
		if(idEnquesta == "")  throw new HttpException(400, "El ID de la enquesta no pot estar en blanc")

		val enquestaOrigin = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			idResp = null,
			estat = 0,
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
			preguntes = enquestaOrigin.preguntes
		)
		enquestesRepository.save(enquestaR)
	}

	def postPregunta(idAdmin:String, idEnquesta:String, pregunta: NovaPregunta):Enquesta= {
		if(pregunta.tipus == "") throw new HttpException(400, "El tipus no pot estar en blanc")
		if(pregunta.tipus != "Text" && pregunta.tipus != "Test" && pregunta.tipus != "Multi") throw new HttpException(400, "El tipus ha de ser Text,Test o Multi")
		if(idAdmin == "")  throw new HttpException(400, "El ID no pot estar en blanc")
		if(idEnquesta == "")  throw new HttpException(400, "El ID de la enquesta no pot estar en blanc")
	//	if(preguntes.respostes == null) throw new HttpException(400, "El tipus ha de ser Text,Test o Multi")
		val enquesta = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			idResp = null,
			estat = 0,
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
			preguntes = enquesta.preguntes ::: List(new Pregunta(new ObjectId().toString,pregunta.enunciat, pregunta.tipus, pregunta.respostes, List()))
		)
		enquestesRepository.save(enquestaR)

		val enquestaNew = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		new Enquesta(enquestaNew._id.toString(),enquestaNew.idResp.toString(),enquestaNew.estat,enquestaNew.titol,enquestaNew.inici,enquestaNew.fi,enquestaNew.preguntes)
	}

	def deletePregunta(idAdmin:String, idEnquesta:String, idPregunta:String):Enquesta={
		if(idAdmin == "")  throw new HttpException(400, "El ID no pot estar en blanc")
		if(idEnquesta == "")  throw new HttpException(400, "El ID de la enquesta no pot estar en blanc")
		if(idPregunta == "")  throw new HttpException(400, "El ID de la pregunta no pot estar en blanc")
		val enquesta = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		val preguntesn = enquesta.preguntes.filter(_.id != idPregunta)
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			idResp = null,
			estat = 0,
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
			preguntes =  preguntesn
		)
		enquestesRepository.save(enquestaR)

    val enquestaNew = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
    new Enquesta(enquestaNew._id.toString(),enquestaNew.idResp.toString(),enquestaNew.estat,enquestaNew.titol,enquestaNew.inici,enquestaNew.fi,enquestaNew.preguntes)
	}

	def putPregunta(idAdmin:String, idEnquesta:String, idPregunta:String, pregunta:NovaPregunta){
		/*val enquestaOrigin = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
			preguntes = enquestaOrigin.preguntes
		)
		enquestesRepository.save(enquestaR)*/
	}
	def patchEnquesta(idAdmin:String, idEnquesta:String, estat:EstatEnquesta){
		if(idAdmin == "")  throw new HttpException(400, "El ID no pot estar en blanc")
		if(idEnquesta == "")  throw new HttpException(400, "El ID de la enquesta no pot estar en blanc")
		val enquestaOrigin = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		var idr = new ObjectId()
		if(estat.ident != 1) idr = null
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			idResp = idr,
			estat = estat.ident,
			titol = enquestaOrigin.titol,
			inici = enquestaOrigin.inici,
			fi = enquestaOrigin.fi,
			preguntes = enquestaOrigin.preguntes
		)
		enquestesRepository.save(enquestaR)
	}

	def respondreEnquesta(idUser: String, idEnquesta: String, respostes: Respostes){
	
	}
}
