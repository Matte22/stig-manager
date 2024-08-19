const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
// const environment = require('../../environment.json')
const users = require('../../iterations.js')
const expectations = require('./expectations.js')
const reference = require('./referenceData.js')
const requestBodies = require('./requestBodies.js')

describe('PATCH - Collection', function () {

    before(async function () {
        this.timeout(4000)
        await utils.uploadTestStigs()
        await utils.loadAppData()
    })

    for(const user of users) {
      const distinct = expectations[user.name]
      if (expectations[user.name] === undefined){
        it(`No expectations for this iteration scenario: ${user.name}`,async function () {})
        return
      }
  

      describe(`user:${user.name}`, function () {

        describe('updateCollection - /collections/{collectionId}', function () {

          it('Merge provided properties with a Collection',async function () {

            const patchRequest = requestBodies.updateCollection            
            const res = await chai.request(config.baseUrl)
                  .patch(`/collections/${reference.scrapCollection.collectionId}?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs`)
                  .set('Authorization', `Bearer ${user.token}`)
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
            
            // make sure userids are the same 
            for(const grant of res.body.grants) {
                expect(grant.user.userId).to.be.oneOf(patchRequest.grants.map(g => g.userId))
            }

            // projections  --- TODO:  these responses call the GET service, which is tested elsewhere, so do we need to double-check it here?
            // expect(res.body.assets).to.have.lengthOf(3)
            // expect(res.body.owners).to.have.lengthOf(3)
            expect(res.body.statistics).to.have.property("assetCount").to.equal(res.body.assets.length)

            for(let stig of res.body.stigs) {
                expect(stig.benchmarkId).to.be.oneOf(reference.scrapCollection.validStigs)
            }
          })
        })

        describe('patchCollectionLabelById - /collections/{collectionId}/labels/{labelId}', function () {

          it('Merge provided properties with a Collection Label',async function () {
            const body = requestBodies.patchCollectionLabelById
            const res = await chai.request(config.baseUrl)
                .patch(`/collections/${reference.scrapCollection.collectionId}/labels/${reference.scrapCollection.scrapLabel}`)
                .set('Authorization', `Bearer ${user.token}`)
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

          it('Merge metadata property/value into a Collection',async function () {
              
              const res = await chai.request(config.baseUrl)
                  .patch(`/collections/${reference.scrapCollection.collectionId}/metadata`)
                  .set('Authorization', `Bearer ${user.token}`)
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
