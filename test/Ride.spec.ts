import Position from "../src/domain/entities/Position";
import Ride from "../src/domain/entities/Ride";

test("Deve testar uma ride", async function () {
  const ride = Ride.create("", 0,0,0,0);
  ride.accept("")
  ride.start()
  const position1 = Position.create("", 37.7749,-122.4194)
	ride.updatePosition(position1)
  const position2 = Position.create("",  34.0522,-118.2437)
  ride.updatePosition(position2)
  ride.finish()
  expect(ride.getDistance()).toBe(559)
  expect(ride.getFare()).toBe(1173.9)
})