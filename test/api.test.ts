import axios from "axios"

axios.defaults.validateStatus = function() {
	return true
}

// axios.defaults.headers.common['Content-Type'] = 'application/json';

test("Deve criar uma conta para o passageiro", async function () {
	// given
	const inputSignup = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isPassenger: true,
		password: "123456"
	};
	// when
	const responseSignup = await axios.post('http://localhost:3000/signup', inputSignup);
	const outputSignup = responseSignup.data
	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
	const outputGetAccount = responseGetAccount.data
	//then
	expect(outputSignup.accountId).toBeDefined()
	expect(outputGetAccount.name).toBe(inputSignup.name)
	expect(outputGetAccount.email).toBe(inputSignup.email)
})

test("Nao deve criar uma conta se o nome for invalido", async function () {
	const inputSignup = {
		name: "Jhon",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isPassenger: true,
		password: "123456"
	};
	const responseSignup = await axios.post('http://localhost:3000/signup', inputSignup)
	expect(responseSignup.status).toBe(422)
	expect(responseSignup.data.message).toBe("Invalid name")
})

test("Nao deve criar uma conta se o email for duplicado", async function () {
	// given
	const inputSignup = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isPassenger: true,
		password: "123456"
	};
	// when
	await axios.post('http://localhost:3000/signup', inputSignup)
	const responseSignup = await axios.post('http://localhost:3000/signup', inputSignup)
	expect(responseSignup.status).toBe(422)
	expect(responseSignup.data.message).toBe("Duplicated account")
})

test("Deve criar uma conta para o motorista", async function () {
	// given
	const inputSignup = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isPassenger: false,
		isDriver: true,
		carPlate: "AAA9999",
		password: "123456"
	};
	// when
	const responseSignup = await axios.post('http://localhost:3000/signup', inputSignup);
	const outputSignup = responseSignup.data
	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
	const outputGetAccount = responseGetAccount.data
	//then
	expect(outputSignup.accountId).toBeDefined()
	expect(outputGetAccount.name).toBe(inputSignup.name)
	expect(outputGetAccount.email).toBe(inputSignup.email)
})