import Logger from "../logger/Logger";
import RideRepository from "../repository/RideRepository";
import AccountRepository from "../repository/AccountRepository";
import Ride from "../../domain/entities/Ride";

export default class RequestRide {
	constructor(private rideRepository: RideRepository, private AccountRepository: AccountRepository, private logger: Logger) { }

	async execute(input: Input): Promise<Output> {
		this.logger.log(`request ride ${input.passengerId}`)
		const account = await this.AccountRepository.getById(input.passengerId)
		if (!account) throw new Error("Passenger does not exists")
		if (!account.isPassenger) throw new Error("Only passengers can request a ride")
		const activeRide = await this.rideRepository.getActiveRideByPassengerId(input.passengerId)
		if (activeRide) throw new Error("Passenger has an active ride")
		const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong)
		await this.rideRepository.save(ride)
		return {
			rideId: ride.rideId
		};
	}
}

type Input = {
	passengerId: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number
}

type Output = {
	rideId: string
}