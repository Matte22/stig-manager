const chai = require("chai")
const chaiHttp = require("chai-http")
chai.use(chaiHttp)
const expect = chai.expect
const fs = require("fs")
const path = require("path")
const config = require("../testConfig.json")
const utils = require("../utils/testUtils")
const environment = require("../environment.json")
const reference = require("./referenceData")
const user = {
  name: "admin",
  grant: "Owner",
  token:
    "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44",
}

const lvl4 = {
    name: "lvl4",
    grant:"Owner",
    userId: "45",
    token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ3MDkxNjMsImlhdCI6MTY3MDU2ODM2NCwiYXV0aF90aW1lIjoxNjcwNTY4MzYzLCJqdGkiOiI3MTgwZjU5Yy1kNGQzLTQ0MmYtYjVlNS03NmYxMjBhOTQ3YWEiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiI5MDJjZmE0Ni02MWIzLTQ5YTctOGU4YS02ZjcwYTkzYzJhOTciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjFlYWE4NDQxLWRhZmItNGE5My04N2ZmLTFkNzM0MzdlMGVjYSIsInNlc3Npb25fc3RhdGUiOiJiZjRjY2Y0Yy03ZTQwLTQ3YjYtYjAyYi1jZmQwOWQ3MTk4OWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3RpZ21hbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy11c2VycyIsInF1ZXJ5LWdyb3VwcyIsInF1ZXJ5LXVzZXJzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbiBzdGlnLW1hbmFnZXI6c3RpZzpyZWFkIHN0aWctbWFuYWdlcjp1c2VyOnJlYWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb246cmVhZCIsInNpZCI6ImJmNGNjZjRjLTdlNDAtNDdiNi1iMDJiLWNmZDA5ZDcxOTg5ZiIsIm5hbWUiOiJsdmw0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoibHZsNCIsImdpdmVuX25hbWUiOiJsdmw0In0.RE0q9YINAiwu8XobDN_eq6UDc-uZTUYwzt2OEF5H_wk4qMnmIEq97FShPsToLYeQONHYgp6VRvaFIQqEk4IeGfzgFUhkg-rqulZIYbz7y4EnDsWE3Afa4MKL7oKrjWxNdAtg-Kp7m6LqBKHF4DCN3_EbGoJweK6aD6SH8epO53o"
}

