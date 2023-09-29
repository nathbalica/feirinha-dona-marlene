import { faker } from "@faker-js/faker";
import prisma from "data/database";
import fruits from "data/fruits";
import { FruitInput } from "services/fruits-service";

export function createFruit(): FruitInput {
    return {
        name: faker.commerce.product(),
        price: Number(faker.number.int())
    }
}

