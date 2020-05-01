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
        const { userId: id, token } = response.body.userdata;
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
}).timeout(30000);
