import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../app';

chai.use(chaiHttp);

let userToken1;
let userToken2;
let adminToken;
let articleSlug;
let reportId;
const data = {
  firstUser: {
    name: 'ayo',
    password: 'admin123456'
  },
  secondUser: {
    name: 'bayo',
    password: 'admin123456'
  },
  admin: {
    name: 'admin',
    password: 'admin123456'
  },
  createArticle: {
    title: 'article title',
    description: 'article description',
    body: 'article body'
  }
};

describe('POST report /api/articles/:slug/report', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/users/login')
      .send(data.firstUser)
      .end((err, res) => {
        userToken1 = res.body.user.token;
        done(err);
      });
  });

  before((done) => {
    chai
      .request(app)
      .post('/api/users/login')
      .send(data.secondUser)
      .end((err, res) => {
        userToken2 = res.body.user.token;
        done(err);
      });
  });

  before((done) => {
    chai
      .request(app)
      .post('/api/users/login')
      .send(data.admin)
      .end((err, res) => {
        adminToken = res.body.user.token;
        done(err);
      });
  });

  before((done) => {
    chai
      .request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${userToken1}`)
      .send(data.createArticle)
      .end((err, res) => {
        articleSlug = res.body.article.slug;
        done(err);
      });
  });

  it('should report an article', (done) => {
    chai.request(app)
      .post(`/api/articles/${articleSlug}/report`)
      .set('authorization', `Bearer ${userToken2}`)
      .send({
        report: 'This is a random report',
        category: 'abusive'
      })
      .end((err, res) => {
        reportId = res.body.reportArticle.id;
        expect(res.status).to.be.equal(201);
        expect(res.body.message).to.equal('Article reported successfully');
        done(err);
      });
  });

  it('should not allow user report its own article', (done) => {
    chai.request(app)
      .post(`/api/articles/${articleSlug}/report`)
      .set('authorization', `Bearer ${userToken1}`)
      .send({
        report: 'This is a random report',
        category: 'abusive'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(403);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('You can not report your own article');
        done(err);
      });
  });

  it('should check if admin user is authorized', (done) => {
    chai.request(app)
      .get('/api/admin/reports')
      .set('authorization', `Bearer ${userToken1}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body.message).to.equal('You are Unauthorized to access this page');
        done(err);
      });
  });

  it('should check if report category is invalid', (done) => {
    chai.request(app)
      .post(`/api/articles/${articleSlug}/report`)
      .set('authorization', `Bearer ${userToken1}`)
      .send({
        report: 'This is a random report',
        category: 'Abus'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Category can either be Plagiarism, Inappropriate, or Abusive');
        done(err);
      });
  });

  it('should check if report body is empty', (done) => {
    chai.request(app)
      .post(`/api/articles/${articleSlug}/report`)
      .set('authorization', `Bearer ${userToken1}`)
      .send({
        report: '',
        category: 'abusive'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Please enter a report');
        done(err);
      });
  });

  it('should check if article does not exist', (done) => {
    chai.request(app)
      .post(`/api/articles/${articleSlug}a/report`)
      .set('authorization', `Bearer ${userToken1}`)
      .send({
        report: 'this is some report',
        category: 'abusive'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('article not found');
        done(err);
      });
  });
});

// Fetch all user reports
describe('GET report /api/admin/reports', () => {
  it('should fetch all reports', (done) => {
    chai.request(app)
      .get('/api/admin/reports')
      .set('authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.reports).to.be.an('array');
        done(err);
      });
  });

  it('should fetch reports for a given category', (done) => {
    chai.request(app)
      .get('/api/admin/reports?category=abusive')
      .set('authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        const { reports } = res.body;
        expect(res.status).to.be.equal(200);
        expect(reports[0].category).to.be.equal('abusive');
        expect(reports[0].status).to.be.equal('Unresolved');
        done(err);
      });
  });
});

// Fetch a single user report
describe('GET a specific report', () => {
  it('should fetch a single report', (done) => {
    chai.request(app)
      .get(`/api/admin/reports/${reportId}`)
      .set('authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.report).to.be.an('object');
        done(err);
      });
  });

  it('should check if a report id does not exist', (done) => {
    chai.request(app)
      .get(`/api/admin/reports/${reportId}0`)
      .set('authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.equal('Report not found');
        done(err);
      });
  });

  it('should check if a report id is invalid', (done) => {
    chai.request(app)
      .get(`/api/admin/reports/${reportId}0aa`)
      .set('authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.equal('Report ID must be an integer.');
        done(err);
      });
  });

  it('should check if admin user is authorized', (done) => {
    chai.request(app)
      .get('/api/admin/reports')
      .set('authorization', `Bearer ${userToken1}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body.message).to.equal('You are Unauthorized to access this page');
        done(err);
      });
  });
});

// Update the status of a user report
describe('PATCH report /api/admin/reports/:id/status', () => {
  it('should update the status of a report', (done) => {
    chai.request(app)
      .patch(`/api/admin/reports/${reportId}/status`)
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        status: 'Resolved'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.message).to.equal('Report status Updated');
        done(err);
      });
  });

  it('should check if status input is correct', (done) => {
    chai.request(app)
      .patch(`/api/admin/reports/${reportId}/status`)
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        status: 'approved'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.equal('Status can either be Resolved or Unresolved');
        done(err);
      });
  });

  it('should check if report exist', (done) => {
    chai.request(app)
      .patch(`/api/admin/reports/${reportId}1/status`)
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        status: 'Unresolved'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.equal('Report not found');
        done(err);
      });
  });
});
