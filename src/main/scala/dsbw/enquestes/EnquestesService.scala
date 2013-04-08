package dsbw.enquestes

import org.bson.types.ObjectId
import java.util.Date

case class Enquesta(id:String, titol: String, inici: String, fi: String, preguntes:List[List[String]])
case class EnquestaID(id:String)

class EnquestesService(enquestesRepository: EnquestesRepository) {

  //private def getEnquestaById(id:ObjectId) = enquestesRepository.findById(id).map(ar=>Author(ar.name,ar.username,ar.avatar))

  //def listEnquestes = enquestesRepository.findAll.map(cr => Enquesta(getEnquestaById(cr.author).get,cr.date,cr.message))

  def getEnquesta(idAdmin:String, idEnquesta:String):Enquesta= {
		// Comprobem qui està realitzant la petició
		//val loggedUserId = sessionsRepository.findById(new ObjectId(session_token)).getOrElse(throw new HttpException(401, "Authorization required")).user_id
		// Obtenim els dos usuaris existeixin
		//val enquesta = enquestesRepository.findById(new ObjectId(idAdmin)).getOrElse(throw new HttpException(404, "User not found"))
		val enquesta = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
    new Enquesta(enquesta._id.toString(),enquesta.titol,enquesta.inici,enquesta.fi,enquesta.preguntes)
		// Comprobem que l'usuari autenticat es el follower
		//if (loggedUserId.compareTo(user._id) != 0) throw new HttpException(403, "Forbidden")
		//if (!follower.followees.exists(followee_id => true)) throw new HttpException (404, "Relation non exists")

	//	enquestesRepository.findById(enquesta_id)
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
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
			preguntes = enquestaOrigin.preguntes
		)
		enquestesRepository.save(enquestaR)
	}

	def postEnquesta(idAdmin:String, idEnquesta:String, pregunta: NovaPregunta):Enquesta= {
		val enquesta = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
			preguntes =  List(new ObjectId().toString,pregunta.tipus, pregunta.enunciat) :: enquesta.preguntes
		)
		enquestesRepository.save(enquestaR)

		val enquestaNew = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		new Enquesta(enquestaNew._id.toString(),enquestaNew.titol,enquestaNew.inici,enquestaNew.fi,enquestaNew.preguntes)
	}
}
