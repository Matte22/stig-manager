const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const users = require('../../iterations.js')
const expectations = require('./expectations.js')
const reference = require('./referenceData.js')

describe('DELETE - Collection', () => {

  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users){
    if (expectations[user.name] === undefined){
      it(`No expectations for this iteration scenario: ${user.name}`, async () => {})
      continue
    }

    describe(`user:${user.name}`, () => {
      const distinct = expectations[user.name]
      describe(`deleteAssetMetadataKey - /assets/{assetId}/metadata/keys/{key}`, () => {
        it('Delete one metadata key/value of an Asset', async () => {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${reference.scrapAsset.assetId}/metadata/keys/${reference.scrapAsset.metadataKey}`)
            .set('Content-Type', 'application/json') 
            .set('Authorization', 'Bearer ' + user.token)
            .send(`${JSON.stringify(reference.scrapAsset.metadataValue)}`)

          if(!distinct.canModifyAssets){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(204)
          
          const asset = await utils.getAsset(reference.scrapAsset.assetId)
          expect(asset.metadata).to.not.have.property(reference.scrapAsset.metadataKey)
        })
      })
      describe(`removeStigsFromAsset -/assets/{assetId}/stigs`, () => {
        it('Delete all STIG assignments to an Asset', async () => {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${reference.scrapAsset.assetId}/stigs`)
            .set('Authorization', 'Bearer ' + user.token)
          if(!distinct.canModifyAssets){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          const asset = await utils.getAsset(reference.scrapAsset.assetId)
          expect(asset.stigs).to.be.an('array').that.is.empty
          
        })
      })
      describe(`removeStigFromAsset - /assets/{assetId}/stigs/{benchmarkId}`, () => {
        it('Delete a STIG assignment to an Asset', async () => {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${reference.scrapAsset.assetId}/stigs/${reference.scrapAsset.scrapBenchmark}`)
            .set('Authorization', 'Bearer ' + user.token)
          if(!distinct.canModifyAssets){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)

          const asset = await utils.getAsset(reference.scrapAsset.assetId)
          expect(asset.stigs).to.not.include(reference.scrapAsset.scrapBenchmark)
        })
      })
      describe(`deleteAsset - /assets/{assetId}`, () => {
        before(async function () {
          this.timeout(4000)
          await utils.loadAppData()
          await utils.uploadTestStigs()
          await utils.createDisabledCollectionsandAssets()
        })

        it('Delete an Asset in test collection', async () => {

          // creating a test asset to delete
          // this might need preivledges? 
          const tempAsset = await utils.createTempAsset({
              name: 'tempAsset',
              collectionId: reference.scrapCollection.collectionId,
              description: 'temp',
              ip: '1.1.1.1',
              noncomputing: true,
              labelIds: [],
              metadata: {
                pocName: 'pocName',
                pocEmail: 'pocEmail@example.com',
                pocPhone: '12345',
                reqRar: 'true'
              },
              stigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST']
            })

        const assetId = tempAsset.data.assetId
        const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)
        if(!distinct.canModifyAssets){
          expect(res).to.have.status(403)
          return
        }
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('assetId')
        expect(res.body.assetId).to.equal(assetId)
        })

        it('Delete test Asset', async () => {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${reference.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token) 
          if(!distinct.canModifyAssets){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body.assetId).to.equal(reference.testAsset.assetId)
        })
      })
    })
  }
})


