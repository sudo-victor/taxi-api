import Cpf from "../src/domain/value-objects/Cpf"

test.each([
	"50207214093",
	"71428793860",
	"87748248800"
])("Deve testar cpfs validos", async function (cpf: string) {
  expect(new Cpf(cpf)).toBeDefined()
})

test.each([
	"",
	undefined,
	null,
	"111",
	"11111111111",
	"1111111111111111",
])("Deve testar cpfs invalidos", async function (cpf: any) {
  expect(() => new Cpf(cpf)).toThrow(new Error("Invalid cpf"))
})