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

describe('PATCH - Collection', function () {

    before(async function () {
        this.timeout(4000)
        await utils.uploadTestStigs()
        await utils.loadAppData()
    })

    for(const iteration of iterations) {
      const distinct = expectations[iteration.name]
      if (expectations[iteration.name] === undefined){
        it(`No expectations for this iteration scenario: ${iteration.name}`,async function () {})
        return
      }

      describe(`iteration:${iteration.name}`, function () {

        describe('updateCollection - /collections/{collectionId}', function () {
          it('Patch scrap collection, send 5 new grants and metadata.',async function () {

            const patchRequest = requestBodies.updateCollection            
            const res = await chai.request(config.baseUrl)
                  .patch(`/collections/${reference.scrapCollection.collectionId}?&projection=grants&projection=stigs`)
                  .set('Authorization', `Bearer ${iteration.token}`)
                  .send(patchRequest)
            
                if(distinct.canModifyCollection === false){
                    expect(res).to.have.status(403)
                    return
                }
            expect(res).to.have.status(200)

            expect(res.body.metadata.pocName).to.equal(patchRequest.metadata.pocName)
            expect(res.body.metadata.pocEmail).to.equal(patchRequest.metadata.pocEmail)
            expect(res.body.metadata.pocPhone).to.equal(patchRequest.metadata.pocPhone)
            expect(res.body.metadata.reqRar).to.equal(patchRequest.metadata.reqRar)

            expect(res.body.grants).to.have.lengthOf(patchRequest.grants.length)
            for(let stig of res.body.stigs) {
                expect(stig.benchmarkId).to.be.oneOf(reference.scrapCollection.validStigs)
                if(stig.benchmarkId === reference.benchmark){
                    expect(stig.ruleCount).to.equal(reference.checklistLength)
                }
            }
          })
        })

        describe('patchCollectionLabelById - /collections/{collectionId}/labels/{labelId}', function () {
          it('Patch scrap collection label, change color, description and name ',async function () {
            const body = requestBodies.patchCollectionLabelById
            const res = await chai.request(config.baseUrl)
                .patch(`/collections/${reference.scrapCollection.collectionId}/labels/${reference.scrapCollection.scrapLabel}`)
                .set('Authorization', `Bearer ${iteration.token}`)
                .send(body)
                
              if(distinct.canModifyCollection === false){
                expect(res).to.have.status(403)
                return
              }
              expect(res).to.have.status(200)
  
              expect(res.body.labelId).to.equal(reference.scrapCollection.scrapLabel)
              expect(res.body.description).to.equal(body.description)
              expect(res.body.color).to.equal(body.color)
              expect(res.body.name).to.equal(body.name)
          })
        })

        describe('patchCollectionMetadata - /collections/{collectionId}/metadata', function () {

          it('Patch scrap collection metadata',async function () {
              
              const res = await chai.request(config.baseUrl)
                  .patch(`/collections/${reference.scrapCollection.collectionId}/metadata`)
                  .set('Authorization', `Bearer ${iteration.token}`)
                  .send({[reference.scrapCollection.collectionMetadataKey]: reference.scrapCollection.collectionMetadataValue})

                if(distinct.canModifyCollection === false){
                  expect(res).to.have.status(403)
                  return
                }

                expect(res).to.have.status(200)
                expect(res.body).to.contain({[reference.scrapCollection.collectionMetadataKey]: reference.scrapCollection.collectionMetadataValue})
          })
        })
      })
    }
})
