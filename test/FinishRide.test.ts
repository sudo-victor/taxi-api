import GetAccount from "../src/application/usecase/GetAccount";
import Signup from "../src/application/usecase/Signup";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import RequestRide from "../src/application/usecase/RequestRide";
import GetRide from "../src/application/usecase/GetRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";
import AcceptRide from "../src/application/usecase/AcceptRide";
import StartRide from "../src/application/usecase/StartRide";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import UpdatePosition from "../src/application/usecase/UpdatePosition";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";
import FinishRide from "../src/application/usecase/FinishRide";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;
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
	acceptRide = new AcceptRide(rideRepository, accountRepository)
	startRide = new StartRide(rideRepository)
	updatePosition = new UpdatePosition(rideRepository, positionRepository)
	finishRide = new FinishRide(rideRepository, positionRepository)
})

afterEach(async () => {
	await database.close()
})

test("Deve iniciar uma corrida", async function () {
	const inputSignupPassenger = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isPassenger: true,
		password: "123456"
	};
	const outputSignupPassanger = await signup.execute(inputSignupPassenger)
	const inputSignupDriver = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isDriver: true,
		carPlate: "AAA9999",
		password: "123456"
	};
	const outputSignupDriver = await signup.execute(inputSignupDriver)
	const inputRequestRide = {
		passengerId: outputSignupPassanger.accountId,
		"fromLat": 37.7749,
		"fromLong": -122.4194,
		"toLat": 34.0522,
		"toLong": -118.2437
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide)
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
	await acceptRide.execute(inputAcceptRide)
	const inputStartRide = {
		rideId: outputRequestRide.rideId
	}
	await startRide.execute(inputStartRide)
	const inputUpdatePosition1 = {
		rideId: outputRequestRide.rideId,
		lat: 37.7749,
		long: -122.4194
	}
	await updatePosition.execute(inputUpdatePosition1)
	const inputUpdatePosition2 = {
		rideId: outputRequestRide.rideId,
		lat: 34.0522,
		long: -118.2437
	}
	await updatePosition.execute(inputUpdatePosition2)
	const inputFinishRide = {
    rideId: outputRequestRide.rideId
  }
  await finishRide.execute(inputFinishRide)
	const outputGetRide = await getRide.execute(outputRequestRide.rideId)
	expect(outputGetRide.status).toBe("completed")
	expect(outputGetRide.distance).toBe(559)
	expect(outputGetRide.fare).toBe(1173.9)
})