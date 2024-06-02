import { Category, Item, Measurement } from "@prisma/client";

import PrismaInstance from "./prismaClient";

const prisma = PrismaInstance.getInstance();

export function isValidCategory(category: Category): boolean {
  return isValidName(category.name) && isValidNumber(category.order);
}
export function isValidItem(item: Item): boolean {
  return (
    isValidName(item.name) &&
    isValidNumber(item.order) &&
    isValidNumber(item.quantity) &&
    isValidMeasurement(item.measurement)
  );
}

export function isValidName(name: string): boolean {
  return !!name;
}

export function isValidMeasurement(measurement: Measurement): boolean {
  return !(
    measurement !== Measurement.COUNT &&
    measurement !== Measurement.G &&
    measurement !== Measurement.ML &&
    measurement !== Measurement.NONE
  );
}

export function isValidNumber(number: number): boolean {
  
  if (number == null || number == undefined) return true;
  if (isNaN(number)) return false;
  if (number < 0) return false;
  if (number != Math.round(number)) return false;
  return true;
}
