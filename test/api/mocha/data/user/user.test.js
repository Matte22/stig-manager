const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils.js')
const iterations = require('../../iterations.js')
const reference = require('../../referenceData.js')

describe('GET - user', () => {
  before(async function () {
    this.timeout(4000)
    await utils.uploadTestStigs()
    await utils.loadAppData()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const iteration of iterations) {

    describe(`iteration:${iteration.name}`, () => {

      describe(`GET - getUserObject - /user`, () => {

        it('Return the requesters user information - check user', async () => {
          const res = await chai
              .request(config.baseUrl)
              .get(`/user`)
              .set('Authorization', 'Bearer ' + iteration.token)

          expect(res).to.have.status(200)
          expect(res.body.username, "expect username to be current user").to.equal(iteration.name)
          for(grant of res.body.collectionGrants) {
            expect(grant).to.exist
            expect(grant).to.have.property('collection')
          }
        })
      })
      
      describe(`GET - getUsers - /user`, () => {

        it('Return a list of users accessible to the requester USERNAME', async () => {

          const res = await chai
              .request(config.baseUrl)
              .get(`/users?elevate=true&username=${reference.wfTest.username}&projection=collectionGrants&projection=statistics`)
              .set('Authorization', 'Bearer ' + iteration.token)

          if(iteration.name != "stigmanadmin"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body[0].username, "expect user to be wf-test").to.equal('wf-test')
          expect(res.body[0].userId, "expect userId to be wfTest userId").to.equal(reference.wfTest.userId)
        })
        it('Return a list of user accessible to the requester USERNAME no projections', async () => {

          const res = await chai
              .request(config.baseUrl)
              .get(`/users?elevate=true&username=${reference.wfTest.username}`)
              .set('Authorization', 'Bearer ' + iteration.token)
          if(iteration.name != "stigmanadmin"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body[0].username,"expect user to be wf-test").to.equal('wf-test')
          expect(res.body[0].userId, "expect userId to be wfTest userId").to.equal(reference.wfTest.userId)
        })
        it('Return a list of user accessible to the requester with elevate and projections', async () => {

          const res = await chai
              .request(config.baseUrl)
              .get(`/users?elevate=true&projection=collectionGrants&projection=statistics`)
              .set('Authorization', 'Bearer ' + iteration.token)
          if(iteration.name != "stigmanadmin"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body, "expect to get back all usersIds with elevate").to.be.an('array').of.length(reference.allUserIds.length)
          for(let user of res.body) {
            expect(user).to.have.property('collectionGrants')
            expect(user).to.have.property('statistics')
            expect(user).to.have.property('username')
            expect(user).to.have.property('userId')
            expect(user.userId, "expect userId to be one of the users the system").to.be.oneOf(reference.allUserIds)
          }
        })
        it('Return a list of users accessible to the requester no projections for lvl1 success. ', async () => {

          const res = await chai
              .request(config.baseUrl)
              .get(`/users`)
              .set('Authorization', 'Bearer ' + iteration.token)
    
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(reference.allUserIds.length)
          for(let user of res.body) {
            expect(user.userId, "expect userId to be one of the users the system").to.be.oneOf(reference.allUserIds)
          }
        })
      })

      describe(`GET - getUserByUserId - /users{userId}`, async () => {

        it('Return a user', async () => {
          const res = await chai
              .request(config.baseUrl)
              .get(`/users/${reference.wfTest.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
              .set('Authorization', 'Bearer ' + iteration.token)
          if(iteration.name != "stigmanadmin"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('collectionGrants')
          expect(res.body).to.have.property('statistics')
          expect(res.body.username, "expect username to be wf-Test").to.equal(reference.wfTest.username)
          expect(res.body.userId, "expect userId to be wf-Test userId (22)").to.equal(reference.wfTest.userId)
        })
      })
    })
  }
})

describe('POST - user', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    // await utils.uploadTestStigs()
  })

  for(const iteration of iterations) {
    describe(`iteration:${iteration.name}`, () => {
      describe(`POST - createUser - /users`, () => {
        it('Create a user', async () => {
          const res = await chai
              .request(config.baseUrl)
              .post(`/users?elevate=true&projection=collectionGrants&projection=statistics`)
              .set('Authorization', 'Bearer ' + iteration.token)
              .send({
                "username": "TEST_USER" +  Math.floor(Math.random() * 1000),
                "collectionGrants": [
                    {
                        "collectionId": `${reference.scrapCollection.collectionId}`,
                        "accessLevel": 1
                    }
                ]
            })
            if(iteration.name != "stigmanadmin"){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(201)
            expect(res.body).to.be.an('object')
            for(let grant of res.body.collectionGrants) {
              expect(grant).to.have.property('collection')
              expect(grant).to.have.property('accessLevel')
              expect(grant.collection.collectionId, "Expect collectionId to be scrapColleciton Id").to.equal(reference.scrapCollection.collectionId)
            }

            const createdUser = await utils.getUser(res.body.userId)

            expect(createdUser).to.be.an('object')
            expect(createdUser.username, "expecte created userId to be equal to the userId retured from API").to.equal(res.body.username)
            expect(createdUser.userId, ).to.equal(res.body.userId)
            expect(createdUser.collectionGrants).to.be.an('array')
            expect(createdUser.collectionGrants, "expect created user to have a single grant to scrap collection").to.have.lengthOf(1)
        })
      })
    })
  }
})

describe('PATCH - user', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    // await utils.uploadTestStigs()
  })

  for(const iteration of iterations) {
    describe(`iteration:${iteration.name}`, () => {

      describe(`PATCH - updateUser - /users{userId}`, async () => {

        it('Merge provided properties with a user - Change Username', async () => {
          const res = await chai
                .request(config.baseUrl)
                .patch(`/users/${reference.scrapLvl1User.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
                .set('Authorization', 'Bearer ' + iteration.token)
                .send({
                  "username": "PatchTest",
                  "collectionGrants": [
                      {
                          "collectionId": `${reference.scrapCollection.collectionId}`,
                          "accessLevel": 1
                      }
                  ]
              })
              if(iteration.name != "stigmanadmin"){
                expect(res).to.have.status(403)
                return
              }
              expect(res).to.have.status(200)
              expect(res.body.username).to.equal('PatchTest')
              expect(res.body.userId, "expect userId to be equal to scraplvl1users userId").to.equal(reference.scrapLvl1User.userId)

              for(let grant of res.body.collectionGrants) {
                expect(grant).to.have.property('collection')
                expect(grant).to.have.property('accessLevel')
                expect(grant.collection.collectionId, "expect collectionId to be scrapCollection Id").to.equal(reference.scrapCollection.collectionId)
              }

              const userEffected = await utils.getUser(res.body.userId)

              expect(userEffected).to.be.an('object')
              expect(userEffected.username, "expectthe effected user to be the one returned by the api").to.equal(res.body.username)
              expect(userEffected.userId,"expectthe effected user to be the one returned by the api").to.equal(res.body.userId)
              expect(userEffected.collectionGrants).to.be.an('array')
        })
      })
    })
  }
})

describe('PUT - user', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    // await utils.uploadTestStigs()
  })

  for(const iteration of iterations) {
    describe(`iteration:${iteration.name}`, () => {
      describe(`PUT - replaceUser - /users{userId}`, async () => {


        it(`Set all properties of a user - Change Username`, async () => {
        const res = await chai
          .request(config.baseUrl)
          .put(`/users/${reference.scrapLvl1User.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
          .set('Authorization', 'Bearer ' + iteration.token)
          .send({
            "username": "putTesting",
            "collectionGrants": [
                {
                    "collectionId": `${reference.scrapCollection.collectionId}`,
                    "accessLevel": 1
                }
            ]
          })
          if(iteration.name != "stigmanadmin"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body.username, "expect username to be putTesting").to.equal('putTesting')
          expect(res.body.userId, "expect userId to be scraplvl1").to.equal(reference.scrapLvl1User.userId)
          expect(res.body.collectionGrants).to.be.an('array')
          expect(res.body.statistics).to.be.an('object')

          for(let grant of res.body.collectionGrants) {
            expect(grant).to.have.property('collection')
            expect(grant).to.have.property('accessLevel')
            expect(grant.collection.collectionId, "expect to have grant to the scrap collection").to.equal(reference.scrapCollection.collectionId)
          }

          const userEffected = await utils.getUser(res.body.userId)

          expect(userEffected).to.be.an('object')
          expect(userEffected.username, "user effected to have username returned by API").to.equal(res.body.username)
          expect(userEffected.userId, "user effected to have Id returned by API").to.equal(res.body.userId)
          expect(userEffected.collectionGrants).to.be.an('array')

        })
      })
    })
  }
})

describe('DELETE - user', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    // await utils.uploadTestStigs()
  })

  for(const iteration of iterations) {
    describe(`iteration:${iteration.name}`, () => {

      describe(`DELETE - deleteUser - /users/{userId}`, async () => {
        it('Delete a user - fail due to user access record', async () => {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/users/${reference.testCollection.collectionOwnerID}?elevate=true&projection=collectionGrants&projection=statistics`)
            .set('Authorization', 'Bearer ' + iteration.token)
            if(iteration.name != "stigmanadmin"){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(422)
        })
        it('Delete a user - succeed, as user has never accessed the system', async () => {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/users/${reference.deleteUser.userId}?elevate=true`)
            .set('Authorization', 'Bearer ' + iteration.token)
            if(iteration.name != "stigmanadmin"){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            const userEffected = await utils.getUser("43")
            expect(userEffected, "expect empty response (user delete worked)").to.be.empty
        })
        it('Delete a user - not elevated', async () => {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/users/${43}?elevate=false`)
            .set('Authorization', 'Bearer ' + iteration.token)

            expect(res).to.have.status(403)
        })
      })
    })
  }
})
