const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const users = require('../../iterations.js')
const expectations = require('./expectations.js')
const reference = require('./referenceData.js')

describe('DELETE - Review', () => {
    
  for(const user of users) {
    if (expectations[user.name] === undefined){
      it(`No expectations for this iteration scenario: ${user.name}`, async () => {})
      continue
    }
    describe(`user:${user.name}`, () => {
      const distinct = expectations[user.name]
      describe('DELETE - deleteReviewByAssetRule - /collections/{collectionId}/reviews/{assetId}/{ruleId}', () => {

        beforeEach(async function () {
          this.timeout(4000)
          await utils.loadAppData()
          await utils.uploadTestStigs()
        })
        
        it('Delete a Review', async () => {
          const res = await chai.request(config.baseUrl)
            .delete(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${reference.testAsset.testRuleId}?projection=rule&projection=history&projection=stigs`)
            .set('Authorization', `Bearer ${user.token}`)

          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)

          expect(res.body.assetId).to.equal(reference.testAsset.assetId)
          expect(res.body.rule.ruleId).to.equal(reference.testAsset.testRuleId)
          expect(res.body.history).to.be.an('array').of.length(reference.testAsset.testRuleIdHistoryCount)
          expect(res.body.stigs).to.be.an('array').of.length(reference.testAsset.testRuleIdStigCount)

          for(const history of res.body.history) {
            expect(history.ruleId).to.equal(reference.testAsset.testRuleId)
          }

          for(const stig of res.body.stigs) { 
            expect(reference.testAsset.validStigs).to.include(stig.benchmarkId)
          }
       
        })
      })

      describe('DELETE - deleteReviewMetadataKey - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata/keys/{key}', () => {

        before(async function () {
          this.timeout(4000)
          await utils.loadAppData()
          await utils.uploadTestStigs()
          await utils.createDisabledCollectionsandAssets()
        })

        it('Delete one metadata key/value of a Review', async () => {
          const res = await chai.request(config.baseUrl)
            .delete(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${reference.testAsset.testRuleId}/metadata/keys/${reference.testCollection.collectionMetadataKey}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(`${JSON.stringify(reference.testCollection.collectionMetadataValue)}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(204)
        })
      })
    })
  }
})