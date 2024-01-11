import Logger from "../logger/Logger";
import Account from "../../domain/entities/Account";
import AccountRepository from "../repository/AccountRepository";

export default class Signup {
	AccountRepository: AccountRepository;
	logger: Logger;
	
	constructor(AccountRepository: AccountRepository, logger: Logger) {
		this.AccountRepository = AccountRepository
		this.logger = logger
	}

	async execute(input: Input): Promise<Output> {
		this.logger.log(`signup ${input.name}`)
		const existingAccount = await this.AccountRepository.getByEmail(input.email)
		if (existingAccount) throw new Error('Duplicated account')
		const account = Account.create(input.name, input.email, input.cpf, input.carPlate || "", !!input.isPassenger, !!input.isDriver)
		await this.AccountRepository.save(account)
		return {
			accountId: account.accountId
		};
	}
}

type Input = {
	name: string,
	email: string,
	cpf: string,
	carPlate?: string,
	isPassenger?: boolean,
	isDriver?: boolean,
	password: string
}

type Output = {
	accountId: string
}