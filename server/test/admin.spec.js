import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import dotenv from 'dotenv';
import app from '../app';

dotenv.config();
chai.use(chaiHttp);

let superAdminToken;
let userToken;


describe('Superadmin Endpoints', () => {
  before((done) => {
    const superAdminData = {
      name: process.env.SUPER_ADMIN_USERNAME,
      password: process.env.SUPER_ADMIN_PASSWORD
    };
    chai
      .request(app)
      .post('/api/users/login')
      .send(superAdminData)
      .end((err, res) => {
        superAdminToken = res.body.user.token;
        const userData = {
          name: 'ayo',
          password: 'admin123456'
        };
        chai
          .request(app)
          .post('/api/users/login')
          .send(userData)
          .end((error, response) => {
            userToken = response.body.user.token;
            done();
          });
      });
  });
  it('should allow a superadmin to give admin permissions', (done) => {
    chai
      .request(app)
      .patch('/api/admin/ayo/upgrade')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('ayo has been granted admin priviledges');
        chai
          .request(app)
          .get('/api/profiles/ayo')
          .set('Authorization', `Bearer ${superAdminToken}`)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.user.isAdmin).to.equal(true);
            done();
          });
      });
  });
  it('should inform a superadmin when the user already has admin permissions', (done) => {
    chai
      .request(app)
      .patch('/api/admin/ayo/upgrade')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('ayo is already an admin user');
        done();
      });
  });
  it('should allow a superadmin to remove admin permissions', (done) => {
    chai
      .request(app)
      .patch('/api/admin/ayo/downgrade')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('ayo has been revoked of admin priviledges');
        chai
          .request(app)
          .get('/api/profiles/ayo')
          .set('Authorization', `Bearer ${superAdminToken}`)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.user.isAdmin).to.equal(false);
            done();
          });
      });
  });
  it('should inform a superadmin when the user does not have admin permissions', (done) => {
    chai
      .request(app)
      .patch('/api/admin/ayo/downgrade')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('ayo is not an admin user');
        done();
      });
  });
  it('should return 404 if the username is invalid', (done) => {
    chai
      .request(app)
      .patch('/api/admin/111ayo222/upgrade')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('User with username 111ayo222 does not exist');
        done();
      });
  });
  it('should return 403 if user is not a superadmin', (done) => {
    chai
      .request(app)
      .patch('/api/admin/ayo/upgrade')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.message).to.equal('Only a super admin can access this route');
        done();
      });
  });
});