const collectioncreator = {
    name: "collectioncreator",
    grant:"none",
    userId: "82",
    token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ3MDkyMDAsImlhdCI6MTY3MDU2ODQwMCwiYXV0aF90aW1lIjoxNjcwNTY4NDAwLCJqdGkiOiJkYTc1MWNkNy1iMWJkLTQ4MWQtOWU4MS01N2E0N2E2ZjRlYjgiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJkZDQ4ZjE5ZS04MWYwLTQ0Y2YtYTQxOC1jNGRlOThiNmI3ODMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjIyN2VlMjQyLTFiYmItNGI1Ni04NmZhLTY3ZWY2NDZlZGM5MyIsInNlc3Npb25fc3RhdGUiOiJiNmRjZjI3OS04ZmI0LTQ0NGItODUwNi0yZjQ4ZDJhNzYzYmQiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJ2aWV3LXVzZXJzIiwicXVlcnktZ3JvdXBzIiwicXVlcnktdXNlcnMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHN0aWctbWFuYWdlcjpjb2xsZWN0aW9uIHN0aWctbWFuYWdlcjpzdGlnOnJlYWQgc3RpZy1tYW5hZ2VyOnVzZXI6cmVhZCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIiwic2lkIjoiYjZkY2YyNzktOGZiNC00NDRiLTg1MDYtMmY0OGQyYTc2M2JkIiwibmFtZSI6ImNvbGxlY3Rpb24gY3JlYXRvciIsInByZWZlcnJlZF91c2VybmFtZSI6ImNvbGxlY3Rpb25jcmVhdG9yIiwiZ2l2ZW5fbmFtZSI6ImNvbGxlY3Rpb24iLCJmYW1pbHlfbmFtZSI6ImNyZWF0b3IifQ.PM2fe_hZk9NxIGuHkIDcsqgbrwoBQHHqid_coWNAfmThPCfpZHlSXFjNZww_mWj4qV_sFY9247MsUsK_EdkmZC7cxFACJgLdb0LKfbqfAdvqbuG6JCrX4qGIhZ5wvCbUq1EtwfCsIgJzi9hBy4hW__enkj55z7937swU9U05rdk"
}
describe('PATCH - updateCollection - /collections/{collectionId}', () => {

    describe('Verify manager grant restrictions', () => {

        before(async function () {
            this.timeout(4000)
            await utils.loadAppData()
            await utils.uploadTestStigs()
            await utils.createDisabledCollectionsandAssets()
        })
        it('Merge provided properties with a Collection - make admin a manager', async () => {
            const patchRequest = {
                "metadata": {
                  "pocName": "poc2Patched",
                  "pocEmail": "pocEmail@email.com",
                  "pocPhone": "12342",
                  "reqRar": "true"
                },
                  "grants": [
                      {
                        "userId": "1",
                        "accessLevel": 3
                      },
                      {
                              "userId": "21",
                          "accessLevel": 2
                      },
                      {
                              "userId": "44",
                          "accessLevel": 3
                      },
                      {
                              "userId": "45",
                          "accessLevel": 4
                      }
                  ]
              } 
        
            const res = await chai.request(config.baseUrl)
                .patch(`/collections/${environment.scrapCollection.collectionId}`)
                .set('Authorization', `Bearer ${user.token}`)
                .send(patchRequest)
            expect(res).to.have.status(200)
        })
        it('Merge provided properties with a Collection - manager attempts to change owner grant', async () => {
            const patchRequest ={
                "metadata": {
                  "pocName": "poc2Patched",
                  "pocEmail": "pocEmail@email.com",
                  "pocPhone": "12342",
                  "reqRar": "true"
                },
                  "grants": [
                      {
                        "userId": "1",
                        "accessLevel": 3
                      },
                      {
                              "userId": "21",
                          "accessLevel": 2
                      },
                      {
                              "userId": "44",
                          "accessLevel": 3
                      },
                      {
                              "userId": "45",
                          "accessLevel": 3
                      }
                  ]
              }
        
            const res = await chai.request(config.baseUrl)
                .patch(`/collections/${environment.scrapCollection.collectionId}`)
                .set('Authorization', `Bearer ${user.token}`)
                .send(patchRequest)
            expect(res).to.have.status(403)
        })
        it('Merge provided properties with a Collection - manager can set other manager grants', async () => {
            const patchRequest = {
                "metadata": {
                  "pocName": "poc2Patched",
                  "pocEmail": "pocEmail@email.com",
                  "pocPhone": "12342",
                  "reqRar": "true"
                },
                  "grants": [
                      {
                        "userId": "1",
                        "accessLevel": 3
                      },
                      {
                              "userId": "21",
                          "accessLevel": 3
                      },
                      {
                              "userId": "44",
                          "accessLevel": 2
                      },
                      {
                              "userId": "45",
                          "accessLevel": 4
                      }
                  ]
              }
        
            const res = await chai.request(config.baseUrl)
                .patch(`/collections/${environment.scrapCollection.collectionId}`)
                .set('Authorization', `Bearer ${user.token}`)
                .send(patchRequest)
            expect(res).to.have.status(200)
        })
        it('Set all properties of a Collection Copy', async () => {
            const putRequest = {
                "name": "TEST_{{$randomNoun}}-{{$randomJobType}}",
                "description": null,
                  "settings": {
                      "fields": {
                          "detail": {
                              "enabled": "always",
                              "required": "findings"
                          },
                          "comment": {
                              "enabled": "always",
                              "required": "findings"
                          }
                      },
                      "status": {
                          "canAccept": true,
                          "minAcceptGrant": 2,
                          "resetCriteria": "result"
                      }
                },
                "metadata": {
                  "pocName": "poc2Patched",
                  "pocEmail": "pocEmail@email.com",
                  "pocPhone": "12342",
                  "reqRar": "true"
                },
                  "grants": [
                      {
                        "userId": "1",
                        "accessLevel": 4
                      },
                      {
                              "userId": "21",
                          "accessLevel": 2
                      },
                      {
                              "userId": "44",
                          "accessLevel": 3
                      },
                      {
                              "userId": "45",
                          "accessLevel": 3
                      }
                  ]
              }
        
            const res = await chai.request(config.baseUrl)
                .put(`/collections/${environment.scrapCollection.collectionId}?projection=grants&projection=owners`)
                .set('Authorization', `Bearer ${user.token}`)
                .send(putRequest)
            expect(res).to.have.status(403)
        })
    })
})
describe('POST - createCollection - /collections', () => {

    describe('Collection Settings', () => {

        it('Invalid fields.detail.required value', async () => {

            const postRequest = {
                "name": "TEST_" + Math.random().toString(36).substring(7),
                "description": "Collection TEST description",
                "settings": {
                    "fields": {
                        "detail": {
                            "enabled": "findings",
                            "required": "always"
                        },
                        "comment": {
                            "enabled": "always",
                            "required": "always"
                        }
                    },
                    "status": {
                        "canAccept": true,
                        "minAcceptGrant": 3,
                        "resetCriteria": "result"
                    }
              },
                "metadata": {},
                "grants": [
                    {
                            "userId": "1",
                            "accessLevel": 4
                    }
                ]
            }
            
            const res = await chai.request(config.baseUrl)
                .post(`/collections`)
                .set('Authorization', `Bearer ${user.token}`)
                .send(postRequest)
            expect(res).to.have.status(400)
        })
    })

})
describe('PUT - setStigAssetsByCollectionUser - /collections/{collectionId}/grants/{userId}/access', () => {

    describe('gh-761 - statusStats', () =>{

        before(async function () {
            this.timeout(4000)
            await utils.loadAppData()
            await utils.uploadTestStigs()
            await utils.createDisabledCollectionsandAssets()
        })
        it('set stig-asset grant to create conditions leading to issue gh-761', async () => {

            const res = await chai.request(config.baseUrl)
                .put(`/collections/${environment.testCollection.collectionId}/grants/${environment.scrapLvl1User.userId}/access`)
                .set('Authorization', `Bearer ${user.token}`)
                .send([
                    {
                        "benchmarkId": `${environment.testCollection.benchmark}`,
                        "assetId": `${environment.testAsset.assetId}`
                    }
                ])
            expect(res).to.have.status(200)
            expect(res.body).to.have.lengthOf(1)
            for(const item of res.body){
                expect(item.benchmarkId).to.equal(environment.testCollection.benchmark)
                expect(item.asset.assetId).to.equal(environment.testAsset.assetId)
            }
        })
        it('Assets accessible to the requester (with STIG grants projection) -statusStats', async () => {

            const res = await chai.request(config.baseUrl)
                .get(`/assets?collectionId=${environment.testCollection.collectionId}&projection=statusStats&projection=stigGrants`)
                .set('Authorization', `Bearer ${user.token}`)
               
            expect(res).to.have.status(200)
                    
            let returnedAssetIds=[];
    
            var regex = new RegExp("asset")
            for (let asset of res.body){

                expect(asset.name).to.match(regex)
                returnedAssetIds.push(asset.assetId)
                expect(asset.statusStats).to.exist

                if (asset.assetId == environment.testAsset.assetId){ 
                    expect(asset.statusStats.ruleCount).to.eql(368)
                    expect(asset.statusStats.stigCount).to.eql(2)

                    expect(asset.stigGrants).to.exist
                    for (let grant of asset.stigGrants){
                        expect(grant.benchmarkId).to.be.oneOf(environment.testCollection.validStigs)
                        if(grant.benchmarkId == environment.testCollection.benchmark){
                            expect(grant.users).to.have.lengthOf(2)
                            expect(environment.scrapLvl1User.userId).to.be.oneOf(grant.users.map(user => user.userId))
                        }
                    }
                }
            }
        })
    })
})
describe('POST - cloneCollection - /collections/{collectionId}/clone', () => {    

    describe('Collection Cloning', () =>{

        before(async function () {
            this.timeout(4000)
            await utils.loadAppData()
            await utils.uploadTestStigs()
        })
        describe('clone data prep', () => {
            it('Import a new STIG - VPN R1V0 copy', async () => {
                const directoryPath = path.join(__dirname, '../../form-data-files/')
                const testStigfile = reference.testStigfile
                const filePath = path.join(directoryPath, testStigfile)
            
                const res = await chai
                    .request(config.baseUrl)
                    .post('/stigs?clobber=true&elevate=true')
                    .set('Authorization', `Bearer ${user.token}`)
                    .set('Content-Type', `multipart/form-data`)
                    .attach('importFile', fs.readFileSync(filePath), testStigfile)
                expect(res).to.have.status(200)
            })
            it('Set default rev only', async () => {

                const res = await chai.request(config.baseUrl)
                    .post(`/collections/${reference.testCollection.collectionId}/stigs/${reference.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .send({
                        "defaultRevisionStr": "V1R0"
                    })
                expect(res).to.have.status(200)
                const expectedResponse = {
                    benchmarkId: reference.benchmark,
                    title: "Virtual Private Network (VPN) Security Requirements Guide",
                    revisionStr: "V1R0",
                    benchmarkDate: "2010-07-19",
                    revisionPinned: true,
                    ruleCount: 81,
                    assetCount: 3,
                }
                expect(res.body).to.eql(expectedResponse)    
            })
        })
        describe('clone param variations', () => {
            it('clone test collection - everything matches source', async () => {

                const res = await chai.request(config.baseUrl)
                    .post(`/collections/${reference.testCollection.collectionId}/clone?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .send({
                        "name": "Clone_X" + Math.random().toString(36).substring(7),
                        "description": "clone of test collection x",
                        "options": {
                          "grants": true,
                          "labels": true,
                          "assets": true,
                          "stigMappings": "withReviews",
                          "pinRevisions": "matchSource"
                        }
                      })
                expect(res).to.have.status(200)
                let clonedCollectionId = null
                let jsonDataArray = res.body.toString().split("\n")

                for(const message of jsonDataArray){
                    if(message.length > 0){
                        let messageObject = JSON.parse(message)
                        if(messageObject.stage === "result"){
                            clonedCollectionId = messageObject.collection.collectionId
                            expect(messageObject.collection).to.have.property('grants');
                            expect(messageObject.collection.grants, "check cloned collection grants").to.eql(reference.testCollection.grantsProjected)

                            //stats
                            expect(messageObject.collection, "testing stats projection").to.have.property('statistics')
                            expect(messageObject.collection.statistics.assetCount, "assetCount").to.eql(reference.testCollection.statisticsProjected.assetCount)
                            expect(messageObject.collection.statistics.grantCount, "grant Count").to.eql(reference.testCollection.statisticsProjected.grantCount)
                            expect(messageObject.collection.statistics.checklistCount, "checklist Count").to.eql(reference.testCollection.statisticsProjected.checklistCount)

                            // labels 
                            expect(messageObject.collection).to.have.property('labels');
                            let labelProjectedResponse = []
                            for (label of messageObject.collection.labels){
                                let {labelId, ...labelCheckProps} = label
                                labelProjectedResponse.push(labelCheckProps)
                            }
                            expect(labelProjectedResponse).to.eql(reference.testCollection.labelsProjected)

                            //owners 
                            expect(messageObject.collection).to.have.property('owners');
                            let ownerProjectedResponse = []
                            for (owner of messageObject.collection.owners){
                                let {email, ...ownerCheckProps} = owner
                                ownerProjectedResponse.push(ownerCheckProps)
                            }
                            expect(ownerProjectedResponse, "checking owners were cloned").to.eql(reference.testCollection.ownersProjected)

                            //assets
                            let assetsProjectedResponse = []
                            for (asset of messageObject.collection.assets){
                                let {assetId, ...assetCheckProps} = asset
                                assetsProjectedResponse.push(assetCheckProps)
                            }                    
                            expect(assetsProjectedResponse, "checking assets were cloned").to.eql(reference.testCollection.assetsProjected)

                            //stigs 
                            expect(messageObject.collection.stigs).to.eql(reference.testCollection.stigsProjected)
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
            it('clone test collection - no grants', async () => {

                const res = await chai.request(config.baseUrl)
                .post(`/collections/${reference.testCollection.collectionId}/clone?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
                .set('Authorization', `Bearer ${user.token}`)
                .send({
                    "name": "Clone_X" + Math.random().toString(36).substring(7),
                    "description": "clone of test collection x",
                    "options": {
                      "grants": false,
                      "labels": true,
                      "assets": true,
                      "stigMappings": "withReviews",
                      "pinRevisions": "matchSource"
                    }
                  })
                expect(res).to.have.status(200)
                let clonedCollectionId = null
                let jsonDataArray = res.body.toString().split("\n")

                const grantsProjected = [
                    {
                        user: {
                            userId: "1",
                            username: "stigmanadmin",
                            displayName: "STIGMAN Admin"
                        },
                        accessLevel: 4
                    }
                ]
                const ownersProjected = [
                    {
                        userId: "1",
                        username: "stigmanadmin",
                        displayName: "STIGMAN Admin"
                    }
                ]
            
                const grantCount = 1
  
                for(const message of jsonDataArray){
                    if(message.length > 0){
                        let messageObject = JSON.parse(message)
                        if(messageObject.stage === "result"){
                            clonedCollectionId = messageObject.collection.collectionId
                            expect(messageObject.collection).to.have.property('grants');
                            expect(messageObject.collection.grants, "check cloned collection grants").to.eql(grantsProjected)

                            //stats
                            expect(messageObject.collection, "testing stats projection").to.have.property('statistics')
                            expect(messageObject.collection.statistics.assetCount, "assetCount").to.eql(reference.testCollection.statisticsProjected.assetCount)
                            expect(messageObject.collection.statistics.grantCount, "grant Count").to.eql(grantCount)
                            expect(messageObject.collection.statistics.checklistCount, "checklist Count").to.eql(reference.testCollection.statisticsProjected.checklistCount)

                            // labels 
                            expect(messageObject.collection).to.have.property('labels');
                            let labelProjectedResponse = []
                            for (label of messageObject.collection.labels){
                                let {labelId, ...labelCheckProps} = label
                                labelProjectedResponse.push(labelCheckProps)
                            }
                            expect(labelProjectedResponse).to.eql(reference.testCollection.labelsProjected)

                            //owners 
                            expect(messageObject.collection).to.have.property('owners');
                            let ownerProjectedResponse = []
                            for (owner of messageObject.collection.owners){
                                let {email, ...ownerCheckProps} = owner
                                ownerProjectedResponse.push(ownerCheckProps)
                            }
                            expect(ownerProjectedResponse, "checking owners were cloned").to.eql(ownersProjected)

                            //assets
                            let assetsProjectedResponse = []
                            for (asset of messageObject.collection.assets){
                                let {assetId, ...assetCheckProps} = asset
                                assetsProjectedResponse.push(assetCheckProps)
                            }                    
                            expect(assetsProjectedResponse, "checking assets were cloned").to.eql(reference.testCollection.assetsProjected)

                            //stigs 
                            expect(messageObject.collection.stigs).to.eql(reference.testCollection.stigsProjected)
                        }
                    }
                }
                if(clonedCollectionId !== null){
                    const clonedCollection = await utils.getCollection(clonedCollectionId)
                    expect(clonedCollection).to.exist 
                    expect(clonedCollection.grants).to.have.lengthOf(1)
                  }
            })
            it('clone test collection - no labels', async () => {

                const res = await chai.request(config.baseUrl)
                    .post(`/collections/${reference.testCollection.collectionId}/clone?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .send({
                        "name": "Clone_X" + Math.random().toString(36).substring(7),
                        "description": "clone of test collection x",
                        "options": {
                          "grants": true,
                          "labels": false,
                          "assets": true,
                          "stigMappings": "withReviews",
                          "pinRevisions": "matchSource"
                        }
                      })
                expect(res).to.have.status(200)

                let jsonDataArray = res.body.toString().split("\n")
                let clonedCollectionId = null
                const labelsProjected = []

                for(const message of jsonDataArray){
                    if(message.length > 0){
                        let messageObject = JSON.parse(message)
                        if(messageObject.stage === "result"){
                            clonedCollectionId = messageObject.collection.collectionId
                            expect(messageObject.collection).to.have.property('grants');
                            expect(messageObject.collection.grants, "check cloned collection grants").to.eql(reference.testCollection.grantsProjected)

                            //stats
                            expect(messageObject.collection, "testing stats projection").to.have.property('statistics')
                            expect(messageObject.collection.statistics.assetCount, "assetCount").to.eql(reference.testCollection.statisticsProjected.assetCount)
                            expect(messageObject.collection.statistics.grantCount, "grant Count").to.eql(reference.testCollection.statisticsProjected.grantCount)
                            expect(messageObject.collection.statistics.checklistCount, "checklist Count").to.eql(reference.testCollection.statisticsProjected.checklistCount)

                            // labels 
                            expect(messageObject.collection).to.have.property('labels');
                            let labelProjectedResponse = []
                            for (label of messageObject.collection.labels){
                                let {labelId, ...labelCheckProps} = label
                                labelProjectedResponse.push(labelCheckProps)
                            }
                            expect(labelProjectedResponse).to.eql(labelsProjected)

                            //owners 
                            expect(messageObject.collection).to.have.property('owners');
                            let ownerProjectedResponse = []
                            for (owner of messageObject.collection.owners){
                                let {email, ...ownerCheckProps} = owner
                                ownerProjectedResponse.push(ownerCheckProps)
                            }
                            expect(ownerProjectedResponse, "checking owners were cloned").to.eql(reference.testCollection.ownersProjected)

                            //assets
                            let assetsProjectedResponse = []
                            for (asset of messageObject.collection.assets){
                                let {assetId, ...assetCheckProps} = asset
                                assetsProjectedResponse.push(assetCheckProps)
                            }                    
                            expect(assetsProjectedResponse, "checking assets were cloned").to.eql(reference.testCollection.assetsProjected)

                            //stigs 
                            expect(messageObject.collection.stigs).to.eql(reference.testCollection.stigsProjected)
                        }
                    }
                }
                if(clonedCollectionId !== null){
                    const clonedCollection = await utils.getCollection(clonedCollectionId)
                    expect(clonedCollection).to.exist 
                    expect(clonedCollection.labels).to.have.lengthOf(0)
                }
            })
            it('clone test collection - no assets', async () => {

                const res = await chai.request(config.baseUrl)
                    .post(`/collections/${reference.testCollection.collectionId}/clone?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .send({
                        "name": "Clone_X" + Math.random().toString(36).substring(7),
                        "description": "clone of test collection x",
                        "options": {
                          "grants": true,
                          "labels": true,
                          "assets": false,
                          "stigMappings": "withReviews",
                          "pinRevisions": "matchSource"
                        }
                      })
                expect(res).to.have.status(200)
                let clonedCollectionId = null
                let jsonDataArray = res.body.toString().split("\n")

                const assetsProjected = []
                const assetCount = 0
                const checklistCount = 0
                const stigsProjected = []
                const labelsProjected = [
                    {
                      name: "test-label-full",
                      description: "",
                      color: "FF99CC",
                      uses: 0
                    },
                    {
                      name: "test-label-lvl1",
                      description: "",
                      color: "99CCFF",
                      uses: 0
                    }
                  ]

                for(const message of jsonDataArray){
                    if(message.length > 0){
                        let messageObject = JSON.parse(message)
                        if(messageObject.stage === "result"){
                            clonedCollectionId = messageObject.collection.collectionId
                            expect(messageObject.collection).to.have.property('grants');
                            expect(messageObject.collection.grants, "check cloned collection grants").to.eql(reference.testCollection.grantsProjected)

                            //stats
                            expect(messageObject.collection, "testing stats projection").to.have.property('statistics')
                            expect(messageObject.collection.statistics.assetCount, "assetCount").to.eql(assetCount)
                            expect(messageObject.collection.statistics.grantCount, "grant Count").to.eql(reference.testCollection.statisticsProjected.grantCount)
                            expect(messageObject.collection.statistics.checklistCount, "checklist Count").to.eql(checklistCount)

                            // labels 
                            expect(messageObject.collection).to.have.property('labels');
                            let labelProjectedResponse = []
                            for (label of messageObject.collection.labels){
                                let {labelId, ...labelCheckProps} = label
                                labelProjectedResponse.push(labelCheckProps)
                            }
                            expect(labelProjectedResponse).to.eql(labelsProjected)

                            //owners 
                            expect(messageObject.collection).to.have.property('owners');
                            let ownerProjectedResponse = []
                            for (owner of messageObject.collection.owners){
                                let {email, ...ownerCheckProps} = owner
                                ownerProjectedResponse.push(ownerCheckProps)
                            }
                            expect(ownerProjectedResponse, "checking owners were cloned").to.eql(reference.testCollection.ownersProjected)

                            //assets
                            let assetsProjectedResponse = []
                            for (asset of messageObject.collection.assets){
                                let {assetId, ...assetCheckProps} = asset
                                assetsProjectedResponse.push(assetCheckProps)
                            }                    
                            expect(assetsProjectedResponse, "checking assets were cloned").to.eql(assetsProjected)

                            //stigs 
                            expect(messageObject.collection.stigs).to.eql(stigsProjected)
                        }
                    }
                }
                if(clonedCollectionId !== null){
                    const clonedCollection = await utils.getCollection(clonedCollectionId)
                    expect(clonedCollection).to.exist 
                    expect(clonedCollection.assets).to.have.lengthOf(0)
                }
            })
            it('clone test collection - stigMapping=none', async () => {

                const res = await chai.request(config.baseUrl)
                    .post(`/collections/${reference.testCollection.collectionId}/clone?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .send({
                        "name": "Clone_X" + Math.random().toString(36).substring(7),
                        "description": "clone of test collection x",
                        "options": {
                          "grants": true,
                          "labels": true,
                          "assets": true,
                          "stigMappings": "none",
                          "pinRevisions": "matchSource"
                        }
                      })
                expect(res).to.have.status(200)
                let clonedCollectionId = null
                let jsonDataArray = res.body.toString().split("\n")

                const checklistCount = 0
                const stigsProjected = []

                for(const message of jsonDataArray){
                    if(message.length > 0){
                        let messageObject = JSON.parse(message)
                        if(messageObject.stage === "result"){
                            clonedCollectionId = messageObject.collection.collectionId
                            expect(messageObject.collection).to.have.property('grants');
                            expect(messageObject.collection.grants, "check cloned collection grants").to.eql(reference.testCollection.grantsProjected)

                            //stats
                            expect(messageObject.collection, "testing stats projection").to.have.property('statistics')
                            expect(messageObject.collection.statistics.assetCount, "assetCount").to.eql(reference.testCollection.statisticsProjected.assetCount)
                            expect(messageObject.collection.statistics.grantCount, "grant Count").to.eql(reference.testCollection.statisticsProjected.grantCount)
                            expect(messageObject.collection.statistics.checklistCount, "checklist Count").to.eql(checklistCount)

                            // labels 
                            expect(messageObject.collection).to.have.property('labels');
                            let labelProjectedResponse = []
                            for (label of messageObject.collection.labels){
                                let {labelId, ...labelCheckProps} = label
                                labelProjectedResponse.push(labelCheckProps)
                            }
                            expect(labelProjectedResponse).to.eql(reference.testCollection.labelsProjected)

                            //owners 
                            expect(messageObject.collection).to.have.property('owners');
                            let ownerProjectedResponse = []
                            for (owner of messageObject.collection.owners){
                                let {email, ...ownerCheckProps} = owner
                                ownerProjectedResponse.push(ownerCheckProps)
                            }
                            expect(ownerProjectedResponse, "checking owners were cloned").to.eql(reference.testCollection.ownersProjected)

                            //assets
                            let assetsProjectedResponse = []
                            for (asset of messageObject.collection.assets){
                                let {assetId, ...assetCheckProps} = asset
                                assetsProjectedResponse.push(assetCheckProps)
                            }                    
                            expect(assetsProjectedResponse, "checking assets were cloned").to.eql(reference.testCollection.assetsProjected)

                            //stigs 
                            expect(messageObject.collection.stigs).to.eql(stigsProjected)
                        }
                    }
                }
                if(clonedCollectionId !== null){
                    const clonedCollection = await utils.getCollection(clonedCollectionId)
                    expect(clonedCollection).to.exist 
                    expect(clonedCollection.stigs).to.have.lengthOf(0)
                    expect(clonedCollection.statistics.checklistCount).to.equal(0)
                }
            })
            it('clone test collection - stigMapping=withoutReviews', async () => {

                const res = await chai.request(config.baseUrl)
                    .post(`/collections/${reference.testCollection.collectionId}/clone?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .send({
                        "name": "Clone_X" + Math.random().toString(36).substring(7),
                        "description": "clone of test collection x",
                        "options": {
                          "grants": true,
                          "labels": true,
                          "assets": true,
                          "stigMappings": "withoutReviews",
                          "pinRevisions": "matchSource"
                        }
                      })
                expect(res).to.have.status(200)
                let clonedCollectionId = null   
                let jsonDataArray = res.body.toString().split("\n")

                for(const message of jsonDataArray){
                    if(message.length > 0){
                        let messageObject = JSON.parse(message)
                        if(messageObject.stage === "result"){
                            clonedCollectionId = messageObject.collection.collectionId
                            expect(messageObject.collection).to.have.property('grants');
                            expect(messageObject.collection.grants, "check cloned collection grants").to.eql(reference.testCollection.grantsProjected)

                            //stats
                            expect(messageObject.collection, "testing stats projection").to.have.property('statistics')
                            expect(messageObject.collection.statistics.assetCount, "assetCount").to.eql(reference.testCollection.statisticsProjected.assetCount)
                            expect(messageObject.collection.statistics.grantCount, "grant Count").to.eql(reference.testCollection.statisticsProjected.grantCount)
                            expect(messageObject.collection.statistics.checklistCount, "checklist Count").to.eql(reference.testCollection.statisticsProjected.checklistCount)

                            // labels 
                            expect(messageObject.collection).to.have.property('labels');
                            let labelProjectedResponse = []
                            for (label of messageObject.collection.labels){
                                let {labelId, ...labelCheckProps} = label
                                labelProjectedResponse.push(labelCheckProps)
                            }
                            expect(labelProjectedResponse).to.eql(reference.testCollection.labelsProjected)

                            //owners 
                            expect(messageObject.collection).to.have.property('owners');
                            let ownerProjectedResponse = []
                            for (owner of messageObject.collection.owners){
                                let {email, ...ownerCheckProps} = owner
                                ownerProjectedResponse.push(ownerCheckProps)
                            }
                            expect(ownerProjectedResponse, "checking owners were cloned").to.eql(reference.testCollection.ownersProjected)

                            //assets
                            let assetsProjectedResponse = []
                            for (asset of messageObject.collection.assets){
                                let {assetId, ...assetCheckProps} = asset
                                assetsProjectedResponse.push(assetCheckProps)
                            }                    
                            expect(assetsProjectedResponse, "checking assets were cloned").to.eql(reference.testCollection.assetsProjected)

                            //stigs 
                            expect(messageObject.collection.stigs).to.eql(reference.testCollection.stigsProjected)
                        }
                    }
                }
                if(clonedCollectionId !== null){
                    const clonedCollectionReviews = await utils.getReviews(clonedCollectionId)
                    expect(clonedCollectionReviews).to.be.empty 
                }
            })
            it('clone test collection - sourceDefaults', async () => {

                const pinnedRevision ={
                    ruleCount: 81,
                    benchmarkId: "VPN_SRG_TEST",
                    revisionStr: "V1R0",
                    benchmarkDate: "2010-07-19",
                    revisionPinned: true
                }

                const res = await chai.request(config.baseUrl)
                    .post(`/collections/${reference.testCollection.collectionId}/clone?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .send({
                        "name": "Clone_X" + Math.random().toString(36).substring(7),
                        "description": "clone of test collection x",
                        "options": {
                          "grants": true,
                          "labels": true,
                          "assets": true,
                          "stigMappings": "withReviews",
                          "pinRevisions": "sourceDefaults"
                        }
                      })
                expect(res).to.have.status(200)
                let clonedCollectionId = null
                let jsonDataArray = res.body.toString().split("\n")


                const stigsProjected = JSON.parse(JSON.stringify(reference.testCollection.stigsProjected))
                stigsProjected[1].revisionPinned = true      

                for(const message of jsonDataArray){
                    if(message.length > 0){
                        let messageObject = JSON.parse(message)
                        if(messageObject.stage === "result"){
                            clonedCollectionId = messageObject.collection.collectionId
                            expect(messageObject.collection).to.have.property('grants');
                            expect(messageObject.collection.grants, "check cloned collection grants").to.eql(reference.testCollection.grantsProjected)

                            //stats
                            expect(messageObject.collection, "testing stats projection").to.have.property('statistics')
                            expect(messageObject.collection.statistics.assetCount, "assetCount").to.eql(reference.testCollection.statisticsProjected.assetCount)
                            expect(messageObject.collection.statistics.grantCount, "grant Count").to.eql(reference.testCollection.statisticsProjected.grantCount)
                            expect(messageObject.collection.statistics.checklistCount, "checklist Count").to.eql(reference.testCollection.statisticsProjected.checklistCount)

                            // labels 
                            expect(messageObject.collection).to.have.property('labels');
                            let labelProjectedResponse = []
                            for (label of messageObject.collection.labels){
                                let {labelId, ...labelCheckProps} = label
                                labelProjectedResponse.push(labelCheckProps)
                            }
                            expect(labelProjectedResponse).to.eql(reference.testCollection.labelsProjected)

                            //owners 
                            expect(messageObject.collection).to.have.property('owners');
                            let ownerProjectedResponse = []
                            for (owner of messageObject.collection.owners){
                                let {email, ...ownerCheckProps} = owner
                                ownerProjectedResponse.push(ownerCheckProps)
                            }
                            expect(ownerProjectedResponse, "checking owners were cloned").to.eql(reference.testCollection.ownersProjected)

                            //assets
                            let assetsProjectedResponse = []
                            for (asset of messageObject.collection.assets){
                                let {assetId, ...assetCheckProps} = asset
                                assetsProjectedResponse.push(assetCheckProps)
                            }                    
                            expect(assetsProjectedResponse, "checking assets were cloned").to.eql(reference.testCollection.assetsProjected)

                            //stigs 
                            expect(messageObject.collection.stigs).to.eql(stigsProjected)
                        }
                    }
                }
                if(clonedCollectionId !== null){
                    const pinnedStig = await utils.getStigByCollectionBenchmarkId(clonedCollectionId, pinnedRevision.benchmarkId)
                    expect(pinnedStig).to.exist 
                    expect(pinnedStig.revisionPinned).to.equal(pinnedRevision.revisionPinned)
                }
            })
        })
        describe('check clone reviews', () => {

            let clonedCollectionId = null

            it('post collection for later review check', async () => {
                const res = await chai.request(config.baseUrl)
                    .post(`/collections/${reference.testCollection.collectionId}/clone?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .send({
                        "name": "Clone_X" + Math.random().toString(36).substring(7),
                        "description": "clone of test collection x",
                        "options": {
                          "grants": true,
                          "labels": true,
                          "assets": true,
                          "stigMappings": "withReviews",
                          "pinRevisions": "matchSource"
                        }
                      })
                expect(res).to.have.status(200)

                let jsonDataArray = res.body.toString().split("\n")

                for(const message of jsonDataArray){
                    if(message.length > 0){
                        let messageObject = JSON.parse(message)
                        if(messageObject.stage === "result"){
                            clonedCollectionId = messageObject.collection.collectionId
                        }
                    }
                }
            })
            it('Check Reviews in cloned collection', async () => {  

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${clonedCollectionId}/reviews`)
                    .set('Authorization', `Bearer ${user.token}`)
                expect(res).to.have.status(200)
                expect(res.body, "expect response to be array of length 14").to.have.lengthOf(14)
           
                for(const review of res.body){
                    expect(review.assetName, "expect asset to be named same as source").to.be.oneOf(reference.testCollection.assetsProjected.map(asset => asset.name))
                }
            })
        })
        describe('clone param variations - user is either not lvl4 or not collectioncreator', () => {
            it('clone test collection - lvl4 - not collectioncreator', async () => {

                const res = await chai.request(config.baseUrl)
                    .post(`/collections/${reference.testCollection.collectionId}/clone?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
                    .set('Authorization', `Bearer ${lvl4.token}`)
                    .send({
                        "name": "Clone_X" + Math.random().toString(36).substring(7),
                        "description": "clone of test collection x",
                        "options": {
                          "grants": true,
                          "labels": true,
                          "assets": true,
                          "stigMappings": "withReviews",
                          "pinRevisions": "matchSource"
                        }
                      })
                expect(res).to.have.status(403)
            })
            it('clone test collection - lvl4 - not collectioncreator', async () => {

                const res = await chai.request(config.baseUrl)
                    .post(`/collections/${reference.testCollection.collectionId}/clone?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
                    .set('Authorization', `Bearer ${collectioncreator.token}`)
                    .send({
                        "name": "Clone_X" + Math.random().toString(36).substring(7),
                        "description": "clone of test collection x",
                        "options": {
                          "grants": true,
                          "labels": true,
                          "assets": true,
                          "stigMappings": "withReviews",
                          "pinRevisions": "matchSource"
                        }
                      })
                expect(res).to.have.status(403)
            })
        })
    })
})
