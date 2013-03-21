package dsbw.enquestes

import org.bson.types.ObjectId
import java.util.Date

case class Enquesta(id:String, titol: String, inici: String, fi: String)

class EnquestesService(enquestesRepository: EnquestesRepository) {

  //private def getEnquestaById(id:ObjectId) = enquestesRepository.findById(id).map(ar=>Author(ar.name,ar.username,ar.avatar))

  //def listEnquestes = enquestesRepository.findAll.map(cr => Enquesta(getEnquestaById(cr.author).get,cr.date,cr.message))

  def getEnquesta(idAdmin:String, idEnquesta:String) {
		// Comprobem qui està realitzant la petició
		//val loggedUserId = sessionsRepository.findById(new ObjectId(session_token)).getOrElse(throw new HttpException(401, "Authorization required")).user_id
		// Obtenim els dos usuaris existeixin
		//val enquesta = enquestesRepository.findById(new ObjectId(idAdmin)).getOrElse(throw new HttpException(404, "User not found"))
		val enquesta_id = enquestesRepository.findById(new ObjectId(idEnquesta)).getOrElse(throw new Exception( "User not found"))._id
		// Comprobem que l'usuari autenticat es el follower
		//if (loggedUserId.compareTo(user._id) != 0) throw new HttpException(403, "Forbidden")
		//if (!follower.followees.exists(followee_id => true)) throw new HttpException (404, "Relation non exists")
    println(new ObjectId(idEnquesta))
		enquestesRepository.findById(enquesta_id)
	}

	def creaEnquesta(enquesta: NovaEnquesta) {
		println(enquesta.titol)
		println(enquesta.inici)
		println(enquesta.fi)
		//if(enquesta.titol == "") throw new Exception("El titol no pot estar en blanc")
		//if(user.inici == "") throw new HttpException(400, "La data inici no pot estar en blanc")
		//if(user.fi == "") throw new HttpException(400, "La data fi no pot estar en blanc")
		//if(enquestesRepository.findByTitol(enquesta.titol).isDefined) throw new HttpException(400,"El Titol ja existeix")
		
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(),
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi
		)
		enquestesRepository.save(enquestaR)
	}
}
