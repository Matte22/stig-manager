const chai = require("chai")
const chaiHttp = require("chai-http")
chai.use(chaiHttp)
const expect = chai.expect
const config = require("../../testConfig.json")
const utils = require("../../utils/testUtils")
// const environment = require("../../environment.json")
const users = require("../../iterations.js")
const expectations = require('./expectations.js')
const reference = require('./referenceData.js')
const requestBodies = require('./requestBodies.js')


describe('POST - Collection - not all tests run for all iterations', () => {
  // before(async function () {
  //   this.timeout(4000)
  //   await utils.uploadTestStigs()
  //   await utils.loadAppData()
  //   await utils.createDisabledCollectionsandAssets()
  // })

  for(const user of users) {
    if (expectations[user.name] === undefined){
      it(`No expectations for this iteration scenario: ${user.name}`, async () => {})
      continue
    }


    describe(`user:${user.name}`, () => {
      const distinct = expectations[user.name]
      
      before(async function () {
        // this.timeout(4000)
        await utils.uploadTestStigs()
        await utils.loadAppData()
        await utils.createDisabledCollectionsandAssets()
      })
  
      describe("createCollection - /collections", () => {

        // run this test once to validate EOV, I guess???
        if (user.name === "stigmanadmin") {
          it("Invalid fields.detail.required value", async () => {
            const res = await chai
              .request(config.baseUrl)
              .post(`/collections`)
              .set("Authorization", `Bearer ${user.token}`)
              .send({
                name: "{{$timestamp}}",
                description: "Collection TEST description",
                settings: {
                  fields: {
                    detail: {
                      enabled: "findings",
                      required: "always",
                    },
                    comment: {
                      enabled: "always",
                      required: "always",
                    },
                  },
                  status: {
                    canAccept: true,
                    minAcceptGrant: 3,
                    resetCriteria: "result",
                  },
                },
                metadata: {},
                grants: [
                  {
                    userId: "1",
                    accessLevel: 4,
                  },
                ],
              })
            expect(res).to.have.status(400)
          })
        }

      if (user.name === "stigmanadmin") {
        it("Missing settings", async () => {
          const res = await chai
            .request(config.baseUrl)
            .post(`/collections`)
            .set("Authorization", `Bearer ${user.token}`)
            .send({
              name: "{{$timestamp}}",
              description: "Collection TEST description",
              metadata: {},
              grants: [
                {
                  userId: "1",
                  accessLevel: 4,
                },
              ],
            })
          expect(res).to.have.status(201)
        })
      }

        it("Create a Collection and test projections", async () => {
          const post = requestBodies.createCollection
           const res = await chai
            .request(config.baseUrl)
            .post(
              `/collections?elevate=${distinct.canElevate}&projection=grants&projection=labels&projection=assets&projection=owners&projection=statistics&projection=stigs`
            )
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)
            if(distinct.canCreateCollection === false){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(201)
            if (distinct.grant === 'none') {  
              // grant = none user can create a collection, but does not give itself access to the collection
              // TODO: Should eventually be changed to respond with empty object
              return
            }
            expect(res.body.description).to.equal("Collection TEST description")
            expect(res.body.name).to.equal("TEST")
            expect(res.body.settings.fields.detail.enabled).to.equal(post.settings.fields.detail.enabled)
            expect(res.body.settings.fields.detail.required).to.equal(post.settings.fields.detail.required)
            expect(res.body.settings.fields.comment.enabled).to.equal(post.settings.fields.comment.enabled)
            expect(res.body.settings.fields.comment.required).to.equal(post.settings.fields.comment.required)
            expect(res.body.settings.status.canAccept).to.equal(post.settings.status.canAccept)
            expect(res.body.settings.status.minAcceptGrant).to.equal(post.settings.status.minAcceptGrant)
            expect(res.body.settings.status.resetCriteria).to.equal(post.settings.status.resetCriteria)
            expect(res.body.settings.history.maxReviews).to.equal(post.settings.history.maxReviews)
            expect(res.body.metadata.pocName).to.equal(post.metadata.pocName)
            expect(res.body.metadata.pocEmail).to.equal(post.metadata.pocEmail)
            expect(res.body.metadata.pocPhone).to.equal(post.metadata.pocPhone)
            expect(res.body.metadata.reqRar).to.equal(post.metadata.reqRar)

            // grants projection
            expect(res.body.grants).to.have.lengthOf(1)
            expect(res.body.grants[0].user.userId).to.equal("1")
            expect(res.body.grants[0].accessLevel).to.equal(4)

            // labels projection
            expect(res.body.labels).to.have.lengthOf(1)
            expect(res.body.labels[0].name).to.equal("TEST")
            expect(res.body.labels[0].description).to.equal("Collection label description")
            expect(res.body.labels[0].color).to.equal("ffffff")

            // assets projection
            expect(res.body.assets).to.have.lengthOf(0)

            // owners projection
            expect(res.body.owners).to.have.lengthOf(1)
            expect(res.body.owners[0].userId).to.equal("1")

            // statistics projection
            expect(res.body.statistics.assetCount).to.equal(0)
            expect(res.body.statistics.checklistCount).to.equal(0)
            expect(res.body.statistics.grantCount).to.equal(1)
        
            // stigs projection
            expect(res.body.stigs).to.have.lengthOf(0)

            // just an extra check to make sure the collection was created
            const createdCollection = await utils.getCollection(res.body.collectionId)
            expect(createdCollection).to.exist
        })
      })



      describe("cloneCollection - /collections/{collectionId}/clone", () => {

        before(async function () {
          // this.timeout(4000)
          await utils.setDefaultRevision(reference.testCollection.collectionId, reference.benchmark, reference.pinRevision)
        })

        // this test is dependant on the endpoints of the util functions to be working correctly. 
        it("clone collection for later Review check and test projections everything matches source ", async () => {

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${reference.testCollection.collectionId}/clone?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
            .set("Authorization", `Bearer ${user.token}`)
            .send({
              name:"Clone_" + Math.floor(Math.random() * 100) + "-" + Math.floor(Math.random() * 100) + "_X",
              description: "clone of test collection x",
              options: {
                grants: true,
                labels: true,
                assets: true,
                stigMappings: "withReviews",
                pinRevisions: "matchSource",
              },
            })
            let clonedCollectionId = null
            if(!(distinct.canCreateCollection && distinct.canModifyCollection)){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            const response = res.body.toString().split("\n")
            expect(response).to.be.an('array')
            for(const message of response){ 
                if(message.length > 0){
                    let messageObj = JSON.parse(message)
                    if(messageObj.stage == "result"){
                        clonedCollectionId = messageObj.collection.collectionId
                        // assets 
                        expect(messageObj.collection.assets).to.have.lengthOf(reference.testCollection.assetsProjected.length)

                        for(const asset of messageObj.collection.assets){
                          expect(asset.name).to.be.oneOf(reference.testCollection.assetsProjected.map(a => a.name))
                        }
                        // grants
                        expect(messageObj.collection.grants).to.have.same.deep.members(reference.testCollection.grantsProjected)

                        // owners
                        expect(messageObj.collection.owners).to.have.same.deep.members(reference.testCollection.ownersProjected)
                        // statistics
                        expect(messageObj.collection.statistics.assetCount).to.eql(reference.testCollection.statisticsProjected.assetCount);
                        expect(messageObj.collection.statistics.grantCount).to.eql(reference.testCollection.statisticsProjected.grantCount);
                        expect(messageObj.collection.statistics.checklistCount).to.eql(reference.testCollection.statisticsProjected.checklistCount);
                        // // stigs 
                        expect(messageObj.collection.stigs).to.eql(reference.testCollection.stigsProjected)
                        // labels
                        expect(messageObj.collection.labels).to.have.lengthOf(reference.testCollection.labelsProjected.length)
                        for(const label of messageObj.collection.labels){
                            expect(label.name).to.be.oneOf(reference.testCollection.labelsProjected.map(l => l.name))
                        }
                    }
                }
            }
            
            if(clonedCollectionId !== null){
            // check reviews are there.
            const clonedCollectionReviews = await utils.getReviews(clonedCollectionId)
            const sourceCollectionReviews = await utils.getReviews(reference.testCollection.collectionId)
            expect(clonedCollectionReviews).to.exist
            expect(sourceCollectionReviews).to.exist
            expect(clonedCollectionReviews).to.be.an('array').of.length(sourceCollectionReviews.length)
            const reviewRegex = "test"
            const assetRegex = "asset"

            for(const review of clonedCollectionReviews){
                expect(review.detail).to.match(new RegExp(reviewRegex))
                expect(review.assetName).to.match(new RegExp(assetRegex))
            }

            // compare the cloned collection with the source collection should be the same
            const clonedCollection = await utils.getCollection(clonedCollectionId)
            const sourceCollection = await utils.getCollection(reference.testCollection.collectionId)
            expect(sourceCollection).to.exist
            expect(clonedCollection).to.exist 

            for(const asset of clonedCollection.assets){
                expect(asset.name).to.be.oneOf(sourceCollection.assets.map(a => a.name))
            }
            expect(clonedCollection.assets).to.have.lengthOf(sourceCollection.assets.length)
            expect(clonedCollection.grants).to.have.lengthOf(sourceCollection.grants.length)
            expect(clonedCollection.labels).to.have.lengthOf(sourceCollection.labels.length)
            expect(clonedCollection.owners).to.have.lengthOf(sourceCollection.owners.length)
          }
        })


      //   it("clone test collection - no grants", async () => {
      //     const grantsProjected = [
      //       {
      //           user: {
      //               userId: "1",
      //               username: "stigmanadmin",
      //               displayName: "STIGMAN Admin"
      //           },
      //           accessLevel: 4
      //       }
      //   ]
      //   const ownersProjected = [
      //         {
      //             userId: "1",
      //             username: "stigmanadmin",
      //             displayName: "STIGMAN Admin"
      //         }
      //     ]

      //     const res = await chai
      //     .request(config.baseUrl)
      //     .post(`/collections/${reference.testCollection.collectionId}/clone?projection=grants&projection=owners`        )
      //     .set("Authorization", `Bearer ${user.token}`)
      //     .send({
      //       name:"Clone_" + Math.floor(Math.random() * 100) + "-" + Math.floor(Math.random() * 100) + "_X",
      //       description: "clone of test collection x",
      //       options: {
      //         grants: false,
      //         labels: true,
      //         assets: true,
      //         stigMappings: "withReviews",
      //         pinRevisions: "matchSource",
      //       },
      //     })
      //     let clonedCollectionId = null
      //     if(user.name == "lvl1" || user.name == "lvl2" || user.name == "lvl3" || user.name == "lvl4"){

      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     const response = res.body.toString().split("\n")
      //     expect(response).to.be.an('array')
      //     for(const message of response){ 
      //         if(message.length > 0){
      //             let messageObj = JSON.parse(message)
      //             if(messageObj.stage == "result"){
      //                 clonedCollectionId = messageObj.collection.collectionId
      //                 // grants
      //                 expect(messageObj.collection.owners).to.have.lengthOf(1)
      //                 for(const owner of messageObj.collection.owners){
      //                     expect(owner.userId).to.be.oneOf(ownersProjected.map(o => o.userId))
      //                 }
      //                 // owners
      //                 expect(messageObj.collection.owners).to.have.lengthOf(1)
      //                 for(const owner of messageObj.collection.owners){
      //                     expect(owner.userId).to.be.oneOf(ownersProjected.map(o => o.userId))
      //                 }
      //             }
      //         }
      //     }
      //     // make sure cloned collection is there and has correct grants.
      //     if(clonedCollectionId !== null){
      //       const clonedCollection = await utils.getCollection(clonedCollectionId)
      //       expect(clonedCollection).to.exist 
      //       expect(clonedCollection.grants).to.have.lengthOf(1)
      //     }
      //   })


      //   it("clone test collection - no labels", async () => {

      //     const res = await chai
      //     .request(config.baseUrl)
      //     .post(`/collections/${reference.testCollection.collectionId}/clone?projection=labels`        )
      //     .set("Authorization", `Bearer ${user.token}`)
      //     .send({
      //       name:"Clone_" + Math.floor(Math.random() * 100) + "-" + Math.floor(Math.random() * 100) + "_X",
      //       description: "clone of test collection x",
      //       options: {
      //         grants: true,
      //         labels: false,
      //         assets: true,
      //         stigMappings: "withReviews",
      //         pinRevisions: "matchSource",
      //       },
      //     })
      //     let clonedCollectionId = null
         
      //     if(user.name == "lvl1" || user.name == "lvl2" || user.name == "lvl3" || user.name == "lvl4"){

      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     const response = res.body.toString().split("\n")
      //     expect(response).to.be.an('array')
      //     for(const message of response){ 
      //         if(message.length > 0){
      //             let messageObj = JSON.parse(message)
      //             if(messageObj.stage == "result"){
      //                 clonedCollectionId = messageObj.collection.collectionId
      //                 // labels
      //                 expect(messageObj.collection.labels).to.have.lengthOf(0)
      //             }
      //         }
      //     }
      //     // make sure cloned collection is there and has correct labels.
      //     if(clonedCollectionId !== null){
      //       const clonedCollection = await utils.getCollection(clonedCollectionId)
      //       expect(clonedCollection).to.exist 
      //       expect(clonedCollection.labels).to.have.lengthOf(0)
      //     }
      //   })
      //   it("clone test collection - no assets", async () => {

      //     const res = await chai
      //     .request(config.baseUrl)
      //     .post(`/collections/${reference.testCollection.collectionId}/clone?projection=assets`        )
      //     .set("Authorization", `Bearer ${user.token}`)
      //     .send({
      //       name:"Clone_" + Math.floor(Math.random() * 100) + "-" + Math.floor(Math.random() * 100) + "_X",
      //       description: "clone of test collection x",
      //       options: {
      //         grants: true,
      //         labels: true,
      //         assets: false,
      //         stigMappings: "withReviews",
      //         pinRevisions: "matchSource",
      //       },
      //     })
      //     let clonedCollectionId = null
         
      //     if(user.name == "lvl1" || user.name == "lvl2" || user.name == "lvl3" || user.name == "lvl4"){

      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     const response = res.body.toString().split("\n")
      //     expect(response).to.be.an('array')
      //     for(const message of response){ 
      //         if(message.length > 0){
      //             let messageObj = JSON.parse(message)
      //             if(messageObj.stage == "result"){
      //                 clonedCollectionId = messageObj.collection.collectionId
      //                 // assets
      //                 expect(messageObj.collection.assets).to.have.lengthOf(0)
      //             }
      //         }
      //     }
      //     // make sure cloned collection is there and has correct data.
      //     if(clonedCollectionId !== null){
      //       const clonedCollection = await utils.getCollection(clonedCollectionId)
      //       expect(clonedCollection).to.exist 
      //       expect(clonedCollection.assets).to.have.lengthOf(0)
      //     }
      //   })
      //   it("clone test collection - stigMappings=none", async () => {

      //     const res = await chai
      //     .request(config.baseUrl)
      //     .post(`/collections/${reference.testCollection.collectionId}/clone?projection=statistics&projection=stigs`)
      //     .set("Authorization", `Bearer ${user.token}`)
      //     .send({
      //       name:"Clone_" + Math.floor(Math.random() * 100) + "-" + Math.floor(Math.random() * 100) + "_X",
      //       description: "clone of test collection x",
      //       options: {
      //         grants: true,
      //         labels: true,
      //         assets: true,
      //         stigMappings: "none",
      //         pinRevisions: "matchSource",
      //       },
      //     })
      //     let clonedCollectionId = null
         
      //     if(user.name == "lvl1" || user.name == "lvl2" || user.name == "lvl3" || user.name == "lvl4"){

      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     const response = res.body.toString().split("\n")
      //     expect(response).to.be.an('array')
      //     for(const message of response){ 
      //         if(message.length > 0){
      //             let messageObj = JSON.parse(message)
      //             if(messageObj.stage == "result"){
      //                 clonedCollectionId = messageObj.collection.collectionId
      //                 expect(messageObj.collection.stigs).to.have.lengthOf(0)
      //                 expect(messageObj.collection.statistics.checklistCount).to.equal(0)
      //             }
      //         }
      //     }
      //     // make sure cloned collection is there and has correct data.
      //     if(clonedCollectionId !== null){
      //       const clonedCollection = await utils.getCollection(clonedCollectionId)
      //       expect(clonedCollection).to.exist 
      //       expect(clonedCollection.stigs).to.have.lengthOf(0)
      //       expect(clonedCollection.statistics.checklistCount).to.equal(0)
      //     }
      //   })
      //   it("clone test collection - stigMappings=withoutReviews", async () => {

      //     const res = await chai
      //     .request(config.baseUrl)
      //     .post(`/collections/${reference.testCollection.collectionId}/clone?projection=statistics&projection=stigs`)
      //     .set("Authorization", `Bearer ${user.token}`)
      //     .send({
      //       name:"Clone_" + Math.floor(Math.random() * 100) + "-" + Math.floor(Math.random() * 100) + "_X",
      //       description: "clone of test collection x",
      //       options: {
      //         grants: true,
      //         labels: true,
      //         assets: true,
      //         stigMappings: "withoutReviews",
      //         pinRevisions: "matchSource",
      //       },
      //     })
      //     let clonedCollectionId = null
      
      //     if(user.name == "lvl1" || user.name == "lvl2" || user.name == "lvl3" || user.name == "lvl4"){

      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     const response = res.body.toString().split("\n")
      //     expect(response).to.be.an('array')
      //     for(const message of response){ 
      //         if(message.length > 0){
      //             let messageObj = JSON.parse(message)
      //             if(messageObj.stage == "result"){
      //                 clonedCollectionId = messageObj.collection.collectionId
      //             }
      //         }
      //     }
      //     // make sure cloned collection is there and has correct data.
      //     if(clonedCollectionId !== null){
      //       const clonedCollectionReviews = await utils.getReviews(clonedCollectionId)
      //       expect(clonedCollectionReviews).to.be.empty 
        
      //     }
      //   })
      //   it("clone test collection - pinRevisions=sourceDefaults", async () => {

      //     const pinnedRevision ={
      //       ruleCount: 81,
      //       benchmarkId: "VPN_SRG_TEST",
      //       revisionStr: "V1R0",
      //       benchmarkDate: "2010-07-19",
      //       revisionPinned: true
      //   }

      //     const res = await chai
      //     .request(config.baseUrl)
      //     .post(`/collections/${reference.testCollection.collectionId}/clone?projection=statistics&projection=stigs`)
      //     .set("Authorization", `Bearer ${user.token}`)
      //     .send({
      //       name:"Clone_" + Math.floor(Math.random() * 100) + "-" + Math.floor(Math.random() * 100) + "_X",
      //       description: "clone of test collection x",
      //       options: {
      //         grants: true,
      //         labels: true,
      //         assets: true,
      //         stigMappings: "withReviews",
      //         pinRevisions: "sourceDefaults",
      //       },
      //     })
      //     let clonedCollectionId = null
         
      //     if(user.name == "lvl1" || user.name == "lvl2" || user.name == "lvl3" || user.name == "lvl4"){

      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     const response = res.body.toString().split("\n")
      //     expect(response).to.be.an('array')
      //     for(const message of response){ 
      //         if(message.length > 0){
      //             let messageObj = JSON.parse(message)
      //             if(messageObj.stage == "result"){
      //                 clonedCollectionId = messageObj.collection.collectionId
      //                 //stigs
      //                 for(const stig of messageObj.collection.stigs){
      //                   if(stig.benchmarkId == pinnedRevision.benchmarkId){
      //                     expect(stig.revisionPinned).to.equal(pinnedRevision.revisionPinned)
      //                   }
      //                 }
      //             }
      //         }
      //     }
      //     if(clonedCollectionId !== null){
      //       const pinnedStig = await utils.getStigByCollectionBenchmarkId(clonedCollectionId, pinnedRevision.benchmarkId)
      //       expect(pinnedStig).to.exist 
      //       expect(pinnedStig.revisionPinned).to.equal(pinnedRevision.revisionPinned)
      //     }
      //   })
      })


      describe("exportToCollection - /collections/{collectionId}/export-to/{dstCollectionId}", () => {

        before(async function () {
          // this.timeout(4000)
          await utils.uploadTestStigs()
          await utils.loadAppData()
          await utils.createDisabledCollectionsandAssets()
        })
        
        it("export results to another collection - entire asset - create asset in destination", async () => {

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${reference.testCollection.collectionId}/export-to/${reference.scrapCollection.collectionId}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send([
              {
                assetId: reference.testAsset.assetId,
              },
            ])
            
            if(distinct.canModifyCollection === false){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            const response = res.body.toString().split("\n")
            expect(response).to.be.an('array')
            expect(response).to.have.lengthOf.at.least(1)

            for(const message of response){ 
                if(message.length > 0){
                    let messageObj = JSON.parse(message)
                    if(messageObj.stage == "result"){
                      expect(messageObj.counts.assetsCreated).to.eql(1)
                      expect(messageObj.counts.stigsMapped).to.eql(2)
                      expect(messageObj.counts.reviewsInserted).to.eql(9)
                      expect(messageObj.counts.reviewsUpdated).to.eql(0)
                    }
                }
            }
        })

        it("export results to another collection - entire asset - asset exists", async () => {

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${reference.testCollection.collectionId}/export-to/${reference.scrapCollection.collectionId}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send([
              {
                assetId: reference.testAsset.assetId,
              },
            ])

            if(distinct.canModifyCollection === false){
              expect(res).to.have.status(403)
              return
            }

            expect(res).to.have.status(200)
            const response = res.body.toString().split("\n")
            expect(response).to.be.an('array')
            expect(response).to.have.lengthOf.at.least(1)
            for(const message of response){ 
                if(message.length > 0){
                    let messageObj = JSON.parse(message)
                    if(messageObj.stage == "result"){
                      expect(messageObj.counts.assetsCreated).to.eql(0)
                      expect(messageObj.counts.stigsMapped).to.eql(0)
                      expect(messageObj.counts.reviewsInserted).to.eql(0)
                      expect(messageObj.counts.reviewsUpdated).to.eql(9)
                    }
                }
            }
        })
      })


      describe("createCollectionLabel - /collections/{collectionId}/labels", () => {

        it("Create Label in a Collection", async () => {

          const request = {
              "name": "test-label-POST",
              "description": "test label POSTED",
              "color": "aa34cc"
            }
          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${reference.scrapCollection.collectionId}/labels`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(request)

            if(distinct.canModifyCollection === false){
              expect(res).to.have.status(403)
              return
            }

            expect(res).to.have.status(201)
            expect(res.body.name).to.equal(request.name)
            expect(res.body.description).to.equal(request.description)
            expect(res.body.color).to.equal(request.color)
            expect(res.body.uses).to.equal(0)
        })
      })


      describe("writeStigPropsByCollectionStig - /collections/{collectionId}/stigs/{benchmarkId}", () => {
        before(async function () {
          this.timeout(4000)
          await utils.uploadTestStigs()
          await utils.loadAppData()
          await utils.createDisabledCollectionsandAssets()
        })

        it("Set the Assets mapped to a STIG - default rev and assets", async () => {

          const post = requestBodies.writeStigPropsByCollectionStig
          // {
          //   defaultRevisionStr: "V1R1",
          //   assetIds: ["62", "42", "154"],
          // }

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${reference.testCollection.collectionId}/stigs/${reference.testCollection.benchmark}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)

            if(distinct.canModifyCollection === false){
              expect(res).to.have.status(403)
              return
            }

            expect(res).to.have.status(200)
            expect(res.body.revisionStr).to.eql(requestBodies.writeStigPropsByCollectionStig.defaultRevisionStr)
            expect(res.body.revisionPinned).to.eql(true)
            expect(res.body.ruleCount).to.eql(reference.checklistLength)
            expect(res.body.benchmarkId).to.eql(reference.testCollection.benchmark)
            expect(res.body.assetCount).to.eql(requestBodies.writeStigPropsByCollectionStig.assetIds.length)
        })

        it("Set the Assets mapped to a STIG - default latest and assets", async () => {

          const post = {
            defaultRevisionStr: "latest",
            assetIds: requestBodies.writeStigPropsByCollectionStig.assetIds,
          }

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${reference.testCollection.collectionId}/stigs/${reference.testCollection.benchmark}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)

            if(distinct.canModifyCollection === false){
              expect(res).to.have.status(403)
              return
            }

            expect(res).to.have.status(200)
            expect(res.body.revisionStr).to.equal(requestBodies.writeStigPropsByCollectionStig.defaultRevisionStr)
            expect(res.body.revisionPinned).to.equal(false)
            expect(res.body.ruleCount).to.eql(reference.checklistLength)
            expect(res.body.benchmarkId).to.equal(reference.testCollection.benchmark)
            expect(res.body.assetCount).to.eql(requestBodies.writeStigPropsByCollectionStig.assetIds.length)
        })


        it("Set the Assets mapped to a STIG - assets only", async () => {

          const post = {
            assetIds: requestBodies.writeStigPropsByCollectionStig.assetIds,
          }

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${reference.testCollection.collectionId}/stigs/${reference.testCollection.benchmark}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)

            if(distinct.canModifyCollection === false){
              expect(res).to.have.status(403)
              return
            }

            expect(res).to.have.status(200)
            expect(res.body.revisionStr).to.equal(requestBodies.writeStigPropsByCollectionStig.defaultRevisionStr)
            expect(res.body.revisionPinned).to.equal(false)
            expect(res.body.ruleCount).to.eql(reference.checklistLength)
            expect(res.body.benchmarkId).to.equal(reference.testCollection.benchmark)
            expect(res.body.assetCount).to.eql(requestBodies.writeStigPropsByCollectionStig.assetIds.length)
        })


        it("Set the Assets mapped to a STIG - invalid rev - expect 422", async () => {

          const post = {
          defaultRevisionStr: "V1R5"
          }

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${reference.testCollection.collectionId}/stigs/${reference.testCollection.benchmark}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)

            if(distinct.canModifyCollection === false){
              expect(res).to.have.status(403)
              return
            }

            expect(res).to.have.status(422)
        })

        it("Set the Assets mapped to a STIG - default rev only", async () => {

          const post = {
          defaultRevisionStr: reference.testCollection.pinRevision
          }

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${reference.testCollection.collectionId}/stigs/${reference.testCollection.benchmark}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)

            if(distinct.canModifyCollection === false){
              expect(res).to.have.status(403)
              return
            }

            expect(res).to.have.status(200)
            expect(res.body.revisionStr).to.equal(reference.testCollection.pinRevision)
            expect(res.body.revisionPinned).to.equal(true)
            expect(res.body.ruleCount).to.eql(reference.checklistLength)
            expect(res.body.benchmarkId).to.equal(reference.testCollection.benchmark)
            expect(res.body.assetCount).to.eql(requestBodies.writeStigPropsByCollectionStig.assetIds.length)
        })


        it("Set the Assets mapped to a STIG - clear assets", async () => {

          const post = {
          assetIds: []
          }

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${reference.testCollection.collectionId}/stigs/${reference.testCollection.benchmark}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)

            if(distinct.canModifyCollection === false){
              expect(res).to.have.status(403)
              return
            }

            expect(res).to.have.status(204)
        })


        it("Set the Assets mapped to a STIG - after pinned delete", async () => {

          const post = {
            assetIds: requestBodies.writeStigPropsByCollectionStig.assetIds,
          }

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${reference.testCollection.collectionId}/stigs/${reference.testCollection.benchmark}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)

            if(distinct.canModifyCollection === false){
              expect(res).to.have.status(403)
              return
            }

            expect(res).to.have.status(200)
            expect(res.body.revisionStr).to.equal(reference.testCollection.defaultRevision)
            expect(res.body.revisionPinned).to.equal(false)
            expect(res.body.ruleCount).to.eql(reference.checklistLength)
            expect(res.body.benchmarkId).to.equal(reference.testCollection.benchmark)
            expect(res.body.assetCount).to.eql(requestBodies.writeStigPropsByCollectionStig.assetIds.length)
        })
      })
    })
  }
})


