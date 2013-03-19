package dsbw.chirps

import org.bson.types.ObjectId
import java.util.Date

case class Author(name:String, username:String, avatar:String)

case class Chirp(id:String, author:Author, date:Date, message:String)
case class Enquesta(id:String, titol: String, inici: String, fi: String)

class ChirpsService(chirpsRepository: ChirpsRepository,chirpersRepository: ChirpersRepository) {

  //private def getChirperById(id:ObjectId) = chirpersRepository.findById(id).map(ar=>Author(ar.name,ar.username,ar.avatar))

  //def listChirps = chirpsRepository.findAll.map(cr => Chirp(getChirperById(cr.author).get,cr.date,cr.message))

  def getEnquesta(idAdmin:String, idEnquesta:String) {
		// Comprobem qui està realitzant la petició
		//val loggedUserId = sessionsRepository.findById(new ObjectId(session_token)).getOrElse(throw new HttpException(401, "Authorization required")).user_id
		// Obtenim els dos usuaris existeixin
		//val enquesta = chirpersRepository.findById(new ObjectId(idAdmin)).getOrElse(throw new HttpException(404, "User not found"))
		val enquesta_id = chirpersRepository.findById(new ObjectId(idEnquesta)).getOrElse(throw new Exception( "User not found"))._id
		// Comprobem que l'usuari autenticat es el follower
		//if (loggedUserId.compareTo(user._id) != 0) throw new HttpException(403, "Forbidden")
		//if (!follower.followees.exists(followee_id => true)) throw new HttpException (404, "Relation non exists")
		
		chirpersRepository.findById(enquesta_id)
	}

	def creaEnquesta(enquesta: NovaEnquesta) {
		println(enquesta.titol)
		println(enquesta.inici)
		println(enquesta.fi)
		//if(enquesta.titol == "") throw new Exception("El titol no pot estar en blanc")
		//if(user.inici == "") throw new HttpException(400, "La data inici no pot estar en blanc")
		//if(user.fi == "") throw new HttpException(400, "La data fi no pot estar en blanc")
		//if(chirpersRepository.findByTitol(enquesta.titol).isDefined) throw new HttpException(400,"El Titol ja existeix")
		
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(), 
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi
		)
		chirpersRepository.save(enquestaR)
	}
}
