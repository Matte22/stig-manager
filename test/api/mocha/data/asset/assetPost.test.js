const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const users = require('../../iterations.js')
const expectations = require('./expectations.js')
const reference = require('../../referenceData.js')

describe('POST - Asset', function () {
  before(async function () {
    this.timeout(4000)
    await utils.uploadTestStigs()
    await utils.loadAppData()
    await utils.createDisabledCollectionsandAssets()
  })

  for (const user of users) {
    if (expectations[user.name] === undefined){
      it(`No expectations for this iteration scenario: ${user.name}`, async function () {})
      continue
    }
    describe(`user:${user.name}`, function () {
      const distinct = expectations[user.name]
      describe(`createAsset - /assets`, function () {

        it('Create an Asset (with stigs projection)', async function () {
          const res = await chai
            .request(config.baseUrl)
            .post('/assets?projection=stigs')
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              name: 'TestAsset' + Math.floor(Math.random() * 1000),
              collectionId: reference.testCollection.collectionId,
              description: 'test',
              ip: '1.1.1.1',
              noncomputing: true,
              labelIds: [reference.testCollection.fullLabel],
              metadata: {
                pocName: 'pocName',
                pocEmail: 'pocEmail@example.com',
                pocPhone: '12345',
                reqRar: 'true'
              },
              stigs: reference.testCollection.validStigs
            }
          )
          
          if(!distinct.canModifyCollection){
            expect(res).to.have.status(403)
            return
          }
            expect(res).to.have.status(201)
          
          expect(assetGetToPost(res.body)).to.eql(res.request._data)

          const effectedAsset = await utils.getAsset(res.body.assetId)

          expect(effectedAsset.collection.collectionId).to.equal(reference.testCollection.collectionId)
          for(const stig of effectedAsset.stigs) { 
            expect(stig.benchmarkId).to.be.oneOf(reference.testCollection.validStigs)
          }
          expect(effectedAsset.description).to.equal('test')
        })

        it('Create an Asset (with statusStats projection', async function () {
          const res = await chai
            .request(config.baseUrl)
            .post('/assets?projection=statusStats')
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              name: 'TestAsset' + Math.floor(Math.random() * 1000),
              collectionId: reference.testCollection.collectionId,
              description: 'test',
              ip: '1.1.1.1',
              noncomputing: true,
              labelIds: [reference.testCollection.fullLabel],
              metadata: {
                pocName: 'pocName',
                pocEmail: 'pocEmail@example.com',
                pocPhone: '12345',
                reqRar: 'true'
              },
              stigs: reference.testCollection.validStigs
            })
          
            if(!distinct.canModifyCollection){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(201)
            
            expect(res.body).to.have.property('statusStats')
            expect(res.body.statusStats.ruleCount).to.equal(reference.testAsset.stats.ruleCount)

            const effectedAsset = await utils.getAsset(res.body.assetId)

            expect(effectedAsset.statusStats.ruleCount).to.equal(reference.testAsset.stats.ruleCount)

        })

        it('Create an Asset (with stigGrants projection)', async function () {
          const res = await chai
            .request(config.baseUrl)
            .post('/assets?projection=stigGrants')
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              name: 'TestAsset' + Math.floor(Math.random() * 1000),
              collectionId: reference.testCollection.collectionId,
              description: 'test',
              ip: '1.1.1.1',
              noncomputing: true,
              labelIds: [reference.testCollection.fullLabel],
              metadata: {
                pocName: 'pocName',
                pocEmail: 'pocEmail@example.com',
                pocPhone: '12345',
                reqRar: 'true'
              },
              stigs: reference.testCollection.validStigs
            })
          
          if(!distinct.canModifyCollection){
            expect(res).to.have.status(403)
            return
          }
          
          expect(res).to.have.status(201)
           
          for(const stig of res.body.stigGrants) {
            expect(stig.benchmarkId).to.be.oneOf(reference.testCollection.validStigs)
          }
          const effectedAsset = await utils.getAsset(res.body.assetId)
          for(const stig of effectedAsset.stigGrants) {
            expect(stig.benchmarkId).to.be.oneOf(reference.testCollection.validStigs)
          }
        })
      })
    })
  }
})

function assetGetToPost (assetGet) {
  // extract the transformed and unposted properties
  const { assetId, collection, stigs, mac, fqdn, ...assetPost } = assetGet

  // add transformed properties to the derived post
  assetPost.collectionId = collection.collectionId
  assetPost.stigs = stigsGetToPost(stigs)

  // the derived post object
  return assetPost
}

function stigsGetToPost (stigsGetArray) {
  const stigsPostArray = []
  for (const stig of stigsGetArray) {
    stigsPostArray.push(stig.benchmarkId)
  }
  return stigsPostArray
}
