import Name from "../src/domain/value-objects/Name"

test("Deve testar um nome válido", () => {
  const name = new Name("John Doe");
  expect(name.value).toBe("John Doe")
})

test("Deve testar um nome inválido", () => {
  const name = new Name("John Doe");
  expect(() => new Name("John")).toThrow("Invalid name")
})