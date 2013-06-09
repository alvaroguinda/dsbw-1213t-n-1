package dsbw.enquestes

import org.bson.types.ObjectId
import dsbw.mongo.MongoDao

/** Case class that documents the document scheme in the enquesta MongoDB collection */
case class UserRecord(_id:ObjectId = new ObjectId(), nom:String, pass:String, admin:Boolean)




class UsersDao(db:DB) extends MongoDao[UserRecord](db.users) {
}

class UsersRepository(dao: UsersDao) {

  def findUserByName(userName: String) = dao.findOne(Map("nom" -> userName))

  def save(u:UserRecord) = dao.save(u)

}