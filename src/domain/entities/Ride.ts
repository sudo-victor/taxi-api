import crypto from "node:crypto"
import RideStatus, { RideStatusFactory } from "../value-objects/RideStatus"
import Position from "./Position";
import DistanceCalculator from "../service/DistanceCalculator";
import Coord from "../value-objects/Coord";
import { FareCalculatorFactory } from "../service/FareCalculator";

export default class Ride {
  status: RideStatus;
  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private driverId: string | undefined,
    status: string,
    readonly date: Date,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    private distance: number = 0,
    private fare: number = 0,
    private lastPosition?: Coord
  ) {
    this.status = RideStatusFactory.create(status, this)
  }

  static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
    const rideId = crypto.randomUUID()
    const status = "requested"
    const date = new Date()
    return new Ride(rideId, passengerId, undefined, status, date, fromLat, fromLong, toLat, toLong)
  }

  accept(driverId: string) {
    this.driverId = driverId
    this.status.accept()
  }

  start() {
    this.status.start()
  }

  finish() {
    const fareCalculator = FareCalculatorFactory.create(this.date)
    this.fare = fareCalculator.calculate(this.distance)
    this.status.finish()
  }

  updatePosition(position: Position) {
    if (this.lastPosition) {
      this.distance += DistanceCalculator.calculate(this.lastPosition, position.coord)
    }

    this.lastPosition = position.coord
  }

  getStatus() {
    return this.status.value;
  }

  getDriverId() {
    return this.driverId;
  }

  getFare() {
    return this.fare
  }

  getDistance() {
    return this.distance
  }

  getLastPosition() {
    return this.lastPosition
  }
}