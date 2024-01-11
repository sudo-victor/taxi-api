import Transaction from "../../domain/entities/Transaction"
import TransactionRepository from "../repository/TransactionRepository"

export default class GetTransactionByRideId {
  constructor(readonly transactionRepository: TransactionRepository) {}

  async execute(rideId: string): Promise<Output | undefined> {
    const transaction = await this.transactionRepository.getByRideId(rideId)
    if (!transaction) return undefined
    return {
      transactionId: transaction.transactionId,
      rideId: transaction.rideId,
      amount: transaction.amount,
      date: transaction.date,
      status: transaction.getStatus(),
    }
  }
}

type Output = {
  transactionId: string;
  rideId: string;
  amount: number;
  date: Date;
  status: string;
}
