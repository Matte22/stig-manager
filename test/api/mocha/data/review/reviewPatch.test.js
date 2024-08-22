const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const reference = require('./referenceData.js')
const users = require('../../iterations.js')
const expectations = require('./expectations.js')

describe('PATCH - Review', () => {

  before(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
  })
  
  for(const user of users) {
    if (expectations[user.name] === undefined){
      it(`No expectations for this iteration scenario: ${user.name}`, async () => {})
      continue
    }
    describe(`user:${user.name}`, () => {
      const distinct = expectations[user.name]
      describe('PATCH - patchReviewByAssetRule - /collections/{collectionId}/reviews/{assetId}/{ruleId}', () => {

        beforeEach(async function () {
          this.timeout(4000)
          await utils.loadAppData()
          await utils.uploadTestStigs()
        })
        
        it('PATCH Review with new details, expect status to remain', async () => {
          const res = await chai.request(config.baseUrl)
            .patch(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${'SV-106181r1_rule'}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send({detail:"these details have changed, but the status remains"})
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body.status).to.have.property('label').that.equals('submitted')
        })
        it('PATCH Review with new result, expect status to reset to saved', async () => {
            const res = await chai.request(config.baseUrl)
              .patch(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${'SV-106181r1_rule'}`)
              .set('Authorization', `Bearer ${user.token}`)
              .send({result: "pass"})
            if(user.name === 'collectioncreator') {
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.result).to.eql("pass")
            expect(res.body.status).to.have.property('label').that.equals('saved')
        })
        it('PATCH Review to submitted status', async () => {
            const res = await chai.request(config.baseUrl)
              .patch(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${'SV-106181r1_rule'}`)
              .set('Authorization', `Bearer ${user.token}`)
              .send({status: "submitted"})
            if(user.name === 'collectioncreator') {
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.status).to.have.property('label').that.equals('submitted')
        })
        it('PATCH Review patched and no longer meets Collection Requirements', async () => {
            const res = await chai.request(config.baseUrl)
              .patch(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${'SV-106181r1_rule'}`)
              .set('Authorization', `Bearer ${user.token}`)
              .send({result: "fail"})
            if(user.name === 'collectioncreator') {
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.result).to.eql("fail")
            expect(res.body.status).to.have.property('label').that.equals('saved')
        })
        it('PATCH Review to Accepted', async () => {
          const res = await chai.request(config.baseUrl)
            .patch(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${reference.testCollection.ruleId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send({status: "accepted"})
          
          if(user.name === "lvl1" || user.name === "lvl2" || user.name === "collectioncreator") {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.have.property("touchTs").to.eql(res.body.status.ts)
          expect(res.body.status).to.have.property("ts").to.not.eql(res.body.ts)        
        })
        it('Merge provided properties with a Review', async () => {
          const res = await chai
            .request(config.baseUrl)
            .patch(
              `/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${reference.testCollection.ruleId}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send({
              result: "pass",
              detail: "test\nvisible to lvl1",
              comment: "sure",
              status: "submitted",
            })
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body.status.label).to.eql("submitted")    
          expect(res.body.result).to.eql("pass")
          expect(res.body.detail).to.eql("test\nvisible to lvl1")
          expect(res.body.comment).to.eql("sure")
        })
      })

      describe('PATCH - patchReviewMetadata - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata', () => {

        before(async function () {
          this.timeout(4000)
          await utils.loadAppData()
          await utils.uploadTestStigs()
          await utils.createDisabledCollectionsandAssets()
        })
        it('Merge metadata property/value into a Review', async () => {
          const res = await chai.request(config.baseUrl)
            .patch(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${reference.testCollection.ruleId}/metadata`)
            .set('Authorization', `Bearer ${user.token}`)
            .send({[reference.testCollection.metadataKey]: reference.testCollection.metadataValue})
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.eql({[reference.testCollection.metadataKey]: reference.testCollection.metadataValue})
        
        })
      })
    })
  }
})

