import supertest from "supertest";
import { createFruit } from "./factories/fruit-factory";
import app from "app";
import httpStatus from "http-status";
import { Fruit } from "repositories/fruits-repository";

const api = supertest(app);

describe("testes POST/fruits", () => {
    it("should return 201 when inserting fruit", async () => {
        const fruitObject = createFruit();
        const response = await api.post('/fruits').send(fruitObject);
        expect(response.status).toBe(httpStatus.CREATED);
    });
    it("should return 409 when inserting a fruit that is already registered", async () => {
        const fruitObject = createFruit();
        await api.post('/fruits').send(fruitObject);
        const response = await api.post('/fruits').send(fruitObject);
        expect(response.status).toBe(httpStatus.CONFLICT);
    });
    it("should return 422 when inserting a fruit with data missing", async () => {
        const fruitObject = createFruit();
        const response1 = await api.post('/fruits').send({name: fruitObject.name});
        expect(response1.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        const response2 = await api.post('/fruits').send({price: fruitObject.price});
        expect(response2.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        const response3 = await api.post('/fruits');
        expect(response3.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
})

describe("tests GET/fruits/:id", () => {
    it(`shoud return 404 when trying to get a fruit by an id that doesn't exist`, async () => {
        const response = await api.get(`/fruit/${Number.MAX_VALUE}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    })

    it(`should return 400 when id param is present but not valid`, async () => {
        const response = await api.get('/fruit/abacaxi');
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    })

    it(`should return one fruit when given a valid and existing id`, async () => {
        const fruitObject = createFruit();
        await api.post('/fruits').send(fruitObject);
        const response2 = await api.get('/fruits');
        const {status, body} = await api.get(`/fruits/${response2.body[0].id}`);
        expect(status).toBe(httpStatus.OK);
        expect(body).toEqual({
            id: expect.any(Number),
            name: expect.any(String),
            price: expect.any(Number)
        })
    })
})

describe("tests GET/fruits", () => {
    it('should return all fruits if no id is present', async () => {
        const response2 = await api.get('/fruits');
        expect(response2.status).toBe(httpStatus.OK);
        expect(response2.body).toHaveLength(3);
        expect(response2.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                price: expect.any(Number)
              })
            ])
          )
    })
})

