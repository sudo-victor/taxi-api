import crypto from "crypto"
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter"
import TransactionRepositoryORM from "../src/infra/repository/TransactionRepositoryORM"
import ProcessPayment from "../src/application/usecase/ProcessPayment"
import GetTransactionByRideId from "../src/application/usecase/GetTransactionByRideId"
import Transaction from "../src/domain/entities/Transaction"

test("Deve processar um pagamento", async function() {
  const connection = new PgPromiseAdapter()
  const transactionRepository = new TransactionRepositoryORM(connection)
  const processPayment = new ProcessPayment(transactionRepository)
  const rideId = crypto.randomUUID()
  const inputProcessPayment = {
    rideId,
    creditCardToken: "123456789",
    amount: 1000
  }
  await processPayment.execute(inputProcessPayment)
  const getTransactionByRideId = new GetTransactionByRideId(transactionRepository)
  const output = await getTransactionByRideId.execute(rideId) as any
  expect(output.rideId).toBe(rideId)
  expect(output.status).toBe("paid")
  await connection.close()
})