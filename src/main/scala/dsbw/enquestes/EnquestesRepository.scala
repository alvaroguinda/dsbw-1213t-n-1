package dsbw.enquestes

import org.bson.types.ObjectId
import dsbw.mongo.MongoDao
import java.util.Date

/** Case class that documents the document scheme in the enquesta MongoDB collection */
//case class RespostaRecord(idEnquestat:String, resposta:String)
//case class PreguntaRecord(_id:String, text:String, tipus:String, possiblesRespostes:List[String], respostes:List[RespostaRecord])
//case class EnquestaRecord(_id:ObjectId = new ObjectId(), titol:String, inici:String, fi:String, preguntes:List[List[String]])
case class EnquestaRecord(_id:ObjectId = new ObjectId(), idResp: ObjectId= new ObjectId(),titol:String, inici:String, fi:String, preguntes:List[Pregunta])




class EnquestesDao(db:DB) extends MongoDao[EnquestaRecord](db.enquestes) {
}

class EnquestesRepository(dao: EnquestesDao) {

  def findById(id:ObjectId) = dao.findOneByID(id)

  def findByIdResp(id:ObjectId) = dao.findOne(Map("idResp" -> id))

  def save (e:EnquestaRecord) = dao.save(e)

  //dao.save(EnquestaRecord(username="agile_jordi", name="Jordi Pradel", avatar="/img/avatar4.png"))

}

