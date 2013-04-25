package dsbw.enquestes

import org.bson.types.ObjectId
import java.util.Date
import com.mongodb.casbah.commons.MongoDBList
import javax.servlet.http.HttpSession

case class Resposta(idEnquestat:String, resposta:String)
case class Pregunta(id:String, text:String, tipus:String, possiblesRespostes:List[String], respostes:List[Resposta])
case class Enquesta(id:String, idResp:String, titol: String, inici: String, fi: String, preguntes:List[Pregunta])
case class EnquestaID(id:String)
case class Enquestes(enquestes: Set[EnquestaRecord])

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
          new Enquesta(enquesta._id.toString(),enquesta.idResp.toString(),enquesta.titol,enquesta.inici,enquesta.fi,enquesta.preguntes)
      // Comprobem que l'usuari autenticat es el follower
      //if (loggedUserId.compareTo(user._id) != 0) throw new HttpException(403, "Forbidden")
      //if (!follower.followees.exists(followee_id => true)) throw new HttpException (404, "Relation non exists")

      //	enquestesRepository.findById(enquesta_id)
	 }

	 def getEnquestaResp(idUser:String, idEnquesta:String):Enquesta= {
		val enquesta = enquestesRepository.findByIdResp(new ObjectId(idEnquesta)).get.copy()
        new Enquesta(enquesta._id.toString(),enquesta.idResp.toString(),enquesta.titol,enquesta.inici,enquesta.fi,enquesta.preguntes)
	}

	def creaEnquesta(enquesta: NovaEnquesta):EnquestaID= {
		//println(enquesta.titol)
		//println(enquesta.inici)
		//println(enquesta.fi)
		//if(enquesta.titol == "") throw new Exception("El titol no pot estar en blanc")
		//if(user.inici == "") throw new HttpException(400, "La data inici no pot estar en blanc")
		//if(user.fi == "") throw new HttpException(400, "La data fi no pot estar en blanc")
		//if(enquestesRepository.findByTitol(enquesta.titol).isDefined) throw new HttpException(400,"El Titol ja existeix")
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(),
			idResp = new ObjectId(),
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
			preguntes = List()
		)
		enquestesRepository.save(enquestaR)
		new EnquestaID(enquestaR._id.toString())
	}

	def putEnquesta(idAdmin:String, idEnquesta:String, enquesta: NovaEnquesta){
		val enquestaOrigin = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			idResp = enquestaOrigin.idResp,
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
			preguntes = enquestaOrigin.preguntes
		)
		enquestesRepository.save(enquestaR)
	}

	def postPregunta(idAdmin:String, idEnquesta:String, pregunta: NovaPregunta):Enquesta= {
		val enquesta = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			idResp = enquesta.idResp,
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
			preguntes = enquesta.preguntes ::: List(new Pregunta(new ObjectId().toString,pregunta.enunciat, pregunta.tipus, pregunta.respostes, List()))
		)
		enquestesRepository.save(enquestaR)

		val enquestaNew = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		new Enquesta(enquestaNew._id.toString(),enquestaNew.idResp.toString(),enquestaNew.titol,enquestaNew.inici,enquestaNew.fi,enquestaNew.preguntes)
	}

	def deletePregunta(idAdmin:String, idEnquesta:String, idPregunta:String){
		val enquesta = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		val preguntesn = enquesta.preguntes.filter(_.id != idPregunta)
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			idResp = enquesta.idResp,
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
			preguntes =  preguntesn
		)
		enquestesRepository.save(enquestaR)
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
}
