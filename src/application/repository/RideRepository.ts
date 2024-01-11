import Ride from "../../domain/entities/Ride";

export default interface RideRepository {
  save(ride: any): Promise<void>;
  update(ride: any): Promise<void>;
  getById(rideId: string): Promise<Ride | undefined>;
  list(): Promise<Ride[]>;
  getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined>
}