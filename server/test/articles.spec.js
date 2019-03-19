import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import slugify from 'slug';
import dotenv from 'dotenv';
import models from '../database/models';
import app from '../app';

dotenv.config();
chai.use(chaiHttp);

const { ArticleComment } = models;

/**
 * Method to check if a value is a number.
 *
 * USAGE: expect(..).to.be.a.number()
 */
chai.Assertion.addMethod('number', value => typeof value === 'number');

let userToken = null;
let firstArticle;
let articleWithCover;
let createdArticle;
let secondUserToken;
let thirdUserToken;
let articleSlug;
let secondArticleSlug;
const testData = [];
export default testData;

describe('Testing articles endpoint', () => {
  // Register a user to get jwt token.
  it('should create a new user', (done) => {
    const data = {
      firstname: 'Great',
      lastname: 'Author',
      email: 'greatauthor@gmail.com',
      username: 'greatauthor',
      password: '12345678'
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
      body: 'This is the body of the article',
      tagId: 1
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
        expect(article.tagId).to.equal(1);
        testData.push(`${slugify(data.title, { lower: true })}-${article.id}`);
        testData.push(userToken);

        firstArticle = article;

        done();
      });
  });

  it('first article return default image url if no cover is uploaded', (done) => {
    expect(firstArticle.coverUrl).to.equal(process.env.DEFAULT_ARTICLE_COVER);
    done();
  });
});

// Test endpoint to get all articles.
describe('Test endpoint to get all articles.', () => {
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

        createdArticle = article;

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

  let pageOneFirstArticle;

  // The second article article will be used to test pagination
  it('should create another article', (done) => {
    // NOTE: Get all articles sorts article from most recent. So this article will Be first article
    //       when fetching all articles
    chai
      .request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        title: 'The second article',
        description: 'This is the description of the second article',
        body: 'Welcome to the second article',
        tagId: 1
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);

        pageOneFirstArticle = res.body.article;

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
          // Given that page=2 and limit=1, the id of first item on page 2 should 1 lesser than
          // the id of the first element on page 1 since the table contains only the 2
          // articles created above in this test file.
          // NB: Result set is now sorted from most recent to least recent by default.
          return arr[0].id === pageOneFirstArticle.id - 1;
        });

        done();
      });
  });
});

