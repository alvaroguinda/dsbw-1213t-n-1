package dsbw.enquestes

import org.bson.types.ObjectId
import dsbw.mongo.MongoDao
import java.util.Date

/** Case class that documents the document scheme in the enquesta MongoDB collection */
case class PreguntaRecord(_id:ObjectId = new ObjectId(), text:String, tipus:Int, possiblesRespostes:List[String], respostes:List[List[String]])
case class EnquestaRecord(_id:ObjectId = new ObjectId(), titol:String, inici:String, fi:String, preguntes:List[List[String]])
//Proposta de classe per a enquesta record
//case class EnquestaRecord(_id:ObjectId = new ObjectId(), titol:String, inici:String, fi:String, preguntes:List[PreguntaRecord])




class EnquestesDao(db:DB) extends MongoDao[EnquestaRecord](db.enquestes) {
}

class EnquestesRepository(dao: EnquestesDao) {

  def findById(id:ObjectId) = dao.findOneByID(id)

  def save (e:EnquestaRecord) = dao.save(e)

  //dao.save(EnquestaRecord(username="agile_jordi", name="Jordi Pradel", avatar="/img/avatar4.png"))

}

