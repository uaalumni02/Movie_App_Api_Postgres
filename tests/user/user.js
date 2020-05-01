import 'dotenv/config';
import chai from 'chai';
import chaiHttp from 'chai-http';
import request from 'supertest';
import Mock from '../_mocks_/index'
import app from '../../src/server';

const http = request.agent(app);
const { expect } = chai;

chai.use(chaiHttp);
chai.should()

const userPath = '/api/user';
const loginPath = '/api/user/login';

let testUser = Mock.user;

describe('User', () => {
    before(function (done) {
        this.timeout(20000);
        http.post(userPath)
            .send(testUser)
            .end((error, response) => {
                const { userId: id, token } = response.body.userdata;
                testUser = { ...testUser, id, token }
                done();
            });
    });
    describe('add User', () => {
        it('should register user', (done) => {
            request(app)
                .post(userPath)
                .send(Mock.user)
                .end((error, response) => {
                    expect(response.body).to.have.nested.property('success').to.eql(true);
                    done();
                });

        });
    });
    

}).timeout(30000)