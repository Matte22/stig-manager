const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const iterations = require('../../iterations.js')
const expectations = require('./expectations.js')
const reference = require('../../referenceData.js')
const requestBodies = require('./requestBodies.js')

const resetTestAsset = async () => {
  const put = JSON.parse(JSON.stringify(requestBodies.testAssetPut))
  const res = await utils.putAsset(reference.testAsset.assetId, put)
}

describe('DELETE - Asset', function () {

  let localTestAsset = null

  before(async function () {
    this.timeout(4000)
 //   await utils.uploadTestStigs()
    //await utils.loadAppData()
    // await utils.createDisabledCollectionsandAssets()
    // const post = JSON.parse(JSON.stringify(requestBodies.tempAssetPost))
    // post.name = 'tempAsset' + Math.floor(Math.random() * 1000)
    // localTestAsset = await utils.createTempAsset(post)
  })

  afterEach(async function () {
    this.timeout(4000)
    await resetTestAsset()
  })

  for(const iteration of iterations){
    if (expectations[iteration.name] === undefined){
      it(`No expectations for this iteration scenario: ${iteration.name}`, async function () {})
      continue
    }

    describe(`iteration:${iteration.name}`, function () {
      const distinct = expectations[iteration.name]
      describe(`deleteAssetMetadataKey - /assets/{assetId}/metadata/keys/{key}`, function () {
        it('Delete one metadata key/value of an Asset', async function () {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${reference.testAsset.assetId}/metadata/keys/${reference.testAsset.metadataKey}`)
            .set('Content-Type', 'application/json') 
            .set('Authorization', 'Bearer ' + iteration.token)
            // .send(`${JSON.stringify(requestBodies.tempAssetPost.metadata.testKey)}`)

          if(!distinct.canModifyCollection){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(204)
          
          const asset = await utils.getAsset(reference.testAsset.assetId)
          expect(asset.metadata).to.not.have.property(reference.testAsset.metadataKey)
        })
      })
      describe(`removeStigFromAsset - /assets/{assetId}/stigs/{benchmarkId}`, function () {
        it('Delete a STIG assignment to an Asset', async function () {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${localTestAsset.data.assetId}/stigs/${reference.benchmark}`)
            .set('Authorization', 'Bearer ' + iteration.token)
          if(!distinct.canModifyCollection){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)

          const asset = await utils.getAsset(localTestAsset.data.assetId)
          expect(asset.stigs).to.not.include(reference.benchmark)
        })
      })
      describe(`removeStigsFromAsset -/assets/{assetId}/stigs`, function () {
        it('Delete all STIG assignments to an Asset', async function () {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${localTestAsset.data.assetId}/stigs`)
            .set('Authorization', 'Bearer ' + iteration.token)
          if(!distinct.canModifyCollection){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          const asset = await utils.getAsset(localTestAsset.data.assetId)
          expect(asset.stigs).to.be.an('array').that.is.empty
          
        })
      })
    
      describe(`deleteAsset - /assets/{assetId}`, function () {
        before(async function () {
          this.timeout(4000)
         // await utils.loadAppData()
          // await utils.uploadTestStigs()
        })
        it('Delete test Asset', async function () {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${localTestAsset.data.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + iteration.token) 
          if(!distinct.canModifyCollection){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body.assetId).to.equal(localTestAsset.data.assetId)
          expect(res.body.statusStats.ruleCount).to.equal(reference.testAsset.stats.ruleCount)
        

          expect(res.body.stigs).to.be.an('array').of.length(reference.testAsset.validStigs.length)
          for(const stig of res.body.stigs){
            expect(stig.benchmarkId).to.be.oneOf(reference.testAsset.validStigs)
          }

          expect(res.body.stigGrants).to.be.an('array').of.length(reference.testAsset.usersWithGrant.length)
          for(const user of res.body.stigGrants){
            expect(user.users[0].userId).to.be.oneOf(reference.testAsset.usersWithGrant)
          }
        })
      })
    })
  }
})


