import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import dotenv from 'dotenv';
import testData from './articles.spec';
import { HelperUtils } from '../utils';
import app from '../app';

dotenv.config();

chai.use(chaiHttp);

const invalidUser = HelperUtils.generateToken({
  email: 'iamEvenmoreInvalid@rocketmail.com',
  id: 10000
});

const userToken = HelperUtils.generateToken({
  id: 2
});

describe('Test for the bookmark route', () => {
  it('It should return 201 if the bookmark is created', (done) => {
    chai
      .request(app)
      .post(`/api/bookmark/${testData[0]}`)
      .set('authorization', `Bearer ${testData[1]}`)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('article bookmarked successfully');
        done();
      });
  });

  it('It should return 400 if you have already bookmarked an article', (done) => {
    chai
      .request(app)
      .post(`/api/bookmark/${testData[0]}`)
      .set('authorization', `Bearer ${testData[1]}`)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('you have bookmarked this article already');
        done();
      });
  });

  it('It should return 404 if a user isn\'t found', (done) => {
    chai
      .request(app)
      .post(`/api/bookmark/${testData[0]}`)
      .set('authorization', `Bearer ${invalidUser}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('user not found');
        done();
      });
  });

  it('It should return 404 if the article doesn\'t exist', (done) => {
    chai
      .request(app)
      .post(`/api/bookmark/${'this-is-not-in-existence-10000'}`)
      .set('authorization', `Bearer ${testData[1]}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('article not found');
        done();
      });
  });

  it('It should return 404 if the bookmark doesn\'t exist', (done) => {
    chai
      .request(app)
      .delete(`/api/articles/${testData[0]}/bookmark`)
      .set('authorization', `Bearer ${invalidUser}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('bookmark doesn\'t exist');
        done();
      });
  });

  it('It should return 404 if the article doesn\'t exist', (done) => {
    chai
      .request(app)
      .delete(`/api/articles/${'this-is-an-infinite-post-100000'}/bookmark`)
      .set('authorization', `Bearer ${testData[1]}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('article doesn\'t exist or has been deleted');
        done();
      });
  });

  it('It should return 404 if a user isn\'t found', (done) => {
    chai
      .request(app)
      .get('/api/bookmark')
      .set('authorization', `Bearer ${invalidUser}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('user not found');
        done();
      });
  });

  it('It should return 200 if a has no bookmark', (done) => {
    chai
      .request(app)
      .get('/api/bookmark')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('you have no bookmarks');
        done();
      });
  });

  it('It should return 200 if the bookmarks are fetched successfully', (done) => {
    chai
      .request(app)
      .get('/api/bookmark')
      .set('authorization', `Bearer ${testData[1]}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('all bookmarks delivered successfully');
        done();
      });
  });

  it('It should return 200 if the bookmark is deleted or removed', (done) => {
    chai
      .request(app)
      .delete(`/api/articles/${testData[0]}/bookmark`)
      .set('authorization', `Bearer ${testData[1]}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('bookmark removed successfully');
        done();
      });
  });
});
