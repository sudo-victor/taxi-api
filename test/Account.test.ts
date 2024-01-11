import Account from "../src/domain/entities/Account"

test("Deve criar uma conta", function () {
  const account = Account.create(
    "John Doe",
    "johndoe@email.com",
    "18202813700",
    "",
    true,
    false
  )
  expect(account.accountId).toBeDefined()
  expect(account.name.value).toBe("John Doe")
  expect(account.email.value).toBe("johndoe@email.com")
  expect(account.cpf.value).toBe("18202813700")
})