// Test functionality to test reading time.
describe('Testing functionality to compute reading time', () => {
  it('This test the read time functionality for word over 900', (done) => {
    const body = ['word'];

    for (let i = 0; i < 1000; i += 1) {
      body.push('word');
    }
    const data = {
      title: 'This is an article',
      description: 'This is the description of the article',
      body: body.join(' '),
      tagId: 1
    };
    chai
      .request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${userToken}`)
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        done();
      });
  });
});

// Test endpoint to return tags and tag articles
describe('Testing Tags Endpoint', () => {
  it('should return all tags', (done) => {
    chai
      .request(app)
      .get('/api/articles/tags')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.tags[0].name).to.equal('Food');
        expect(res.body.tags[1].name).to.equal('Technology');
        expect(res.body.tags[2].name).to.equal('Art');
        expect(res.body.tags[3].name).to.equal('Finance');
        expect(res.body.tags[4].name).to.equal('Health');
        done();
      });
  });

  it('should associate a tag with an article', (done) => {
    const data = {
      title: 'This is an article',
      description: 'This is the description of the article',
      body: 'This is the body of the article',
      tagId: 1
    };
    chai
      .request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${userToken}`)
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        const { article } = res.body;
        expect(article.tagId).to.equal(1);
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
    ArticleComment.create({
      userId: 1,
      articleId: createdArticle.id,
      comment:
        'This is a comment to test endpoint to toggle like an article comment'
    }).then((comment) => {
      commentId = comment.id;

      chai
        .request(app)
        .post(`/api/articles/${createdArticle.slug}/comments/${commentId}/like`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(201);

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

describe('Testing ratings functionality', () => {
  before((done) => {
    const data = {
      firstname: 'Great',
      lastname: 'Author',
      email: 'greatestauthor@gmail.com',
      username: 'greatestauthor',
      password: '12345678'
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

        secondUserToken = body.user.token;
        testData.push(secondUserToken);

        const articleData = {
          title: 'This is an article',
          description: 'This is the description of the article',
          body: 'This is the body of the article',
          tagId: 1
        };
        chai
          .request(app)
          .post('/api/articles')
          .set('authorization', `Bearer ${secondUserToken}`)
          .send(articleData)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            articleSlug = res.body.article.slug;
            const secondData = {
              firstname: 'Great',
              lastname: 'Author',
              email: 'kini@gmail.com',
              username: 'kinimaster',
              password: '12345678'
            };
            chai
              .request(app)
              .post('/api/users')
              .send(secondData)
              .end((error, response) => {
                expect(res.status).to.equal(201);
                thirdUserToken = response.body.user.token;
                done();
              });
          });
      });
  });

  it('should not allow user rate less than 1', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${articleSlug}/ratings`)
      .set('authorization', `Bearer ${userToken}`)
      .send({ rating: 0.1 })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.errors.rating[0]).to.equal('Rating must be between 1 and 5');
        done();
      });
  });
  it('should not allow user rate greater than 5', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${articleSlug}/ratings`)
      .set('authorization', `Bearer ${userToken}`)
      .send({ rating: 6 })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.errors.rating[0]).to.equal('Rating must be between 1 and 5');
        done();
      });
  });
  it('should not work if rating is not a number', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${articleSlug}/ratings`)
      .set('authorization', `Bearer ${userToken}`)
      .send({ rating: 'yyy' })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.errors.rating[0]).to.equal('Rating must be a number');
        done();
      });
  });
  it('should not work if rating is not present', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${articleSlug}/ratings`)
      .set('authorization', `Bearer ${userToken}`)
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.errors.rating[0]).to.equal('Rating is required');
        done();
      });
  });
  it('should not work if article does not exist', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${articleSlug}673536/ratings`)
      .set('authorization', `Bearer ${userToken}`)
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('article not found');

        done();
      });
  });
  it('should update the rating of an article if fields are valid', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${articleSlug}/ratings`)
      .set('authorization', `Bearer ${userToken}`)
      .send({ rating: 3 })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('You have successfully rated this article');
        chai
          .request(app)
          .get('/api/articles')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            const { articles } = res.body;
            const exactArticle = articles.find(a => a.slug === articleSlug);
            expect(Number(exactArticle.rating)).to.equal(3);

            done();
          });
      });
  });

  it('should calculate and give the average rating of an article if fields are valid', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${articleSlug}/ratings`)
      .set('authorization', `Bearer ${thirdUserToken}`)
      .send({ rating: 5 })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('You have successfully rated this article');
        chai
          .request(app)
          .get('/api/articles')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            const { articles } = res.body;
            const exactArticle = articles.find(a => a.slug === articleSlug);
            expect(Number(exactArticle.rating)).to.equal(4);

            done();
          });
      });
  });

  it('should not work if user has already rated article', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${articleSlug}/ratings`)
      .set('authorization', `Bearer ${userToken}`)
      .send({ rating: 4 })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Rating already given for this article');
        done();
      });
  });

  it('should not allow user rate his own article', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${articleSlug}/ratings`)
      .set('authorization', `Bearer ${secondUserToken}`)
      .send({ rating: 3 })
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.message).to.equal('You cant rate your own article');
        done();
      });
  });

  it('should return all the ratings for the article', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${articleSlug}/ratings`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        const { ratings } = res.body;
        expect(ratings).to.be.an('array');
        expect(ratings.length).to.be.at.least(1);
        expect(Number(ratings[0].rating)).to.equal(3);

        done();
      });
  });
});

