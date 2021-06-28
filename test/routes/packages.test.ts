import "../fixture";

import { request } from "../request";
import { database } from "../database";

const packages = require("../utils/seed.json");

describe("/packages", () => {
  const TOKEN = { authorization: `Bearer ${process.env.API_TOKEN}` };
  const ASCENDING = (a: any, b: any) => (a.name > b.name ? 1 : -1);
  const NORMALIZE = ({
    name,
    description,
    version,
    downloads,
    homepage,
    license,
    repository,
  }: Record<string, any>) => ({
    name,
    description,
    version,
    downloads,
    homepage,
    license,
    repository,
  });

  beforeAll(async () => {
    await database.raw("select 1 as server_status");
  });

  afterAll(async () => {
    await database.destroy();
  });

  beforeEach(async () => {
    await database.from("packages").delete();
  });

  afterEach(async () => {
    await database.from("packages").delete();
  });

  describe("GET /packages", () => {
    test("401 - unauthorized", async () => {
      expect.assertions(2);

      const response1 = await request().get("/packages");

      expect(response1.status).toBe(401);

      const response2 = await request()
        .get("/packages")
        .set({ authorization: "invalid" });

      expect(response2.status).toBe(401);
    });

    test("200 - ok (empty)", async () => {
      expect.assertions(2);

      const response = await request().get("/packages").set(TOKEN);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test("200 - ok", async () => {
      expect.assertions(3);

      await database.from("packages").insert(packages);

      const response = await request().get("/packages").set(TOKEN);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.sort(ASCENDING).map(NORMALIZE)).toEqual(
        packages.sort(ASCENDING).map(NORMALIZE),
      );
    });
  });

  describe("POST /packages", () => {
    test("400 - bad request", async () => {
      expect.assertions(3);

      const response1 = await request().post("/packages").set(TOKEN);

      expect(response1.status).toBe(400);

      const response2 = await request()
        .post("/packages")
        .set(TOKEN)
        .send({ key: "invalid" });

      expect(response2.status).toBe(400);

      const response3 = await request()
        .post("/packages")
        .set(TOKEN)
        .send({ ...packages[0], downloads: "invalid" });

      expect(response3.status).toBe(400);
    });

    test("401 - unauthorized", async () => {
      expect.assertions(2);

      const response1 = await request().post("/packages").send(packages[0]);

      expect(response1.status).toBe(401);

      const response2 = await request()
        .post("/packages")
        .send(packages[0])
        .set({ authorization: "invalid" });

      expect(response2.status).toBe(401);
    });

    test("409 - conflict", async () => {
      expect.assertions(1);

      await database.from("packages").insert(packages[0]);

      const response = await request()
        .post("/packages")
        .send(packages[0])
        .set(TOKEN);

      expect(response.status).toBe(409);
    });

    test("201 - created", async () => {
      expect.assertions(2);

      const response = await request()
        .post("/packages")
        .send(packages[0])
        .set(TOKEN);

      expect(response.status).toBe(201);
      expect(NORMALIZE(response.body)).toEqual(NORMALIZE(packages[0]));
    });
  });

  describe("GET /packages/:name", () => {
    const ENDPOINT = `/packages/${packages[0].name}`;

    beforeEach(async () => {
      await database.from("packages").insert(packages.slice(0, 2));
    });

    test("401 - unauthorized", async () => {
      expect.assertions(2);

      const response1 = await request().get(ENDPOINT);

      expect(response1.status).toBe(401);

      const response2 = await request()
        .get(ENDPOINT)
        .set({ authorization: "invalid" });

      expect(response2.status).toBe(401);
    });

    test("404 - not found", async () => {
      expect.assertions(1);

      const response = await request()
        .get(`/packages/${packages[2].name}`)
        .set(TOKEN);

      expect(response.status).toBe(404);
    });

    test("200 - ok", async () => {
      expect.assertions(2);

      const response = await request()
        .get(`/packages/${packages[1].name}`)
        .set(TOKEN);

      expect(response.status).toBe(200);
      expect(NORMALIZE(response.body)).toEqual(NORMALIZE(packages[1]));
    });
  });

  describe("PATCH /packages/:name", () => {
    test.todo("400 - bad request");

    test.todo("401 - unauthorized");

    test.todo("404 - not found");

    test.todo("200 - ok");
  });

  describe("DELETE /packages/:name", () => {
    test.todo("401 - unauthorized");

    test.todo("404 - not found");

    test.todo("204 - no body");
  });
});
