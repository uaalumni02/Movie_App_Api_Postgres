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

const userPath = "/api/user";
const loginPath = "/api/user/login";

let testUser = Mock.user;

describe("User", () => {
  before(function (done) {
    this.timeout(20000);
    http
      .post(userPath)
      .send(testUser)
      .end((error, response) => {
        const { id, token } = response.body.userdata;
        testUser = { ...testUser, id, token };
        done();
      });
  });
  describe("add User", () => {
    it("should register user", (done) => {
      request(app)
        .post(userPath)
        .send(Mock.user)
        .end((error, response) => {
          expect(response.body).to.have.nested.property("success").to.eql(true);
          done();
        });
    });
  });
  describe("get user", () => {
    it("should not get user since no valid token", (done) => {
      request(app).get(userPath).expect(401, done);
    });
  });
  describe("get user", () => {
    it("should get users since valid token", (done) => {
      chai
        .request(app)
        .get(userPath)
        .set("Authorization", "Bearer " + testUser.token)
        .end((err, response) => {
          response.body.should.be.a("object");
          expect(response.body).to.have.nested.property("success").to.eql(true);
          expect(response.body).to.have.nested.property("data[0].username");
          done();
        });
    });
  });
  describe("login user", () => {
    it("should return token", (done) => {
      const { username, password } = testUser;
      request(app)
        .post(loginPath)
        .send({ username, password })
        .end((error, response) => {
          expect(response.body).to.have.nested.property("success").to.eql(true);
          done();
        });
    });
  });
  describe(" get user by Id", () => {
    it("should not get user by id since no valid token", (done) => {
      request(app)
        .get("/api/user/" + testUser.id)
        .expect(401, done);
    });
  });
  describe(" get user by Id", () => {
    it("should get user by id since valid token", (done) => {
      request(app)
        .get("/api/user/" + testUser.id)
        .set("Authorization", "Bearer " + testUser.token)
        .end((err, response) => {
          response.body.should.be.a("object");
          expect(response.body).to.have.nested.property("success").to.eql(true);
          expect(response.body).to.have.nested.property("data[0].username");
          expect(response.body).to.have.nested.property("data[0].password");
          done();
        });
    });
  });

  describe(" delete user by id", () => {
    it("should not delete by id since no valid token", (done) => {
      request(app)
        .delete("/api/user/" + testUser.id)
        .expect(401, done);
    });
  });
  describe(" delete user by id", () => {
    it("should delete by id since valid token", (done) => {
      request(app)
        .delete("/api/user/" + testUser.id)
        .set("Authorization", "Bearer " + testUser.token)
        .end((err, response) => {
          response.body.should.be.a("object");
          expect(response.body).to.have.nested.property("success").to.eql(true);
          expect(response.body).to.have.nested.property("data").to.eql(1);
          done();
        });
    });
  });
}).timeout(30000);
