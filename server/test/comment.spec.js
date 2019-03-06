import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

let userToken;

describe('POST comment /api/articles/:slug/comment', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/users')
      .send({
        firstname: 'Chris',
        lastname: 'James',
        email: 'chreez@gmail.com',
        username: 'Chreez',
        password: '12345678'
      })
      .end((err, res) => {
        const { token } = res.body.user;
        userToken = token;
        done(err);
      });
  });

  it('should create a new comment', (done) => {
    chai.request(app)
      .post('/api/articles/this-is-an-article-1/comment')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        comment: 'This is a random comment'
      })
      .end((err, res) => {
        const { comment } = res.body.userComment;
        expect(res.status).to.be.equal(201);
        expect(comment).to.be.equal('This is a random comment');
        done(err);
      });
  });

  it('should return an error if comment is blank', (done) => {
    chai.request(app)
      .post('/api/articles/this-is-an-article-1/comment')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        comment: ''
      })
      .end((err, res) => {
        const { comment } = res.body.errors;
        expect(res.status).to.be.equal(400);
        expect(comment[0]).to.be.equal('Comment must not be empty.');
        done(err);
      });
  });

  it('should return an error if comment is not provided', (done) => {
    chai.request(app)
      .post('/api/articles/this-is-an-article-1/comment')
      .set('authorization', `Bearer ${userToken}`)
      .send({})
      .end((err, res) => {
        const { comment } = res.body.errors;
        expect(res.status).to.be.equal(400);
        expect(comment[0]).to.be.equal('Comment field must be specified.');
        done(err);
      });
  });
});

describe('PATCH update comment', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/users')
      .send({
        firstname: 'Chris',
        lastname: 'James',
        email: 'chreez2@gmail.com',
        username: 'Chreez2',
        password: '12345678'
      })
      .end((err, res) => {
        const { token } = res.body.user;
        userToken = token;
        done(err);
      });
  });

  it('should update a comment', (done) => {
    chai.request(app)
      .patch('/api/articles/this-is-an-article-1/comment/1')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        comment: 'This is an updated random comment'
      })
      .end((err, res) => {
        const { comment } = res.body.userComment;
        expect(res.status).to.be.equal(200);
        expect(comment).to.be.equal('This is an updated random comment');
        done(err);
      });
  });

  it('should return an error if comment is blank', (done) => {
    chai.request(app)
      .patch('/api/articles/this-is-an-article-1/comment/1')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        comment: ''
      })
      .end((err, res) => {
        const { comment } = res.body.errors;
        expect(res.status).to.be.equal(400);
        expect(comment[0]).to.be.equal('Comment must not be empty.');
        done(err);
      });
  });

  it('should return an error if comment is not provided', (done) => {
    chai.request(app)
      .patch('/api/articles/this-is-an-article-1/comment/1')
      .set('authorization', `Bearer ${userToken}`)
      .send({})
      .end((err, res) => {
        const { comment } = res.body.errors;
        expect(res.status).to.be.equal(400);
        expect(comment[0]).to.be.equal('Comment field must be specified.');
        done(err);
      });
  });

  it('should return an error if comment does not exist', (done) => {
    chai.request(app)
      .patch('/api/articles/this-is-an-article-1/comment/4')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        comment: 'This is an updated random comment'
      })
      .end((err, res) => {
        const { comment } = res.body.errors;
        expect(res.status).to.be.equal(404);
        expect(comment[0]).to.be.equal('Comment not found.');
        done(err);
      });
  });
});

describe('DELETE user comment', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/users')
      .send({
        firstname: 'Chris',
        lastname: 'James',
        email: 'chreez3@gmail.com',
        username: 'Chreez3',
        password: '12345678'
      })
      .end((err, res) => {
        const { token } = res.body.user;
        userToken = token;
        done(err);
      });
  });

  it('should delete a comment', (done) => {
    chai.request(app)
      .delete('/api/articles/this-is-an-article-1/comment/1')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { message } = res.body;
        expect(res.status).to.be.equal(200);
        expect(message).to.be.equal('Comment has been deleted successfully.');
        done(err);
      });
  });
});
