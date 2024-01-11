import TransactionRepository from "../../application/repository/TransactionRepository";
import Transaction from "../../domain/entities/Transaction";
import DatabaseConnection from "../database/DatabaseConnection";
import ORM from "../orm/ORM";
import TransactionModel from "../orm/TransactionModel";

export default class TransactionRepositoryORNM implements TransactionRepository {
  orm: ORM

  constructor( readonly connection: DatabaseConnection ) {
    this.orm = new ORM(connection)
  }
  
  async getByRideId(rideId: string): Promise<Transaction | undefined> {
    const transactionModel = await this.orm.get(TransactionModel, "ride_id", rideId)
    return transactionModel.getEntity()
  }
  
  async save(transaction: Transaction): Promise<void> {
    const transactionModel = TransactionModel.fromEntity(transaction)
    await this.orm.save(transactionModel)
  }
}