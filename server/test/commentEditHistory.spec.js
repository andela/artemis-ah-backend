import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../app';

dotenv.config();
chai.use(chaiHttp);

let userToken, adminToken, unauthorizedToken, commentId;
const articleSlug = 'this-is-an-article-1';

describe('Test endpoint to return edit history', () => {
  before('it should get admin user', (done) => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({
        name: process.env.SUPER_ADMIN_USERNAME,
        password: process.env.SUPER_ADMIN_PASSWORD
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        const { token } = res.body.user;
        adminToken = token;
        done();
      });
  });

  before('it should create a regular user', (done) => {
    chai
      .request(app)
      .post('/api/users')
      .send({
        firstname: 'Comment',
        lastname: 'Bot',
        username: 'commentbot',
        email: 'commentbot@authorshaven.com',
        password: '1234567890'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        const { token } = res.body.user;
        userToken = token;
        done();
      });
  });

  before('it should create an unauthorized user', (done) => {
    chai.request(app)
      .post('/api/users')
      .send({
        firstname: 'Unauthorized',
        lastname: 'User',
        email: 'unauthorizeduser@gmail.com',
        username: 'unauthorizeduser',
        password: '1234567890'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        const { token } = res.body.user;
        unauthorizedToken = token;
        done();
      });
  });

  it('should create a new comment', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${articleSlug}/comment`)
      .set('authorization', `Bearer ${userToken}`)
      .send({
        comment: 'This is original comment'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        const { userComment } = res.body;
        commentId = userComment.id;
        done();
      });
  });

  it('should return a 401 if user trying to get edit history is not an admin and also not the user that edited the comment', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${articleSlug}/comment/${commentId}/history`)
      .set('authorization', `bearer ${unauthorizedToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
  });

  it('should return a 404 if user is trying to get history for a comment that does not exists', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${articleSlug}/comment/9876545/history`)
      .set('authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('should get edit history of the comment (if comment has not been edited)', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${articleSlug}/comment/${commentId}/history`)
      .set('authorization', `bearer ${adminToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);

        const { original, history } = res.body;
        expect(original.comment).to.be.a('string');
        expect(history).to.be.an('array');
        expect(history.length).to.equal(0);
        expect(original.comment).to.equal('This is original comment');
        done();
      });
  });

  it('should edit the above comment', (done) => {
    chai
      .request(app)
      .patch(`/api/articles/${articleSlug}/comment/${commentId}`)
      .set('authorization', `Bearer ${userToken}`)
      .send({
        comment: 'This is the edited version of the comment'
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('should edit the above comment again', (done) => {
    chai
      .request(app)
      .patch(`/api/articles/${articleSlug}/comment/${commentId}`)
      .set('authorization', `Bearer ${userToken}`)
      .send({
        comment: 'This is the second time the comment is edited'
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('should get edit history of the comment (if user is admin)', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${articleSlug}/comment/${commentId}/history`)
      .set('authorization', `bearer ${adminToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);

        const { original, history } = res.body;
        expect(original.comment).to.be.a('string');
        expect(history).to.be.an('array');
        expect(history.length).to.equal(2);
        expect(original.comment).to.equal('This is original comment');
        // History is sorted starting from most recent editted.
        expect(history[0].comment).to.equal('This is the second time the comment is edited');
        expect(history[1].comment).to.equal('This is the edited version of the comment');
        done();
      });
  });

  it('should get edit history of the comment (if user is creator of the comment)', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${articleSlug}/comment/${commentId}/history`)
      .set('authorization', `bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);

        const { original, history } = res.body;
        expect(original.comment).to.be.a('string');
        expect(history).to.be.an('array');
        expect(history.length).to.equal(2);
        expect(original.comment).to.equal('This is original comment');
        // History is sorted starting from most recent editted.
        expect(history[0].comment).to.equal('This is the second time the comment is edited');
        expect(history[1].comment).to.equal('This is the edited version of the comment');
        done();
      });
  });
});
