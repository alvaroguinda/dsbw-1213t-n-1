package dsbw.chirps

import org.bson.types.ObjectId
import java.util.Date

case class Author(name:String, username:String, avatar:String)

case class Chirp(author:Author, date:Date, message:String)

class ChirpsService(chirpsRepository: ChirpsRepository,chirpersRepository: ChirpersRepository) {

  private def getChirperById(id:ObjectId) = chirpersRepository.findById(id).map(ar=>Author(ar.name,ar.username,ar.avatar))

  def listChirps = chirpsRepository.findAll.map(cr => Chirp(getChirperById(cr.author).get,cr.date,cr.message))

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

	def novaEnquesta() {
		print("Hola")
	}
}
