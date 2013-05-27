package dsbw.enquestes

import org.bson.types.ObjectId
import java.util.Date
import com.mongodb.casbah.commons.MongoDBList
import javax.servlet.http.HttpSession
import com.github.nscala_time.time.Imports._

case class Resposta(idEnquestat:String, resposta:String)
case class Pregunta(id:String, text:String, tipus:String, possiblesRespostes:List[String], respostes:List[Resposta])
//case class PreguntaOrdre(preguntes:List[Pregunta])
// estat de l'enquesta: 0 = en creació, 1 = acabada i publicada
case class Enquesta(id:String, idResp:String, estat:Int, titol: String, inici: String, fi: String,finalitzades:List[String], preguntes:List[Pregunta])
case class EnquestaID(id:String)
case class Enquestes(enquestes: Set[EnquestaRecord])
case class User (nom: String, logged: Boolean)
case class EnquestaUser(idResp:String, idUser:String)
case class RespostaPregunta(pregunta:String, respostes:List[String])
case class RespostaUser(respostes:List[RespostaPregunta])

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

  def registreUser( parameters: Map[String, List[String]]) {
    val userName = parameters("user")(0)
    val passWord = parameters("pass")(0)
    println("UserName: "+userName+" , Pass: "+passWord)
    val userNew = usersRepository.findUserByName(userName)
    println("user: "+userNew)
    if (userNew == None){
        val userNew = new UserRecord(
          _id = new ObjectId(),
          nom = userName,
          pass = passWord,
          admin = false
        )
        //usersRepository.save(userNew)
    }
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
      	new Enquesta(enquesta._id.toString(),null, enquesta.estat, enquesta.titol,enquesta.inici,enquesta.fi,enquesta.finalitzades,enquesta.preguntes)
      }
      else new Enquesta(enquesta._id.toString(),enquesta.idResp.toString(), enquesta.estat, enquesta.titol,enquesta.inici,enquesta.fi,enquesta.finalitzades,enquesta.preguntes)
      // Comprobem que l'usuari autenticat es el follower
      //if (loggedUserId.compareTo(user._id) != 0) throw new HttpException(403, "Forbidden")
      //if (!follower.followees.exists(followee_id => true)) throw new HttpException (404, "Relation non exists")

      //	enquestesRepository.findById(enquesta_id)
	 }

	 def getEnquestaResp(idUser:String, idEnquesta:String):Enquesta= {
		val enquesta = enquestesRepository.findByIdResp(new ObjectId(idEnquesta)).get.copy()
        new Enquesta(null,enquesta.idResp.toString(),enquesta.estat,enquesta.titol,enquesta.inici,enquesta.fi,enquesta.finalitzades,enquesta.preguntes)
	}

	def creaEnquesta(enquesta: NovaEnquesta):EnquestaID= {
		//println(enquesta.titol)
		//println(enquesta.inici)
		//println(enquesta.fi)
		if(enquesta.titol == "") throw new HttpException(400, "El titol no pot estar en blanc")
		//if(enquesta.inici == "") throw new HttpException(400, "La data inici no pot estar en blanc")
		if(enquesta.fi == "") throw new HttpException(400, "La data fi no pot estar en blanc")
		//if(enquestesRepository.findByTitol(enquesta.titol).isDefined) throw new HttpException(400,"El Titol ja existeix")
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(),
			idResp = null,
			estat = 0,
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
      finalitzades = List(),
			preguntes = List()
		)
		enquestesRepository.save(enquestaR)
    println(enquestaR.toString)
		new EnquestaID(enquestaR._id.toString())
	}

	def putEnquesta(idAdmin:String, idEnquesta:String, enquesta: NovaEnquesta){
		if(enquesta.titol == "") throw new HttpException(400, "El titol no pot estar en blanc")
		//if(enquesta.inici == "") throw new HttpException(400, "La data inici no pot estar en blanc")
		if(enquesta.fi == "") throw new HttpException(400, "La data fi no pot estar en blanc")
		if(idAdmin == "")  throw new HttpException(400, "El ID no pot estar en blanc")
		if(idEnquesta == "")  throw new HttpException(400, "El ID de la enquesta no pot estar en blanc")

		val enquestaOrigin = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()

    if(enquestaOrigin.estat > 1) throw new HttpException(400, "La enquesta ja no pot ser modificada")
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			idResp = null,
			estat = 0,
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
      finalitzades = enquestaOrigin.finalitzades,
			preguntes = enquestaOrigin.preguntes
		)
		enquestesRepository.save(enquestaR)
	}

  def getPregunta(idAdmin:String, idEnquesta:String, idPregunta: String):Pregunta= {
    val enquesta = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
    val posPreg = enquesta.preguntes.indexWhere(_.id == idPregunta)

    new Pregunta(enquesta.preguntes(posPreg).id, enquesta.preguntes(posPreg).text, enquesta.preguntes(posPreg).tipus, enquesta.preguntes(posPreg).possiblesRespostes, enquesta.preguntes(posPreg).respostes)

  }


	def postPregunta(idAdmin:String, idEnquesta:String, pregunta: NovaPregunta):Enquesta= {
		if(pregunta.tipus == "") throw new HttpException(400, "El tipus no pot estar en blanc")
		if(pregunta.tipus != "Text" && pregunta.tipus != "Test" && pregunta.tipus != "Multi") throw new HttpException(400, "El tipus ha de ser Text,Test o Multi")
		if(idAdmin == "")  throw new HttpException(400, "El ID no pot estar en blanc")
		if(idEnquesta == "")  throw new HttpException(400, "El ID de la enquesta no pot estar en blanc")
	//	if(preguntes.respostes == null) throw new HttpException(400, "El tipus ha de ser Text,Test o Multi")
		val enquesta = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
    if(enquesta.estat > 1) throw new HttpException(400, "La enquesta ja no pot ser modificada")
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			idResp = null,
			estat = 0,
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
      finalitzades = enquesta.finalitzades,
			preguntes = enquesta.preguntes ::: List(new Pregunta(new ObjectId().toString,pregunta.enunciat, pregunta.tipus, pregunta.respostes, List()))
		)
		enquestesRepository.save(enquestaR)

		val enquestaNew = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
		new Enquesta(enquestaNew._id.toString(),enquestaNew.idResp.toString(),enquestaNew.estat,enquestaNew.titol,enquestaNew.inici,enquestaNew.fi,enquestaNew.finalitzades,enquestaNew.preguntes)
	}

	def deletePregunta(idAdmin:String, idEnquesta:String, idPregunta:String):Enquesta={
		if(idAdmin == "")  throw new HttpException(400, "El ID no pot estar en blanc")
		if(idEnquesta == "")  throw new HttpException(400, "El ID de la enquesta no pot estar en blanc")
		if(idPregunta == "")  throw new HttpException(400, "El ID de la pregunta no pot estar en blanc")
		val enquesta = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
    if(enquesta.estat > 1) throw new HttpException(400, "La enquesta ja no pot ser modificada")
		val preguntesn = enquesta.preguntes.filter(_.id != idPregunta)
		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			idResp = null,
			estat = 0,
			titol = enquesta.titol,
			inici = enquesta.inici,
			fi = enquesta.fi,
			preguntes =  preguntesn,
      finalitzades = enquesta.finalitzades
		)
		enquestesRepository.save(enquestaR)

    val enquestaNew = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
    new Enquesta(enquestaNew._id.toString(),enquestaNew.idResp.toString(),enquestaNew.estat,enquestaNew.titol,enquestaNew.inici,enquestaNew.fi,enquestaNew.finalitzades,enquestaNew.preguntes)
	}

	def putPregunta(idAdmin:String, idEnquesta:String, idPregunta:String, pregunta:NovaPregunta):Enquesta={
    if(idAdmin == "")  throw new HttpException(400, "El ID no pot estar en blanc")
    if(idEnquesta == "")  throw new HttpException(400, "El ID de la enquesta no pot estar en blanc")
    val enquestaOrigin = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
    if(enquestaOrigin.estat > 1) throw new HttpException(400, "La enquesta ja no pot ser modificada")
    val posPreg = enquestaOrigin.preguntes.indexWhere(_.id == idPregunta)
    val novaPreg = new Pregunta(
      id = idPregunta,
      text = pregunta.enunciat,
      tipus = pregunta.tipus,
      possiblesRespostes = pregunta.respostes,
      respostes = List()
    )
    var preguntesN = enquestaOrigin.preguntes
    if(posPreg == 0){ preguntesN = List(novaPreg):::enquestaOrigin.preguntes.slice(1,enquestaOrigin.preguntes.length) }
    else if(posPreg == enquestaOrigin.preguntes.length-1){ preguntesN = enquestaOrigin.preguntes.slice(0,posPreg):::List(novaPreg) }
    else{ preguntesN = enquestaOrigin.preguntes.slice(0,posPreg):::List(novaPreg):::enquestaOrigin.preguntes.slice(posPreg+1,enquestaOrigin.preguntes.length) }


    val enquestaR = new EnquestaRecord (
      _id = new ObjectId(idEnquesta),
      idResp = null,
      estat = 0,
      titol = enquestaOrigin.titol,
      inici = enquestaOrigin.inici,
      fi = enquestaOrigin.fi,
      finalitzades = enquestaOrigin.finalitzades,
      preguntes = preguntesN
    )
    enquestesRepository.save(enquestaR)

    val enquestaNew = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
    new Enquesta(enquestaNew._id.toString(),enquestaNew.idResp.toString(),enquestaNew.estat,enquestaNew.titol,enquestaNew.inici,enquestaNew.fi,enquestaNew.finalitzades,enquestaNew.preguntes)
	}


  def putOrdrePregunta(idAdmin:String, idEnquesta:String, preguntes: Preguntes){
    if(idAdmin == "")  throw new HttpException(400, "El ID no pot estar en blanc")
    if(idEnquesta == "")  throw new HttpException(400, "El ID de la enquesta no pot estar en blanc")
    val enquestaOrigin = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
    if(enquestaOrigin.estat > 1) throw new HttpException(400, "La enquesta ja no pot ser modificada")

    var preguntesO:List[Pregunta] = List()
    preguntes.preguntes.foreach{p =>
      preguntesO = preguntesO ::: List(new Pregunta(p.id,p.enunciat,p.tipus,p.respostes,List()))
    }

    val enquestaR = new EnquestaRecord (
      _id = new ObjectId(idEnquesta),
      idResp = null,
      estat = 0,
      titol = enquestaOrigin.titol,
      inici = enquestaOrigin.inici,
      fi = enquestaOrigin.fi,
      finalitzades = enquestaOrigin.finalitzades,
      preguntes = preguntesO
    )
    enquestesRepository.save(enquestaR)
  }

	def patchEnquesta(idAdmin:String, idEnquesta:String, estat:EstatEnquesta):Enquesta= {
		if(idAdmin == "")  throw new HttpException(400, "El ID no pot estar en blanc")
    if(idEnquesta == "")  throw new HttpException(400, "El ID de la enquesta no pot estar en blanc")
		val enquestaOrigin = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
    if(enquestaOrigin.preguntes.isEmpty)  throw new HttpException(400, "No es pot publicar una enquesta sense preguntes")
		var idr = new ObjectId()
		if(estat.ident != 1) idr = null

    var dataInici = enquestaOrigin.inici
    if(dataInici == "") {
      dataInici = DateTime.now.dayOfMonth.get + "-" + DateTime.now.monthOfYear.get + "-" + DateTime.now.year.get
    }

		val enquestaR = new EnquestaRecord (
			_id = new ObjectId(idEnquesta),
			idResp = idr,
			estat = estat.ident,
			titol = enquestaOrigin.titol,
			inici = dataInici,
			fi = enquestaOrigin.fi,
			preguntes = enquestaOrigin.preguntes,
      finalitzades = enquestaOrigin.finalitzades
		)
		enquestesRepository.save(enquestaR)

    //new Enquesta(idEnquesta, enquestaR.idResp.toString(), enquestaR.estat, enquestaR.titol, enquestaR.inici, enquestaR.fi, enquestaR.preguntes)

    val enquestaNew = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
    new Enquesta(enquestaNew._id.toString(),enquestaNew.idResp.toString(),enquestaNew.estat,enquestaNew.titol,enquestaNew.inici,enquestaNew.fi,enquestaNew.finalitzades,enquestaNew.preguntes)
	}

	def postRespondreEnquesta(idUser: String, idEnquesta: String, respostes: Respostes):EnquestaUser={
		val enquesta = enquestesRepository.findByIdResp(new ObjectId(idEnquesta)).get.copy()
        //new Enquesta(null,enquesta.idResp.toString(),enquesta.estat,enquesta.titol,enquesta.inici,enquesta.fi,enquesta.preguntes)


        var id_user = idUser
        if(idUser == "0") {
          var _idUser = new ObjectId()
          id_user = _idUser.toString()
        }

        //println(id_user)
        //println(respostes)

        //for (r <- respostes) println(r)
        var preguntesE:List[Pregunta] = List()
        var respostesP:List[Resposta] = List()

        //respostes.respostes.foreach(r => println(r))

        enquesta.preguntes.foreach{p =>
        	//preguntesE = List(p) ::: preguntesE
        	respostesP = p.respostes
          respostes.respostes.foreach{r => 
        		if (p.id == r.apply(0)) {
        			respostesP = respostesP ::: List(new Resposta(id_user,r.apply(1)))
        		} 
        	}

        	var preguntaR = new Pregunta(
        		id = p.id,
        		text = p.text,
        		tipus = p.tipus,
        		possiblesRespostes = p.possiblesRespostes,
        		respostes = respostesP
        		)
        	preguntesE =  preguntesE ::: List(preguntaR) //preguntesE.patch(i,preguntaR
        }
//case class EnquestaRecord(_id:ObjectId = new ObjectId(), idResp: ObjectId= new ObjectId(),estat:Integer,titol:String, inici:String, fi:String, preguntes:List[Pregunta])
//case class Pregunta(id:String, text:String, tipus:String, possiblesRespostes:List[String], respostes:List[Resposta])
        val enquestaR = EnquestaRecord (
        	_id = enquesta._id,
        	idResp = enquesta.idResp,
        	estat = 2,
        	titol = enquesta.titol,
        	inici = enquesta.inici,
        	fi = enquesta.fi,
        	preguntes = preguntesE,
          finalitzades = enquesta.finalitzades
        	)
        println(enquestaR)
        enquestesRepository.save(enquestaR)

        new EnquestaUser(enquestaR.idResp.toString(),id_user)
	}

  def putRespondreEnquesta(idUser: String, idEnquesta: String, respostes: Respostes):EnquestaUser={
    val enquesta = enquestesRepository.findByIdResp(new ObjectId(idEnquesta)).get.copy()
        var id_user = idUser
        if(idUser == "0") {
          var _idUser = new ObjectId()
          id_user = _idUser.toString()
        }

        //println(id_user)
        //println(respostes)
        //for (r <- respostes) println(r)
        var preguntesE:List[Pregunta] = List()
        var respostesP:List[Resposta] = List()

        //respostes.respostes.foreach(r => println(r))

        enquesta.preguntes.foreach{p =>
          //preguntesE = List(p) ::: preguntesE
          respostesP = p.respostes.filter(_.idEnquestat != id_user)
          respostes.respostes.foreach{r => 
            if (p.id == r.apply(0)) {
              respostesP = respostesP ::: List(new Resposta(id_user,r.apply(1)))
            } 
          }

          var preguntaR = new Pregunta(
            id = p.id,
            text = p.text,
            tipus = p.tipus,
            possiblesRespostes = p.possiblesRespostes,
            respostes = respostesP
            )
          preguntesE =  preguntesE ::: List(preguntaR) //preguntesE.patch(i,preguntaR
        }
//case class EnquestaRecord(_id:ObjectId = new ObjectId(), idResp: ObjectId= new ObjectId(),estat:Integer,titol:String, inici:String, fi:String, preguntes:List[Pregunta])
//case class Pregunta(id:String, text:String, tipus:String, possiblesRespostes:List[String], respostes:List[Resposta])
        val enquestaR = EnquestaRecord (
          _id = enquesta._id,
          idResp = enquesta.idResp,
          estat = 2,
          titol = enquesta.titol,
          inici = enquesta.inici,
          fi = enquesta.fi,
          preguntes = preguntesE,
          finalitzades = enquesta.finalitzades
          )
        enquestesRepository.save(enquestaR)

        new EnquestaUser(enquestaR.idResp.toString(),id_user)
  }

  def putRespondreEnquestaFinalPut(idUser: String, idEnquesta: String, respostes: Respostes):EnquestaUser={
    val enquesta = enquestesRepository.findByIdResp(new ObjectId(idEnquesta)).get.copy()
        var id_user = idUser
        if(idUser == "0") {
          var _idUser = new ObjectId()
          id_user = _idUser.toString()
        }

        //println(id_user)
        //for (r <- respostes) println(r)
        var preguntesE:List[Pregunta] = List()
        var respostesP:List[Resposta] = List()

        //respostes.respostes.foreach(r => println(r))

        enquesta.preguntes.foreach{p =>
          //preguntesE = List(p) ::: preguntesE
          respostesP = p.respostes.filter(_.idEnquestat != id_user)
          respostes.respostes.foreach{r => 
            if (p.id == r.apply(0)) {
              respostesP = respostesP ::: List(new Resposta(id_user,r.apply(1)))
            } 
          }

          var preguntaR = new Pregunta(
            id = p.id,
            text = p.text,
            tipus = p.tipus,
            possiblesRespostes = p.possiblesRespostes,
            respostes = respostesP
            )
          preguntesE =  preguntesE ::: List(preguntaR) //preguntesE.patch(i,preguntaR
        }
//case class EnquestaRecord(_id:ObjectId = new ObjectId(), idResp: ObjectId= new ObjectId(),estat:Integer,titol:String, inici:String, fi:String, preguntes:List[Pregunta])
//case class Pregunta(id:String, text:String, tipus:String, possiblesRespostes:List[String], respostes:List[Resposta])
        val enquestaR = EnquestaRecord (
          _id = enquesta._id,
          idResp = enquesta.idResp,
          estat = 2,
          titol = enquesta.titol,
          inici = enquesta.inici,
          fi = enquesta.fi,
          preguntes = preguntesE,
          finalitzades = enquesta.finalitzades ::: List(idUser)
          )
        enquestesRepository.save(enquestaR)

        new EnquestaUser(enquestaR.idResp.toString(),id_user)
  }
  def putRespondreEnquestaFinalPost(idUser: String, idEnquesta: String, respostes: Respostes):EnquestaUser={
    val enquesta = enquestesRepository.findByIdResp(new ObjectId(idEnquesta)).get.copy()
        var id_user = idUser
        if(idUser == "0") {
          var _idUser = new ObjectId()
          id_user = _idUser.toString()
        }
        println(Respostes)
        //println(id_user)
        //for (r <- respostes) println(r)
        var preguntesE:List[Pregunta] = List()
        var respostesP:List[Resposta] = List()

        //respostes.respostes.foreach(r => println(r))

        enquesta.preguntes.foreach{p =>
          //preguntesE = List(p) ::: preguntesE
          respostesP = p.respostes.filter(_.idEnquestat != id_user)
          respostes.respostes.foreach{r => 
            if (p.id == r.apply(0)) {
              respostesP = respostesP ::: List(new Resposta(id_user,r.apply(1)))
            } 
          }

          var preguntaR = new Pregunta(
            id = p.id,
            text = p.text,
            tipus = p.tipus,
            possiblesRespostes = p.possiblesRespostes,
            respostes = respostesP
            )
          preguntesE =  preguntesE ::: List(preguntaR) //preguntesE.patch(i,preguntaR
        }
//case class EnquestaRecord(_id:ObjectId = new ObjectId(), idResp: ObjectId= new ObjectId(),estat:Integer,titol:String, inici:String, fi:String, preguntes:List[Pregunta])
//case class Pregunta(id:String, text:String, tipus:String, possiblesRespostes:List[String], respostes:List[Resposta])
        val enquestaR = EnquestaRecord (
          _id = enquesta._id,
          idResp = enquesta.idResp,
          estat = 2,
          titol = enquesta.titol,
          inici = enquesta.inici,
          fi = enquesta.fi,
          preguntes = preguntesE,
          finalitzades = enquesta.finalitzades ::: List(idUser)
          )
        enquestesRepository.save(enquestaR)

        new EnquestaUser(enquestaR.idResp.toString(),id_user)
  }

	def respostesUser(idUser: String, idEnquesta: String):RespostaUser={
		val enquesta = enquestesRepository.findById(new ObjectId(idEnquesta)).get.copy()
        var respostes1:List[RespostaPregunta] = List()
        enquesta.preguntes.foreach{p =>
        	//preguntesE = List(p) ::: preguntesE
        	var resposta1:List[String] = List()
        	p.respostes.foreach{r => 
        		if (r.idEnquestat == idUser) {
        			resposta1 = resposta1 ::: List(r.resposta)
        		} 
        	}
        	val respostaR1 = RespostaPregunta(
        		pregunta = p.text,
        		respostes = resposta1
        	)
        	respostes1 = respostes1 ::: List(respostaR1)
        }
//case class EnquestaRecord(_id:ObjectId = new ObjectId(), idResp: ObjectId= new ObjectId(),estat:Integer,titol:String, inici:String, fi:String, preguntes:List[Pregunta])
//case class Pregunta(id:String, text:String, tipus:String, possiblesRespostes:List[String], respostes:List[Resposta])
        
        
        new RespostaUser(respostes1)
	}
	
}
