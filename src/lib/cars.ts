import type { Car } from "./types";
import carsData from "../../data/cars.json";

export const allCars: Car[] = carsData as Car[];

export function searchCars(query: string): Car[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return allCars
    .filter((car) =>
      `${car.make} ${car.model}`.toLowerCase().includes(q)
    )
    .slice(0, 10);
}

export function getCarById(id: string): Car | undefined {
  return allCars.find((car) => car.id === id);
}

export function carDisplayLabel(car: Car): string {
  const end = car.production_end ? String(car.production_end) : "present";
  return `${car.make} ${car.model} (Gen ${car.generation} · ${car.production_start}–${end})`;
}
