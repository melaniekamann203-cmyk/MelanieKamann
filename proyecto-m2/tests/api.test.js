process.env.NODE_ENV = "test";

const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db");

// Los tests usan la base configurada en .env y borran todo lo que crean
const uniqueEmail = () => `test-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@bitacora.dev`;

after(() => db.close());

describe("Sistema", () => {
  it("GET /health responde ok con la base de datos arriba", async () => {
    const res = await request(app).get("/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.database, "up");
  });

  it("una ruta inexistente responde 404 en JSON", async () => {
    const res = await request(app).get("/no-existe");
    assert.equal(res.status, 404);
    assert.ok(res.body.error);
  });

  it("un body con JSON mal formado responde 400", async () => {
    const res = await request(app).post("/authors").set("Content-Type", "application/json").send("{mal json");
    assert.equal(res.status, 400);
  });
});

describe("Authors", () => {
  let author;

  before(async () => {
    const res = await request(app).post("/authors").send({ name: "  Autora Test ", email: uniqueEmail(), bio: "bio" });
    author = res.body;
  });

  after(async () => {
    await request(app).delete(`/authors/${author.id}`);
  });

  it("POST /authors crea el autor (201) y limpia espacios", () => {
    assert.ok(author.id);
    assert.equal(author.name, "Autora Test");
  });

  it("GET /authors devuelve un array", async () => {
    const res = await request(app).get("/authors");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  it("GET /authors?search busca por nombre sin distinguir mayúsculas", async () => {
    const res = await request(app).get("/authors").query({ search: "autora test" });
    assert.equal(res.status, 200);
    assert.ok(res.body.some(a => a.id === author.id));
  });

  it("GET /authors/:id devuelve el autor", async () => {
    const res = await request(app).get(`/authors/${author.id}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.email, author.email);
  });

  it("GET /authors/abc responde 400", async () => {
    const res = await request(app).get("/authors/abc");
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "id must be a positive integer");
  });

  it("GET /authors/999999 responde 404", async () => {
    const res = await request(app).get("/authors/999999");
    assert.equal(res.status, 404);
    assert.equal(res.body.error, "author not found");
  });

  it("POST /authors con datos inválidos responde 400 con el detalle por campo", async () => {
    const res = await request(app).post("/authors").send({ name: "", email: "no-es-email" });
    assert.equal(res.status, 400);
    assert.deepEqual(res.body.details.map(d => d.field).sort(), ["email", "name"]);
  });

  it("POST /authors con email repetido responde 409", async () => {
    const res = await request(app).post("/authors").send({ name: "Otra", email: author.email.toUpperCase() });
    assert.equal(res.status, 409);
  });

  it("PATCH /authors/:id cambia solo los campos enviados", async () => {
    const res = await request(app).patch(`/authors/${author.id}`).send({ bio: "bio nueva" });
    assert.equal(res.status, 200);
    assert.equal(res.body.bio, "bio nueva");
    assert.equal(res.body.name, "Autora Test");
  });

  it("PUT /authors/:id reemplaza el autor completo", async () => {
    const res = await request(app).put(`/authors/${author.id}`).send({ name: "Autora Editada", email: author.email });
    assert.equal(res.status, 200);
    assert.equal(res.body.name, "Autora Editada");
    assert.equal(res.body.bio, null);
  });

  it("DELETE /authors/999999 (inexistente) responde 404", async () => {
    const res = await request(app).delete("/authors/999999");
    assert.equal(res.status, 404);
    assert.equal(res.body.error, "author not found");
  });

  it("PATCH /authors/999999 (inexistente) responde 404", async () => {
    const res = await request(app).patch("/authors/999999").send({ bio: "x" });
    assert.equal(res.status, 404);
  });

  it("PUT /authors/:id sin email responde 400", async () => {
    const res = await request(app).put(`/authors/${author.id}`).send({ name: "Sin email" });
    assert.equal(res.status, 400);
  });
});

describe("Posts", () => {
  let author;
  let post;

  before(async () => {
    author = (await request(app).post("/authors").send({ name: "Autor Posts", email: uniqueEmail() })).body;
  });

  after(async () => {
    await request(app).delete(`/authors/${author.id}`);
  });

  it("GET /posts/author/:authorId devuelve [] si el autor no tiene posts", async () => {
    const res = await request(app).get(`/posts/author/${author.id}`);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, []);
  });

  it("POST /posts crea un borrador por defecto e incluye el autor", async () => {
    const res = await request(app).post("/posts").send({ author_id: author.id, title: "Post de prueba", content: "Contenido" });
    assert.equal(res.status, 201);
    assert.equal(res.headers.location, `/posts/${res.body.id}`);
    assert.equal(res.body.published, false);
    assert.equal(res.body.author.name, "Autor Posts");
    post = res.body;
  });

  it("POST /posts sin título responde 400", async () => {
    const res = await request(app).post("/posts").send({ author_id: author.id, content: "Contenido" });
    assert.equal(res.status, 400);
    assert.equal(res.body.details[0].field, "title");
  });

  it("POST /posts con author_id inexistente responde 400", async () => {
    const res = await request(app).post("/posts").send({ author_id: 999999, title: "t", content: "c" });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "author_id does not reference an existing author");
  });

  it("GET /posts?author_id&published filtra los resultados", async () => {
    const drafts = await request(app).get("/posts").query({ author_id: author.id, published: "false" });
    assert.equal(drafts.status, 200);
    assert.deepEqual(drafts.body.map(p => p.id), [post.id]);

    const published = await request(app).get("/posts").query({ author_id: author.id, published: "true" });
    assert.deepEqual(published.body, []);
  });

  it("GET /posts?published=quizas responde 400", async () => {
    const res = await request(app).get("/posts").query({ published: "quizas" });
    assert.equal(res.status, 400);
  });

  it("PATCH /posts/:id publica el borrador", async () => {
    const res = await request(app).patch(`/posts/${post.id}`).send({ published: true });
    assert.equal(res.status, 200);
    assert.equal(res.body.published, true);
    assert.equal(res.body.title, "Post de prueba");
  });

  it("PATCH /posts/:id con body vacío responde 400", async () => {
    const res = await request(app).patch(`/posts/${post.id}`).send({});
    assert.equal(res.status, 400);
  });

  it("PUT /posts/:id reemplaza el post", async () => {
    const res = await request(app).put(`/posts/${post.id}`).send({ author_id: author.id, title: "Editado", content: "Nuevo contenido" });
    assert.equal(res.status, 200);
    assert.equal(res.body.title, "Editado");
    assert.equal(res.body.published, false);
  });

  it("GET /authors/:id/posts devuelve el autor con sus posts", async () => {
    const res = await request(app).get(`/authors/${author.id}/posts`);
    assert.equal(res.status, 200);
    assert.equal(res.body.author.id, author.id);
    assert.equal(res.body.posts.length, 1);
  });

  it("DELETE /posts/:id responde 204 y después 404", async () => {
    const del = await request(app).delete(`/posts/${post.id}`);
    assert.equal(del.status, 204);

    const get = await request(app).get(`/posts/${post.id}`);
    assert.equal(get.status, 404);
  });

  it("DELETE /authors/:id borra también sus posts (cascada)", async () => {
    const other = (await request(app).post("/posts").send({ author_id: author.id, title: "x", content: "y" })).body;

    const del = await request(app).delete(`/authors/${author.id}`);
    assert.equal(del.status, 204);

    const get = await request(app).get(`/posts/${other.id}`);
    assert.equal(get.status, 404);
  });

  it("DELETE /posts/999999 (inexistente) responde 404", async () => {
    const res = await request(app).delete("/posts/999999");
    assert.equal(res.status, 404);
    assert.equal(res.body.error, "post not found");
  });

  it("PATCH /posts/999999 (inexistente) responde 404", async () => {
    const res = await request(app).patch("/posts/999999").send({ published: true });
    assert.equal(res.status, 404);
  });

  it("GET /posts/author/999999 responde 404", async () => {
    const res = await request(app).get("/posts/author/999999");
    assert.equal(res.status, 404);
  });
});
