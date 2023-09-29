import supertest from "supertest";
import app from "app";
import httpStatus from "http-status";

const api = supertest(app);

describe('api', () => {
    it("should return status 200", async () => {
        const {status, text} = await api.get('/health');
        expect(status).toBe(httpStatus.OK);
    })
})