describe('GET single article /api/articles/:slug', () => {
  it('should return 200 if article exists', (done) => {
    chai
      .request(app)
      .get('/api/articles/this-is-an-article-1')
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        const { title } = res.body.article;
        expect(res.status).to.be.equal(200);
        expect(title).to.be.equal('This is an article');
        done(err);
      });
  });
});

describe('Stats Functionality', () => {
  it('should log history when a user views someone else\'s article', (done) => {
    chai
      .request(app)
      .get('/api/articles/this-is-an-article-1')
      .set('authorization', `Bearer ${secondUserToken}`)
      .end(() => {
        chai
          .request(app)
          .get('/api/users/stats')
          .set('authorization', `Bearer ${secondUserToken}`)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            const { history } = res.body;
            expect(history[0].Article.title).to.equal('This is an article');
            done();
          });
      });
  });
  it('should not log history when a user views his own article', (done) => {
    chai
      .request(app)
      .get('/api/articles/this-is-an-article-1')
      .set('authorization', `Bearer ${userToken}`)
      .end(() => {
        chai
          .request(app)
          .get('/api/users/stats')
          .set('authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            const { history } = res.body;
            expect(history.length).to.equal(0);
            done();
          });
      });
  });

  it('should update user article', (done) => {
    chai
      .request(app)
      .patch('/api/articles/this-is-an-article-1')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        title: 'Title has changed',
        body: 'Body has been modified',
        description: 'Description has been transformed'
      })
      .end((err, res) => {
        const { article } = res.body;
        expect(article.title).to.equal('Title has changed');
        expect(res.status).to.be.equal(200);
        done(err);
      });
  });
});

describe('DELETE article /api/articles/:slug', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'some title',
        description: 'some weird talky',
        body: 'article body'
      })
      .end((err, res) => {
        secondArticleSlug = res.body.article.slug;
        done(err);
      });
  });

  it('should return 403 if user is forbidden', (done) => {
    chai
      .request(app)
      .delete(`/api/articles/${secondArticleSlug}`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(403);
        expect(res.body.message).to.be.an('string').to.equal('forbidden');
        done(err);
      });
  });

  it('should return 200 if article is deleted', (done) => {
    chai
      .request(app)
      .delete(`/api/articles/${secondArticleSlug}`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.message).to.be.an('string').to.equal('article successfully deleted');
        done(err);
      });
  });
});

const coverImageUrl = `${process.env.ARTICLE_COVER_URL_PATH}/cover-filename`;
const newCoverImageUrl = `${process.env.ARTICLE_COVER_URL_PATH}/new-cover-filename`;

describe('Test uploading cover for articles', () => {
  it('should return a 400 if cover URL is not valid', (done) => {
    chai.request(app)
      .post('/api/articles')
      .send({
        title: 'Article with a cover',
        description: 'Check out the cover included',
        body: 'This is the body of the article with a cover',
        cover: 'fake-image-url'
      })
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should upload cover when creating an article', (done) => {
    chai.request(app)
      .post('/api/articles')
      .send({
        title: 'Article with a cover',
        description: 'Check out the cover included',
        body: 'This is the body of the article with a cover',
        cover: coverImageUrl,
        tagId: 1
      })
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        const { article } = res.body;
        articleWithCover = article;
        done();
      });
  });

  it('should return correct cover url when article with uploaded cover is fetched', (done) => {
    chai.request(app)
      .get(`/api/articles/${articleWithCover.slug}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.article.coverUrl).to.equal(coverImageUrl);

        done();
      });
  });

  it('should update an article with new cover uploaded', (done) => {
    chai.request(app)
      .patch(`/api/articles/${articleWithCover.slug}`)
      .send({
        title: 'Article with a cover',
        description: 'Check out the cover included',
        body: 'This is the body of the article with a cover',
        cover: newCoverImageUrl
      })
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);

        done();
      });
  });

  it('should return correct cover url for article with cover updated', (done) => {
    chai.request(app)
      .get(`/api/articles/${articleWithCover.slug}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.article.coverUrl).to.equal(newCoverImageUrl);

        done();
      });
  });
});
