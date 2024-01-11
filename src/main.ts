import AccountRepositoryDatabase from "./infra/repository/AccountRepositoryDatabase";
import GetAccount from "./application/usecase/GetAccount";
import LoggerConsole from "./infra/logger/LoggerConsole";
import MainController from "./infra/controller/MainController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import Signup from "./application/usecase/Signup";
import ExpressAdapter from "./infra/http/ExpressAdapter";

const httpServer = new ExpressAdapter()
const database = new PgPromiseAdapter()
const accountRepository = new AccountRepositoryDatabase(database)
const logger = new LoggerConsole()
const signup = new Signup(accountRepository, logger)
const getAccount = new GetAccount(accountRepository)
new MainController(httpServer, signup, getAccount)
httpServer.listen(3000)