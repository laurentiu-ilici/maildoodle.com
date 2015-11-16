import supertest from 'supertest';
import app from './../universal/expressApp';
import {getMongdb} from './mongodb';

export const request = supertest(app);

export function cleanup() {
  return deleteMongoDb();
}

export function deleteMongoDb() {
  return new Promise((resolve, reject) => {
    getMongdb().then(db => {
      db.dropDatabase((err) => {
        if(err) {
          return reject(err);
        }
        return resolve();
      });
    });
  });
}

export function createUser(user) {
  const newAccount = user || {
    email: 'liviu@emaileditor.com',
    password: 'newpassword'
  };

  return new Promise((resolve, reject) => {
    request.post('/api/auth/signup')
      .set('Content-type', 'application/json')
      .send(newAccount)
      .end(() => {

        request.post('/api/auth/login')
          .set('Content-type', 'application/json')
          .send(newAccount)
          .end((err, res) => {
            if(err) {
              return reject(err);
            }
            return resolve(res.body);
          });

      });
  });
}