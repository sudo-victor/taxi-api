import { randomUUID } from "node:crypto"
import GetAccount from "../src/application/usecase/GetAccount";
import Signup from "../src/application/usecase/Signup";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import RequestRide from "../src/application/usecase/RequestRide";
import GetRide from "../src/application/usecase/GetRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let database: DatabaseConnection;

beforeEach(() => {
	database = new PgPromiseAdapter()
	const accountRepository = new AccountRepositoryDatabase(database)
	const rideRepository = new RideRepositoryDatabase()
	const positionRepository = new PositionRepositoryDatabase(database)
	const logger = new LoggerConsole()
	signup = new Signup(accountRepository, logger)
	getAccount = new GetAccount(accountRepository)
	requestRide = new RequestRide(rideRepository, accountRepository, logger)
	getRide = new GetRide(rideRepository, positionRepository, logger)
})

afterEach(async () => {
	await database.close()
})


test("Deve solicitar uma corrida", async function () {
	const inputSignup = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup)
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		"fromLat": 37.7749,
		"fromLong": -122.4194,
		"toLat": 34.0522,
		"toLong": -118.2437
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide)
	expect(outputRequestRide.rideId).toBeDefined()
	const outputGetRide = await getRide.execute(outputRequestRide.rideId)
	expect(outputGetRide.status).toBe("requested")
})

test("Nao deve poder solicitar uma corrida se a conta nao for de um passageiro", async function () {
	const inputSignup = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isPassenger: false,
		isDriver: true,
		carPlate: "AAA9999",
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup)
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		"fromLat": 37.7749,
		"fromLong": -122.4194,
		"toLat": 34.0522,
		"toLong": -118.2437
	}
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Only passengers can request a ride"))
})

test("Nao deve poder solicitar uma corrida se o passageiro já tiver uma corrida em andamento", async function () {
	const inputSignup = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup)
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		"fromLat": 37.7749,
		"fromLong": -122.4194,
		"toLat": 34.0522,
		"toLong": -118.2437
	}
	await requestRide.execute(inputRequestRide)
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Passenger has an active ride"))
})

test("Nao deve poder solicitar uma corrida se o passageiro nao existir", async function () {
	const inputRequestRide = {
		passengerId: randomUUID(),
		"fromLat": 37.7749,
		"fromLong": -122.4194,
		"toLat": 34.0522,
		"toLong": -118.2437
	}
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Passenger does not exists"))
})
