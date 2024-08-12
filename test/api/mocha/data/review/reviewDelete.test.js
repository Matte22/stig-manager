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
      return
    }
    describe(`user:${user.name}`, () => {
      describe('DELETE - deleteReviewByAssetRule - /collections/{collectionId}/reviews/{assetId}/{ruleId}', () => {

        beforeEach(async function () {
          this.timeout(4000)
          await utils.loadAppData()
          await utils.uploadTestStigs()
      })
        
        it('Delete a Review', async () => {
          const res = await chai.request(config.baseUrl)
            .delete(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}?projection=rule&projection=history&projection=stigs`)
            .set('Authorization', `Bearer ${user.token}`)

          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('rule')
          expect(res.body).to.have.property('history')
          expect(res.body).to.have.property('stigs')
        })
        it('Delete a Review - freshRuleId - review may or may not exist', async () => {
          const res = await chai.request(config.baseUrl)
            .delete(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.freshRuleId}?projection=rule&projection=history&projection=stigs`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(204)
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
            .delete(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}/metadata/keys/${environment.testCollection.metadataKey}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(`${JSON.stringify(environment.testCollection.metadataValue)}`)
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