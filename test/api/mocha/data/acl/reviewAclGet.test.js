// const chai = require('chai')
// const chaiHttp = require('chai-http')
// chai.use(chaiHttp)
// const expect = chai.expect
// const config = require('../../testConfig.json')
// const utils = require('../../utils/testUtils.js')
// const expectations = require('./expectations.js')
// const reference = require('./referenceData.js')
// const requestBodies = require('./requestBodies.js')
// const iterations = require('./iterations.js')

// describe('GET - Test Effective ACL', () => {

//   for(const iteration of iterations){

//     // if (expectations[user.name] === undefined){
//     //   it(`No expectations for this iteration scenario: ${user.name}`, async () => {})
//     //   continue
//     // }
    
//     describe(`iteration:${iteration.name}`, () => {
//       const distinct = expectations[user.name]

//       it('set acls for this iteration', async () => {
//         const res = await chai.request(config.baseUrl)
//         .put(`/collections/${reference.testCollection.collectionId}/grants/user/${reference.grantCheckUserId}/access`)
//         .set('Authorization', `Bearer ${config.adminToken}`)
//         .send(requestBodies.iterationSetup[user.name])

//         expect(res).to.have.status(200)
//       })

//       describe(`getEffectiveAclByCollectionUser - /collection/{collectionId}/grants/user/{userId}/access/effective`, () => {

//         it('should return 200 and the effective acl for the iteration', async () => {
//           const res = await chai.request(config.baseUrl)
//           .get(`/collections/${reference.testCollection.collectionId}/grants/user/${reference.grantCheckUserId}/access/effective`)
//           .set('Authorization', `Bearer ${config.adminToken}`)
//           expect(res).to.have.status(200)
//           expect(res.body).to.deep.equal(distinct.effectiveAcl)
//         })

//       })
//     })
//   }
// })

