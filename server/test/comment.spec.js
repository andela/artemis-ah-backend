import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

let userToken;
let commentId;

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
    chai
      .request(app)
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
    chai
      .request(app)
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
    chai
      .request(app)
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

  it('should create a new comment', (done) => {
    chai.request(app)
      .post('/api/articles/this-is-an-article-1/comment')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        comment: 'This is a random comment from Chreez2'
      })
      .end((err, res) => {
        const { comment, id } = res.body.userComment;
        commentId = id;
        expect(res.status).to.be.equal(201);
        expect(comment).to.be.equal('This is a random comment from Chreez2');
        done(err);
      });
  });

  it('should update a comment', (done) => {
    chai.request(app)
      .patch(`/api/articles/this-is-an-article-1/comment/${commentId}`)
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
      .patch(`/api/articles/this-is-an-article-1/comment/${commentId}`)
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
      .patch(`/api/articles/this-is-an-article-1/comment/${commentId}`)
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
      .patch('/api/articles/this-is-an-article-1/comment/100')
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

describe('GET comments of a single article', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/users')
      .send({
        firstname: 'Chris',
        lastname: 'James',
        email: 'chr2@gmail.com',
        username: 'Chr2',
        password: '12345678'
      })
      .end((err, res) => {
        const { token } = res.body.user;
        userToken = token;
        done(err);
      });
  });
  it('should return 200 and get comments for an article', (done) => {
    chai.request(app)
      .get('/api/articles/this-is-an-article-1/comments')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Comments successfully retrieved');
        expect(res.body.comments[0].hasLiked).to.be.equal(false);
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

  it('should create a new comment', (done) => {
    chai.request(app)
      .post('/api/articles/this-is-an-article-1/comment')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        comment: 'This is a random comment from Chreez3'
      })
      .end((err, res) => {
        const { comment, id } = res.body.userComment;
        commentId = id;
        expect(res.status).to.be.equal(201);
        expect(comment).to.be.equal('This is a random comment from Chreez3');
        done(err);
      });
  });

  it('should delete a comment', (done) => {
    chai.request(app)
      .delete(`/api/articles/this-is-an-article-1/comment/${commentId}`)
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { message } = res.body;
        expect(res.status).to.be.equal(200);
        expect(message).to.be.equal('Comment has been deleted successfully.');
        done(err);
      });
  });
});

describe('POST highlighted comment /api/articles/:slug/highlight', () => {
  const articleURL = '/api/articles';
  let theArticleSlug = '';
  it('should create an article', (done) => {
    chai
      .request(app)
      .post(articleURL)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'some title',
        description: 'some weird talk',
        body: 'article body'
      })
      .end((err, res) => {
        theArticleSlug = res.body.article.slug;
        done();
      });
  });

  it('Should create a highlight', (done) => {
    chai.request(app)
      .post(`/api/articles/${theArticleSlug}/highlight`)
      .set('authorization', `Bearer ${userToken}`)
      .send({
        highlighted: 'article',
        index: 0,
        comment: 'Just testing the highlight here'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body.message).to.be.equal('Comment created successfully');
        done(err);
      });
  });

  it('Should not create a highlight without an index', (done) => {
    chai.request(app)
      .post(`/api/articles/${theArticleSlug}/highlight`)
      .set('authorization', `Bearer ${userToken}`)
      .send({
        highlighted: 'article',
        comment: 'Just testing the highlight here'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.be.equal('index required');
        done(err);
      });
  });

  it('Should not create a highlight if index is not a number', (done) => {
    chai.request(app)
      .post(`/api/articles/${theArticleSlug}/highlight`)
      .set('authorization', `Bearer ${userToken}`)
      .send({
        highlighted: 'article',
        index: 'boo',
        comment: 'Just testing the highlight here'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.be.equal('index should be a number');
        done(err);
      });
  });

  it('Should not create a highlight without a highlighted sring', (done) => {
    chai.request(app)
      .post(`/api/articles/${theArticleSlug}/highlight`)
      .set('authorization', `Bearer ${userToken}`)
      .send({
        index: 0,
        comment: 'Just testing the highlight here'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.be.equal('highlighted required');
        done(err);
      });
  });

  it('Should not create a highlight when highlighted text is less than 1', (done) => {
    chai.request(app)
      .post(`/api/articles/${theArticleSlug}/highlight`)
      .set('authorization', `Bearer ${userToken}`)
      .send({
        highlighted: '',
        index: 0,
        comment: 'Just testing the highlight here'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.be.equal('invalid highlighted text');
        done(err);
      });
  });
});
