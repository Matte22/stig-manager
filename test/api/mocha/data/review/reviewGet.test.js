const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const expectations = require('./expectations.js')
const reference = require('./referenceData.js')
const users = require('../../iterations.js')

describe('GET - Review', () => {
  before(async function () {
    this.timeout(4000)
    await utils.uploadTestStigs()
    await utils.loadAppData()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users){
    if (expectations[user.name] === undefined){
      it(`No expectations for this iteration scenario: ${user.name}`, async () => {})
      continue
    }
    describe(`user:${user.name}`, () => {
      const distinct = expectations[user.name]
      describe('GET - getReviewsByCollection - /collections/{collectionId}/reviews', () => {
        it('Return a list of reviews accessible to the requester', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews?projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)

          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')

          for(let review of res.body){
            expect(review.assetId).to.be.oneOf(reference.testCollection.assetIds)
            for(let assetLabelId of review.assetLabelIds){
              expect(assetLabelId).to.be.oneOf(reference.testAsset.labels)
            }
            for(let stig of review.stigs){
              expect(stig.benchmarkId).to.be.oneOf(reference.testCollection.validStigs)
            }
            if(review.assetId === reference.testAsset.assetId){
              expect(review.status.label).to.be.oneOf(['saved', 'submitted'])
              expect(review.ruleId).to.be.oneOf(reference.testAsset.reviewRuleIds)
            }
          }
        })
        it('Return a list of reviews accessible to the requester, assetId Projection.', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews?assetId=${reference.testAsset.assetId}&projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
    
          expect(res.body).to.be.lengthOf(distinct.testAsset.reviewsAvailableToUser)

          for(let review of res.body){
            expect(review.assetId).to.be.equal(reference.testAsset.assetId)
            for(let assetLabelId of review.assetLabelIds){
              expect(assetLabelId).to.be.oneOf(reference.testAsset.labels)
            }
            for(let stig of review.stigs){
              expect(stig).to.have.property('benchmarkId')
              expect(stig.benchmarkId).to.be.oneOf(reference.testCollection.validStigs)
            }
            if(review.assetId === reference.testAsset.assetId){
              expect(review.status.label).to.be.oneOf(['saved', 'submitted'])
              expect(review.ruleId).to.be.oneOf(reference.testAsset.reviewRuleIds)
            }
          }
        })
        it('Return a list of reviews accessible to the requester, benchmarkId Projection.', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews?benchmarkId=${reference.benchmark}&projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.lengthOf(distinct.testCollection.reviewsForTestBenchmark)
          for(let review of res.body){
            for(let stig of review.stigs){
              expect(stig).to.have.property('benchmarkId')
              expect(stig.benchmarkId).to.be.equal(reference.testCollection.benchmark)
            }        
          }
        })
        it('Return a list of reviews accessible to the requester, metadata Projection.', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews?projection=rule&projection=stigs&metadata=${reference.testCollection.metadataKey}%3A${reference.testCollection.metadataValue}&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.be.lengthOf(1)

          for(let review of res.body){
            expect(review.metadata).to.be.an('object')
            expect(review.metadata).to.have.property(reference.testCollection.metadataKey)
            expect(review.metadata[reference.testCollection.metadataKey]).to.be.equal(reference.testCollection.metadataValue)
          }
        })
        it('Return a list of reviews accessible to the requester, result projection fail only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews?result=fail&projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.be.lengthOf(distinct.testCollection.reviewsForResultFailAllAssets)
        
          for(let review of res.body){
            expect(review.result).to.be.equal('fail')
          }
        })
        it('Return a list of reviews accessible to the requester, ruleid projection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews?ruleId=${reference.testCollection.ruleId}&projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.lengthOf(distinct.testCollection.reviewsForTestRuleId)

          for(let review of res.body){
            expect(review.ruleId).to.be.equal(reference.testCollection.ruleId)
            expect(review.rule.ruleId).to.be.equal(reference.testCollection.ruleId)
            expect(review.ruleIds).to.include(reference.testCollection.ruleId)
          }
        })
        it('Return a list of reviews accessible to the requester, status projection: saved.', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews?status=saved&projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.be.lengthOf(distinct.testCollection.reviewsForStatusSaved)

          for(let review of res.body){
            expect(review.status.label).to.be.equal('saved')
          }
        })
        it('Return a list of reviews accessible to the requester, userId projection.', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews?userId=${reference.stigmanadmin.userId}&projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.lengthOf(distinct.testCollection.reviewsForStigmanadmin)

          for(let review of res.body){
            expect(review.userId).to.be.equal(reference.stigmanadmin.userId)
          }
        })
      })
      describe('GET - getReviewsByAsset - /collections/{collectionId}/reviews/{assetId}', () => {
        it('Return a list of Reviews for an Asset', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}?projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(distinct.testAsset.reviewsAvailableToUser)
          for(let review of res.body){
            expect(review.assetId).to.be.equal(reference.testAsset.assetId)
            for(let assetLabelId of review.assetLabelIds){
              expect(assetLabelId).to.be.oneOf(reference.testAsset.labels)
            }
            for(let stig of review.stigs){
              expect(stig.benchmarkId).to.be.oneOf(reference.testAsset.validStigs)
              
            }
            if(review.ruleId === reference.testAsset.testRuleId){
              expect(review.metadata, "metadata").to.eql({[reference.testAsset.metadataKey]: reference.testAsset.metadataValue})
              expect(review.status.label, "expect review to be submitted").to.be.oneOf(['submitted'])
              expect(review.result, "expect result to be pass").to.eql('pass')
              for(const stig of review.stigs){
                expect(stig.benchmarkId, "expect stig attached to be test bernchmark").to.be.equal(reference.benchmark)
                expect(stig.ruleCount, "Expect 81 rules for vpn srg test").to.be.equal(reference.checklistLength)
                expect(stig.revisionStr, "expect default reviison").to.be.equal(reference.revisionStr)
              }
            }
            else{
              expect(review.metadata).to.be.empty
            }
          }
        })
        it('Return a list of Reviews for an Asset, benchmarkId Projection.', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}?benchmarkId=${reference.benchmark}&projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.be.lengthOf(reference.testAsset.testBenchmarkReviews)

          for(let review of res.body){
            expect(review.assetId).to.be.equal(reference.testAsset.assetId)
            for(let stig of review.stigs){
              expect(stig).to.have.property('benchmarkId')
              expect(stig.benchmarkId).to.be.equal(reference.testCollection.benchmark)
            }
            if(review.ruleId === reference.testAsset.testRuleId){
              expect(review.metadata, "metadata").to.eql({[reference.testAsset.metadataKey]: reference.testAsset.metadataValue})
              expect(review.status.label, "expect review to be submitted").to.be.oneOf(['submitted'])
              expect(review.result, "expect result to be pass").to.eql('pass')
              for(const stig of review.stigs){
                expect(stig.benchmarkId, "expect stig attached to be test bernchmark").to.be.equal(reference.benchmark)
                expect(stig.ruleCount, "Expect 81 rules for vpn srg test").to.be.equal(reference.checklistLength)
                expect(stig.revisionStr, "expect default reviison").to.be.equal(reference.revisionStr)
              }
            }
          }
        })
        it('Return a list of Reviews for an Asset , metadata Projection.', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}?projection=rule&projection=stigs&metadata=${reference.testAsset.metadataKey}%3A${reference.testAsset.metadataValue}&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.be.lengthOf(1)

          for(let review of res.body){
            expect(review.assetId).to.be.equal(reference.testAsset.assetId)
            expect(review.metadata).to.be.an('object')
            expect(review.metadata).to.have.property(reference.testCollection.metadataKey)
            expect(review.metadata[reference.testCollection.metadataKey]).to.be.equal(reference.testCollection.metadataValue)
          }
        })
        it('Return a list of reviews accessible to the requester, result projection pass only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}?result=pass&projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
         
          expect(res.body).to.be.lengthOf(distinct.testAsset.reviewsForResultPass)
        

          for(let review of res.body){
            expect(review.assetId).to.be.equal(reference.testAsset.assetId)
            expect(review.result).to.be.equal('pass')
          }
        })
        it('Return a list of reviews accessible to the requester, result projection fail only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}?result=fail&projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.be.lengthOf(distinct.testAsset.reviewsForResultFail)

          for(let review of res.body){
            expect(review.assetId).to.be.equal(reference.testAsset.assetId)
            expect(review.result).to.be.equal('fail')
          }
        })
        it('Return a list of reviews accessible to the requester, result projection informational only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}?result=informational&projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.be.lengthOf(0)

          for(let review of res.body){
            expect(review.assetId).to.be.equal(reference.testAsset.assetId)
            expect(review.result).to.be.equal('informational')
          }
        })
        it('Return a list of reviews accessible to the requester, status projection: saved.', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}?status=saved&projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.be.lengthOf(distinct.testAsset.reviewsForStatusSaved)
         

          for(let review of res.body){
            expect(review.assetId).to.be.equal(reference.testAsset.assetId)
            expect(review.status.label).to.be.equal('saved')
          }
        })
        it('Return a list of reviews accessible to the requester, status projection: submitted.', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}?status=submitted&projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.be.lengthOf(distinct.testAsset.reviewsForStatusSubmitted)
          
          for(let review of res.body){
            expect(review.assetId).to.be.equal(reference.testAsset.assetId)
            expect(review.status.label).to.be.equal('submitted')
          }
        })
      })
      describe('GET - getReviewByAssetRule - /collections/{collectionId}/reviews/{assetId}/{ruleId}', () => {

        it('Return the Review for an Asset and Rule', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${reference.testCollection.ruleId}?projection=rule&projection=stigs&projection=metadata&projection=history`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')

          const review = res.body
        
          // checking for basic properties
          expect(review.rule.ruleId).to.be.equal(reference.testCollection.ruleId)
          expect(review.metadata).to.have.property(reference.testCollection.metadataKey)
          expect(review.metadata[reference.testCollection.metadataKey]).to.be.equal(reference.testCollection.metadataValue)
          for(let stig of review.stigs){
            expect(stig.benchmarkId, "expect stig attached to be test bernchmark").to.be.equal(reference.benchmark)
            expect(stig.ruleCount, "Expect 81 rules for vpn srg test").to.be.equal(reference.checklistLength)
            expect(stig.revisionStr, "expect default reviison").to.be.equal(reference.revisionStr)
          }
          expect(review.assetLabelIds).to.include.members(reference.testAsset.labels)
          expect(review.status.label, "expect review to be submitted").to.be.oneOf(['submitted'])
          expect(review.result, "expect result to be pass").to.eql('pass')
        })
      })
      describe('GET - getReviewMetadata - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata', () => {

        it('Return the metadata for a Review', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${reference.testCollection.ruleId}/metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property(reference.testAsset.metadataKey)
          expect(res.body[reference.testAsset.metadataKey]).to.be.equal(reference.testAsset.metadataValue)
        })
      })
      describe('GET - getReviewMetadataKeys - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata/keys', () => {
          
          it('Return the Review Metadata KEYS for an Asset and Rule', async () => {
            const res = await chai.request(config.baseUrl)
              .get(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${reference.testCollection.ruleId}/metadata/keys`)
              .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'collectioncreator') {
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            expect(res.body).to.be.lengthOf(1)
            expect(res.body).to.include(reference.testAsset.metadataKey)
          })
      })
      describe('GET - getReviewMetadataValue - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata/keys/{key}', () => {

        it('Return the Review Metadata VALUE for an Asset/Rule/metadata KEY', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${reference.testCollection.ruleId}/metadata/keys/${reference.testAsset.metadataKey}`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'collectioncreator') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('string')
          expect(res.body).to.equal(reference.testAsset.metadataValue)  
        })
      })
    })
  }
})

