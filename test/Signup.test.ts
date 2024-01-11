import sinon from "sinon";
import GetAccount from "../src/application/usecase/GetAccount";
import Signup from "../src/application/usecase/Signup";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import AccountRepository from "../src/application/repository/AccountRepository";
import Logger from "../src/application/logger/Logger";
import Account from "../src/domain/entities/Account";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";

let signup: Signup;
let getAccount: GetAccount;
let database: DatabaseConnection;

beforeEach(() => {
	database = new PgPromiseAdapter()
	const accountRepository = new AccountRepositoryDatabase(database)
	const logger = new LoggerConsole()
	signup = new Signup(accountRepository, logger)
	getAccount = new GetAccount(accountRepository)
})

afterEach(async () => {
	await database.close()
})

test("Deve criar uma conta para o passageiro com stub", async function() {
	const stubAccountRepositorySave = sinon.stub(AccountRepositoryDatabase.prototype, "save").resolves()
	const stubAccountRepositoryGetByEmail = sinon.stub(AccountRepositoryDatabase.prototype, "getByEmail").resolves(undefined)
	// given
	const inputSignup = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isPassenger: true,
		password: "123456"
	};
	const stubAccountRepositoryGetById = sinon.stub(AccountRepositoryDatabase.prototype, "getById").resolves(Account.create(inputSignup.name, inputSignup.email, inputSignup.cpf, "", true, false))
	// when
	const outputSignup = await signup.execute(inputSignup)
	const outputGetAccount = await getAccount.execute(outputSignup.accountId)
	//then
	expect(outputSignup.accountId).toBeDefined()
	expect(outputGetAccount?.name).toBe(inputSignup.name)
	expect(outputGetAccount?.email).toBe(inputSignup.email)

	stubAccountRepositorySave.restore()
	stubAccountRepositoryGetByEmail.restore()
	stubAccountRepositoryGetById.restore()
})

test("Deve criar uma conta para o passageiro com mock", async function() {
	const mockLogger = sinon.mock(LoggerConsole.prototype)
	mockLogger.expects("log").withArgs("signup Jhon Doe").once();
	// given
	const inputSignup = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isPassenger: true,
		password: "123456"
	};
	// when
	const outputSignup = await signup.execute(inputSignup)
	const outputGetAccount = await getAccount.execute(outputSignup.accountId)
	//then
	expect(outputGetAccount?.name).toBe(inputSignup.name)
	expect(outputGetAccount?.email).toBe(inputSignup.email)
	mockLogger.verify()
})

test("Deve criar uma conta para o passageiro com fake", async function() {
	// given
	const inputSignup = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isPassenger: true,
		password: "123456"
	};
	const accounts: any = []
	const AccountRepository: AccountRepository = {
		save: async function (account: any): Promise<void> {accounts.push(account)},
		getById: async function (accountId: string): Promise<any> {
			return accounts.find((account: any) => account.accountId === accountId)
		},
		getByEmail: async function (email: string): Promise<any> {
			return accounts.find((account: any) => account.email === email)
		}
	}
	const logger: Logger = {
		log: function (message: string): void {}
	}
	const signup = new Signup(AccountRepository, logger)
	const getAccount = new GetAccount(AccountRepository)
	// when
	const outputSignup = await signup.execute(inputSignup)
	const outputGetAccount = await getAccount.execute(outputSignup.accountId)
	//then
	expect(outputGetAccount?.name).toBe(inputSignup.name)
	expect(outputGetAccount?.email).toBe(inputSignup.email)
})

test("Deve criar uma conta para o motorista", async function() {
	const spyLoggerLog = sinon.spy(LoggerConsole.prototype, "log")
	// given
	const inputSignup = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isPassenger: false,
		isDriver: true,
		password: "123456",
		carPlate: "AAA9999"
	};
	// when
	const outputSignup = await signup.execute(inputSignup)
	const outputGetAccount = await getAccount.execute(outputSignup.accountId)
	//then
	expect(outputSignup.accountId).toBeDefined()
	expect(outputGetAccount?.name).toBe(inputSignup.name)
	expect(outputGetAccount?.email).toBe(inputSignup.email)
	expect(spyLoggerLog.calledOnce).toBeTruthy()
	expect(spyLoggerLog.calledWith(`signup Jhon Doe`)).toBeTruthy()
})