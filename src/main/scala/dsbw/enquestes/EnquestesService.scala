package dsbw.enquestes

import org.bson.types.ObjectId
import java.util.Date
import com.mongodb.casbah.commons.MongoDBList

case class Enquesta(id:String, idResp:String, titol: String, inici: String, fi: String, preguntes:List[List[String]])
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
        new Enquesta(enquesta._id.toString(),enquesta.idResp.toString(),enquesta.titol,enquesta.inici,enquesta.fi,enquesta.preguntes)
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
		var enquesta = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		/*
		val builder = MongoDBList.newBuilder
		builder += List("foo", "bar")
		builder += List("bar", "foo")
		val nwlist= builder.result
		nwlist.foreach(e =>
			println(e)
			)
		
		enquesta.preguntes.foreach( e=>
			println("1")
			)
		//builder += List(new ObjectId().toString,
		.tipus, pregunta.enunciat)
		
		var preguntesN = builder.result
		*/
		var enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			idResp = enquesta.idResp,
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
			preguntes = (List(new ObjectId().toString,pregunta.tipus, pregunta.enunciat) :: enquesta.preguntes.reverse).reverse
		)
		enquestesRepository.save(enquestaR)

		val enquestaNew = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		new Enquesta(enquestaNew._id.toString(),enquestaNew.idResp.toString(),enquestaNew.titol,enquestaNew.inici,enquestaNew.fi,enquestaNew.preguntes)
	}

	def deletePregunta(idAdmin:String, idEnquesta:String, idPregunta:String){
		/*val enquesta = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		//println(enquesta.preguntes)
		var ret = List[List[String]]()
		var i = 0
		while(i < enquesta.preguntes.length){

			println(enquesta.preguntes.apply(i)
			println("Hola")
			println(enquesta.preguntes.apply(i).apply(0))
			val ant: List[String] = List(enquesta.preguntes.apply(i).apply(0))
			println(ant)
			println("Hola2")
			if(!ant.apply(0).equals(idPregunta)){
				println("Hola3")
				ret ::= ant
			}
		}
		println("llega")
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
			preguntes =  ret
		)
		enquestesRepository.save(enquestaR)*/
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
