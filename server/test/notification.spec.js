import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../app';

chai.use(chaiHttp);

let author, follower;

describe('Test notification for articles from users you follow', () => {
  it('should create an author user', (done) => {
    chai
      .request(app)
      .post('/api/users')
      .send({
        firstname: 'Author',
        lastname: 'Notification',
        username: 'authornotif',
        email: 'authornotif@gmail.com',
        password: '1234567890'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        author = res.body.user;
        done();
      });
  });

  it('should create a follower user', (done) => {
    chai
      .request(app)
      .post('/api/users')
      .send({
        firstname: 'Follower',
        lastname: 'Notification',
        username: 'followernotif',
        email: 'followernotif@gmail.com',
        password: '1234567890'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        follower = res.body.user;
        done();
      });
  });

  it('second user should follow author successfully', (done) => {
    chai
      .request(app)
      .post(`/api/profiles/${author.username}/follow`)
      .set('authorization', `Bearer ${follower.token}`)
      .end((err, res) => {
        expect(res.status).to.equal(201);

        done();
      });
  });

  it('author should create an article successfully', (done) => {
    chai
      .request(app)
      .post('/api/articles')
      .send({
        title: 'My follower will be notified',
        description: 'My follower will be notified',
        body: 'My follower will be notified'
      })
      .set('authorization', `Bearer ${author.token}`)
      .end((err, res) => {
        expect(res.status).to.equal(201);

        done();
      });
  });
});
