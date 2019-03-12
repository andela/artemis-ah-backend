import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../app';
import db from '../database/models';

const { User, Notification, UserNotification } = db;

chai.use(chaiHttp);

let authorToken, followerToken, publishedArticle, notification;

describe('Test user notifications', () => {
  it('should add a user', (done) => {
    chai
      .request(app)
      .post('/api/users')
      .send({
        firstname: 'Notif',
        lastname: 'One',
        username: 'notifone',
        email: 'notifone@gmail.com',
        password: '123456780'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        const { token } = res.body.user;
        authorToken = token;
        done();
      });
  });

  it('should add another user', (done) => {
    chai
      .request(app)
      .post('/api/users')
      .send({
        firstname: 'Notif',
        lastname: 'Two',
        username: 'notiftwo',
        email: 'notiftwo@gmail.com',
        password: '123456780'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        const { token } = res.body.user;
        followerToken = token;
        done();
      });
  });

  it('should follow the second user', (done) => {
    chai
      .request(app)
      .post('/api/profiles/notifone/follow')
      .set('authorization', `Bearer ${followerToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('should add an article for the first user', (done) => {
    chai
      .request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${authorToken}`)
      .send({
        title: 'Notification test',
        description: 'Notification test',
        body: 'Followers will get a notification for this one'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        publishedArticle = res.body.article;
        done();
      });
  });

  it('should create a notification message', (done) => {
    Notification
      .findOne({
        where: {
          type: 'article.published',
          metaId: publishedArticle.id
        }
      })
      .then((record) => {
        expect(record).to.be.an('object');
        expect(record.url).to.equal(`/${publishedArticle.slug}`);
        expect(record.message).to.equal('Notif One just published an article');
        notification = record;
        done();
      });
  });

  it('should insert the notification into the user\'s notification table for Notif Two', (done) => {
    UserNotification
      .findOne({
        where: {
          notificationId: notification.id,
          '$User.username$': 'notiftwo',
        },
        include: [User, Notification]
      })
      .then((record) => {
        expect(record).to.be.an('object');
        expect(record.Notification.message).to.equal('Notif One just published an article');
        done();
      });
  });
});
