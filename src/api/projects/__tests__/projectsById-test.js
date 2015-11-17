import {expect} from 'chai';
import {request, cleanup, createUser} from './../../supertest';

describe('projectModule tests', () => {
  let currentUser;
  let addedProject;
  let newProject = {
    name: 'new project',
    description: 'new project description'
  };

  const createProjectRequest = () => request.post('/api/projects')
    .set('Content-type', 'application/json')
    .set('Authorization', `Bearer ${currentUser.sessionToken}`)
    .send(newProject);

  const getProjectByIdRequest = () => request.get(`/api/projects/${addedProject.objectId}`)
    .set('Content-type', 'application/json')
    .set('Authorization', `Bearer ${currentUser.sessionToken}`);

  beforeEach((done) => {
    cleanup()
      .then(() => createUser())
      .then((user) => {
        currentUser = user
      })
      .then(() => done())
      .catch((err) => done(err));
  });

  describe('When inserting a project', () => {
    beforeEach((done) => {
      addedProject = undefined;
      createProjectRequest().end((err, res) => {
        if (err) {
          return done(err);
        }
        addedProject = res.body;
        return done();
      });
    });

    it('Should make the request with success', () => {
      expect(addedProject).to.not.be.undefined;
    });

    describe('When getting the project by id', () => {
      let project;
      beforeEach((done) => {
        getProjectByIdRequest().end((err, res) => {
          if (err) {
            return done(err);
          }
          project = res.body;
          return done();
        });
      });

      it('Should make the request with success', () => {
        expect(project).to.not.be.undefined;
      });

      it('Should contain an email templates list', () => {
        expect(project.templates).to.deep.equal([]);
      });

      it('Should contain an empty languages list', () => {
        expect(project.languages).to.deep.equal([]);
      });

      it('Should contain an empty layouts list', () => {
        expect(project.layouts).to.deep.equal([]);
      });
    });
  });
});