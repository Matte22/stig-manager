const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
// const environment = require('../../environment.json')
const users = require('../../iterations')
const expectations = require('./expectations')
const reference = require('../../referenceData.js')


describe('DELETE - Collection ', function () {

  before(async function () {
    this.timeout(4000)
    await utils.uploadTestStigs()
  })

  beforeEach(async function () {
      this.timeout(4000)
      await utils.loadAppData()
  })

  for(const user of users){
    
    if (expectations[user.name] === undefined){
      it(`No expectations for this iteration scenario: ${user.name}`,async function () {})
      continue
    }

    describe(`user:${user.name}`, function () {
      const distinct = expectations[user.name]

      describe('deleteCollection - /collections/{collectionId}', function () {
        if (user.name === 'stigmanadmin' ){

          it('Delete a Collection - elevated stigmanadmin only',async function () {
              const res = await chai.request(config.baseUrl)
                  .delete(`/collections/${reference.deleteCollection.collectionId_adminOnly}?elevate=true&projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs`)
                  .set('Authorization', `Bearer ${user.token}`)

              expect(res).to.have.status(200)

              expect(res.body.collectionId).to.equal(reference.deleteCollection.collectionId_adminOnly)

              //confirm that it is deleted
              const deletedCollection = await utils.getCollection(reference.deleteCollection.collectionId_adminOnly)
              expect(deletedCollection).to.be.undefined
          })
        }

        it('Delete a Collection no elevate',async function () {
          const res = await chai.request(config.baseUrl)
              .delete(`/collections/${reference.deleteCollection.collectionId}?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs`)
              .set('Authorization', `Bearer ${user.token}`)

          if(distinct.canDeleteCollection === false){ 
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)

          expect(res.body.collectionId).to.equal(reference.deleteCollection.collectionId)

          //confirm that it is deleted
          const deletedCollection = await utils.getCollection(reference.deleteCollection.collectionId)
          expect(deletedCollection).to.be.undefined
        })
      })

      describe('deleteCollectionLabelById - /collections/{collectionId}/labels/{labelId}', function () {

        it('Delete a Collection Label',async function () {
            const res = await chai.request(config.baseUrl)
                .delete(`/collections/${reference.scrapCollection.collectionId}/labels/${reference.scrapCollection.scrapLabel}`)
                .set('Authorization', `Bearer ${user.token}`)
            if(distinct.canModifyCollection === false){
                expect(res).to.have.status(403)
                return
            }
            expect(res).to.have.status(204)
            const collection = await utils.getCollection(reference.scrapCollection.collectionId)
            expect(collection.labels).to.not.include(reference.scrapCollection.scrapLabel)
        })
      })

      describe('deleteCollectionMetadataKey - /collections/{collectionId}/metadata/keys/{key}', function () {

        it('Delete a Collection Metadata Key',async function () {
            const res = await chai.request(config.baseUrl)
                .delete(`/collections/${reference.scrapCollection.collectionId}/metadata/keys/${reference.scrapCollection.collectionMetadataKey}`)
                .set('Authorization', `Bearer ${user.token}`)

              if(distinct.canModifyCollection === false){
                expect(res).to.have.status(403)
                return
              }

              expect(res).to.have.status(204)
              const collection = await utils.getCollection(reference.scrapCollection.collectionId)
              expect(collection.metadata).to.not.have.property(reference.scrapCollection.collectionMetadataKey)
        })
      })

      describe('deleteReviewHistoryByCollection - /collections/{collectionId}/review-history', function () {

        it('History records - date',async function () {
            const res = await chai.request(config.baseUrl)
                .delete(`/collections/${reference.testCollection.collectionId}/review-history?retentionDate=${reference.testCollection.reviewHistory.endDate}`)
                .set('Authorization', `Bearer ${user.token}`)
                
            if(distinct.canModifyCollection === false){
              expect(res).to.have.status(403)
              return
            }
  
            expect(res).to.have.status(200)
            expect(res.body.HistoryEntriesDeleted).to.be.equal(reference.testCollection.reviewHistory.deletedEntriesByDate)
        })

        it('History records - date and asset',async function () {
            const res = await chai.request(config.baseUrl)
                .delete(`/collections/${reference.testCollection.collectionId}/review-history?retentionDate=${reference.testCollection.reviewHistory.endDate}&assetId=${reference.testCollection.testAssetId}`)
                .set('Authorization', `Bearer ${user.token}`)

              if(distinct.canModifyCollection === false){
                expect(res).to.have.status(403)
                return
              }
  
            expect(res).to.have.status(200)
            expect(res.body.HistoryEntriesDeleted).to.be.equal(reference.testCollection.reviewHistory.deletedEntriesByDateAsset)
        })
      })
    })
  }
})

