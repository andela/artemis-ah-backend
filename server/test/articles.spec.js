import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import slugify from 'slug';
import models from '../database/models';
import app from '../app';

chai.use(chaiHttp);

const { ArticleComment } = models;

/**
 * Method to check if a value is a number.
 *
 * USAGE: expect(..).to.be.a.number()
 */
chai.Assertion.addMethod('number', value => typeof value === 'number');

let userToken, createdArticle;

describe('Testing articles endpoint', () => {
  // Register a user to get jwt token.
  it('should create a new user', (done) => {
    const data = {
      firstname: 'Great',
      lastname: 'Author',
      email: 'greatauthor@gmail.com',
      username: 'greatauthor',
      password: '1234567'
    };
    chai
      .request(app)
      .post('/api/users')
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(201);

        const { body } = res;
        expect(body.message).to.be.a('string');
        expect(body.message).to.equal('user created successfully');

        userToken = body.user.token;

        done();
      });
  });

  // Test creating article.
  it('should create a new article', (done) => {
    const data = {
      title: 'This is an article',
      description: 'This is the description of the article',
      body: 'This is the body of the article'
    };
    chai
      .request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${userToken}`)
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(201);

        const { article } = res.body;
        expect(article.id).to.be.a.number();
        expect(article.title).to.equal('This is an article');
        expect(article.slug).to.equal(`${slugify(data.title, { lower: true })}-${article.id}`);
        expect(article.description).to.equal('This is the description of the article');
        expect(article.body).to.equal('This is the body of the article');

        createdArticle = article;

        done();
      });
  });

  // Test endpoint to get all articles.
  describe('Test endpoint to get all articles.', () => {
    let pageOneFirstArticle = null;

    it('should get an array containing the article created above', (done) => {
      chai
        .request(app)
        .get('/api/articles')
        .end((err, res) => {
          expect(res.status).to.equal(200);

          const { articles } = res.body;
          expect(articles).to.be.an('array');
          expect(articles.length).to.be.at.least(1);
          const [article] = articles;
          pageOneFirstArticle = article;

          done();
        });
    });

    // Test limit.
    it('should return an empty array given limit is 0', (done) => {
      chai
        .request(app)
        .get('/api/articles?limit=0')
        .end((err, res) => {
          expect(res.status).to.equal(200);

          const { articles } = res.body;
          expect(articles).to.be.an('array');
          expect(articles.length).to.equal(0);

          done();
        });
    });

    // The second article article will be used to test pagination
    it('should create another article', (done) => {
      chai
        .request(app)
        .post('/api/articles')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          title: 'The second article',
          description: 'This is the description of the second article',
          body: 'Welcome to the second article'
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);

          done();
        });
    });

    // Test pagination.
    it('should return the articles on page 2', (done) => {
      chai
        .request(app)
        .get('/api/articles?page=2&limit=1')
        .end((err, res) => {
          expect(res.status).to.equal(200);

          const { articles } = res.body;
          expect(articles).to.be.an('array');

          expect(articles).to.satisfy((arr) => {
            if (arr.length === 0) {
              // Assuming there is nothing on page 2
              return true;
            }
            // Given that page=2 and limit=1, the id of first item on page 2 should 1 greater than
            // the id of the first element on page 1 since the table contains only the 2
            // articles created in this test file.
            return arr[0].id === pageOneFirstArticle.id + 1;
          });

          done();
        });
    });
  });

  /*
   * Test endpoint to like article.
   */
  describe('Test endpoint to like article comment: POST /articles/:slug/comments/:id/like', () => {
    it('should return 404 for incorrect slug', (done) => {
      chai
        .request(app)
        .post('/api/articles/this-article-does-not-exists-190893893974837/comments/0/like')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Article does not exists');

          done();
        });
    });

    it('should return 404 for incorrect comment id', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${createdArticle.slug}/comments/0/like`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Comment does not exists');

          done();
        });
    });

    let commentId;
    it('should add a like when called first time by a user', (done) => {
      ArticleComment
        .create({
          userId: 1,
          articleId: createdArticle.id,
          comment: 'This is a comment to test endpoint to toggle like an article comment',
        })
        .then((comment) => {
          commentId = comment.id;

          chai
            .request(app)
            .post(`/api/articles/${createdArticle.slug}/comments/${commentId}/like`)
            .set('authorization', `Bearer ${userToken}`)
            .end((err, res) => {
              expect(res.status).to.equal(200);

              const { body } = res;
              expect(body.totalLikes).to.equal(1);
              expect(body.liked).to.equal(true);

              done();
            });
        });
    });

    it('should remove a like when called second time by the same user', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${createdArticle.slug}/comments/${commentId}/like`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);

          const { body } = res;
          expect(body.totalLikes).to.equal(0);
          expect(body.liked).to.equal(false);

          done();
        });
    });
  });
});
