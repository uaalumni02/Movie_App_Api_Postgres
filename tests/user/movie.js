import "dotenv/config";
import chai from "chai";
import chaiHttp from "chai-http";
import request from "supertest";
import Mock from "../_mocks_/index";
import app from "../../src/server";

const http = request.agent(app);
const { expect } = chai;

chai.use(chaiHttp);
chai.should();

const moviePath = "/api/movie";
const userPath = "/api/user";
let validAdminToken;
let id;

describe("Movie", () => {
  before(function (done) {
    this.timeout(20000);
    http
      .post(userPath)
      .send(Mock.user)
      .end((error, response) => {
        validAdminToken = response.body.userdata.token;
        done();
      });
  });
  describe("add Movie", () => {
    it("should not register movie if no valid in header", (done) => {
      request(app).post(moviePath).send(Mock.movie).expect(401, done);
    });
  });
  describe("add movie", () => {
    it("should register movier since there is a valid header", (done) => {
      request(app)
        .post(moviePath)
        .set("Authorization", "Bearer " + validAdminToken)
        .send(Mock.movie)
        .expect(201, done);
      Mock.movie.should.be.a("object");
      expect(Mock.movie).to.have.property("name");
      expect(Mock.movie).to.have.property("rating");
      expect(Mock.movie).to.have.property("release");
      expect(Mock.movie).to.have.property("directors");
    });
  });
  describe("get movies", () => {
    it("should not get movies since no valid token", (done) => {
      request(app).get(moviePath).expect(401, done);
    });
  });
  describe("get movies", () => {
    it("should get movies since valid token", (done) => {
      chai
        .request(app)
        .get(moviePath)
        .set("Authorization", "Bearer " + validAdminToken)
        .end((err, response) => {
          id = response.body.data[0].id;
          response.body.should.be.a("object");
          expect(response.body).to.have.nested.property("success").to.eql(true);
          expect(response.body).to.have.nested.property("data[0].name");
          expect(response.body).to.have.nested.property("data[0].rating");
          expect(response.body).to.have.nested.property("data[0].release");
          expect(response.body).to.have.nested.property("data[0].directors");
          done();
        });
    });
  });
  describe(" get movie by id", () => {
    it("should not get movie by id since no valid token", (done) => {
      request(app)
        .get("/api/movie/" + id)
        .expect(401, done);
    });
  });
  describe(" get movie by ID", () => {
    it("should get movie by id since valid token", (done) => {
      chai
        .request(app)
        .get("/api/movie/" + id)
        .set("Authorization", "Bearer " + validAdminToken)
        .end((err, response) => {
          response.body.should.be.a("object");
          expect(response.body).to.have.nested.property("success").to.eql(true);
          expect(response.body).to.have.nested.property("data[0].name");
          expect(response.body).to.have.nested.property("data[0].rating");
          expect(response.body).to.have.nested.property("data[0].release");
          expect(response.body).to.have.nested.property("data[0].directors");
          done();
        });
    });
  });
  describe(" delete movie by id", () => {
    it("should not delete by id since no valid token", (done) => {
      request(app)
        .delete("/api/movie/" + id)
        .expect(401, done);
    });
  });
  describe(" delete movie by id", () => {
    it("should delete movie by id since valid token", (done) => {
      request(app)
        .delete("/api/movie/" + id)
        .set("Authorization", "Bearer " + validAdminToken)
        .end((err, response) => {
          expect(response.body).to.have.nested.property("success").to.eql(true);
          expect(response.body).to.have.nested.property("data").to.eql(1);
          done();
        });
    });
  });
}).timeout(30000);
