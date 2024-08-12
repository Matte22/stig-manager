const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const xml2js = require('xml2js');
const users = require('../../iterations.js')
const expectations = require('./expectations.js')
const reference = require('./referenceData.js')

describe('PUT - Review', () => {

    let deletedCollection, deletedAsset
    before(async function () {
        this.timeout(4000)
        await utils.uploadTestStigs()
        await utils.loadAppData()
        const deletedItems = await utils.createDisabledCollectionsandAssets()
        deletedCollection = deletedItems.collection
        deletedAsset = deletedItems.asset
    })

    for(const user of users){
        if (expectations[user.name] === undefined){
            it(`No expectations for this iteration scenario: ${user.name}`, async () => {})
            return
        }
        describe(`user:${user.name}`, () => {

            describe('PUT - putReviewByAssetRule - /collections/{collectionId}/reviews/{assetId}/{ruleId}', () => {

                it('PUT Review: no resultEngine - check response does not include "resultEngine": 0', async () => {

                    const putBody = {
                        result: 'pass',
                        detail: 'test',
                        comment: null,
                        status: 'saved'
                    }

                    const res = await chai.request(config.baseUrl)
                        .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.freshRuleId}`)
                        .set('Authorization', `Bearer ${user.token}`)
                        .send(putBody)
                    if(user.name === 'collectioncreator') {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(201)
                    const expectedResponse = {  
                        assetId: "42",
                        assetName: "Collection_X_lvl1_asset-1",
                        assetLabelIds: [
                        "755b8a28-9a68-11ec-b1bc-0242ac110002",
                        "5130dc84-9a68-11ec-b1bc-0242ac110002"
                        ],
                        ruleId: environment.freshRuleId,
                    ruleIds: [
                        environment.freshRuleId
                        ],  
                        result: putBody.result,
                        resultEngine: null,
                        detail: putBody.detail,
                        autoResult: false,
                        comment: "",
                        userId: user.userId,
                        username: user.name,
                        ts: res.body.ts,
                        touchTs: res.body.touchTs,
                        status: {
                            ts: res.body.status.ts,
                            text: null,
                            user: {
                                userId: user.userId,
                                username: user.name
                            },
                            label: putBody.status
                        }
                    }
                
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.eql(expectedResponse)
                })
                it('PUT Review: accepted, pass, no detail', async () => {

                    const putBody = {
                        result: 'pass',
                        detail: '',
                        comment: 'sure',
                        status: 'accepted',
                        autoResult: false
                    }

                    const res = await chai.request(config.baseUrl)
                        .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}`)
                        .set('Authorization', `Bearer ${user.token}`)
                        .send(putBody)

                    expect(res).to.have.status(403)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property("error")
                })
                it('PUT Review: saved, pass, no detail', async () => {

                    const putBody = {
                        result: 'pass',
                        detail: '',
                        comment: 'sure',
                        status: 'saved',
                        autoResult: false
                    }

                    const res = await chai.request(config.baseUrl)
                        .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}`)
                        .set('Authorization', `Bearer ${user.token}`)
                        .send(putBody)
                    if(user.name === 'collectioncreator') {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property("result")
                    expect(res.body).to.have.property("detail")
                    expect(res.body).to.have.property("comment")
                    expect(res.body).to.have.property("status")
                    expect(res.body.result).to.equal(putBody.result)
                    expect(res.body.detail).to.equal(putBody.detail)
                    expect(res.body.comment).to.equal(putBody.comment)
                    expect(res.body.status.label).to.equal(putBody.status)
                })
                it('PUT Review: submit, fail, no comment', async () => {

                    const putBody = {
                        result: 'fail',
                        detail: 'string',
                        comment: '',
                        status: 'submitted',
                        autoResult: false
                    }

                    const res = await chai.request(config.baseUrl)
                        .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}`)
                        .set('Authorization', `Bearer ${user.token}`)
                        .send(putBody)

                    expect(res).to.have.status(403)
                })
                it('PUT Review: submitted, pass, no detail Copy', async () => {

                    const putBody = {
                        result: 'pass',
                        detail: '',
                        comment: 'sure',
                        status: 'submitted',
                        autoResult: false
                    }

                    const res = await chai.request(config.baseUrl)
                        .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}`)
                        .set('Authorization', `Bearer ${user.token}`)
                        .send(putBody)

                    expect(res).to.have.status(403)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property("error")
                })
                it('Check that informational results are represented as NotReviewd with Finding Details data in .ckls', async () => {

                    const putBody = {
                    result: 'informational',
                    detail:
                        'test\nvisible to lvl1, THIS REVIEW IS INFORMATIONAL (but comes back as Not_Reviewed in a ckl)',
                    comment: 'sure',
                    autoResult: false,
                    status: 'saved'
                    }

                    const res = await chai.request(config.baseUrl)
                        .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}?projection=rule&projection=history&projection=stigs`)
                        .set('Authorization', `Bearer ${user.token}`)
                        .send(putBody)
                    if(user.name === 'collectioncreator') {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property("result")
                    expect(res.body).to.have.property("detail")
                    expect(res.body).to.have.property("comment")
                    expect(res.body).to.have.property("status")
                    expect(res.body.result).to.equal(putBody.result)
                    expect(res.body.detail).to.equal(putBody.detail)
                    expect(res.body.comment).to.equal(putBody.comment)
                    expect(res.body.status.label).to.equal(putBody.status)

                    const review = await utils.getChecklist(environment.testAsset.assetId, environment.testCollection.benchmark, environment.testCollection.revisionStr)

                    let cklData
                    xml2js.parseString(review, function (err, result) {
                        cklData = result;
                    })
                    let cklIStigs = cklData.CHECKLIST.STIGS[0].iSTIG
                    let currentStigId

                    for(let stig of cklIStigs){
                        for(let cklData of stig.STIG_INFO[0].SI_DATA){
                            if (cklData.SID_NAME[0] == 'stigid'){
                                currentStigId = cklData.SID_DATA[0]
                                expect(currentStigId).to.be.oneOf(environment.testCollection.validStigs);
                            }
                        }
                        let cklVulns = stig.VULN;
                        expect(cklVulns).to.be.an('array')

                        if (currentStigId == 'VPN_SRG_TEST') {
                            expect(cklVulns).to.be.an('array').of.length(81);

                            for (let thisVuln of cklVulns){
                                for (let stigData of thisVuln.STIG_DATA){
                                    if (stigData.ATTRIBUTE_DATA[0] == 'SV-106179r1_rule'){
                                        var commentRegex = new RegExp("INFORMATIONAL");
                                        var statusRegex = new RegExp("Not_Reviewed");
                                        expect(thisVuln.FINDING_DETAILS[0]).to.match(commentRegex);
                                        expect(thisVuln.STATUS[0]).to.match(statusRegex);
                                    }
                                }
                            }

                        }

                    }
                })
                it('Set all properties of a Review - invalid result enum', async () => {

                    const putBody = {
                        result: 'invalid',
                        detail: '',
                        comment: 'sure',
                        status: 'submitted',
                        autoResult: false
                    }

                    const res = await chai.request(config.baseUrl)
                        .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}`)
                        .set('Authorization', `Bearer ${user.token}`)
                        .send(putBody)

                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property("error")
                })
                it('Set all properties of a Review - with metadata', async () => {

                    const putBody = JSON.parse(JSON.stringify({
                        result: 'pass',
                        detail: 'test\nvisible to lvl1',
                        comment: 'sure',
                        autoResult: false,
                        status: 'submitted',
                        metadata: {
                            [environment.testCollection.metadataKey]: environment.testCollection.metadataValue
                        }

                    }))

                    const res = await chai.request(config.baseUrl)
                        .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}?projection=rule&projection=history&projection=stigs&projection=metadata`)
                        .set('Authorization', `Bearer ${user.token}`)
                        .send(putBody)
                    if(user.name === 'collectioncreator') {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property("result")
                    expect(res.body).to.have.property("detail")
                    expect(res.body).to.have.property("comment")
                    expect(res.body).to.have.property("status")
                    expect(res.body).to.have.property("metadata")
                    expect(res.body.result).to.equal(putBody.result)
                    expect(res.body.detail).to.equal(putBody.detail)
                    expect(res.body.comment).to.equal(putBody.comment)
                    expect(res.body.status.label).to.equal(putBody.status)
                    expect(res.body.metadata).to.be.an('object')
                    expect(res.body.metadata).to.have.property(environment.testCollection.metadataKey)
                    expect(res.body.metadata[environment.testCollection.metadataKey]).to.be.equal(environment.testCollection.metadataValue)

                })
                it('PUT Review: asset in deleted collection', async () => {

                    const putBody = {
                        result: 'pass',
                        detail: 'test\nvisible to lvl1',
                        comment: 'sure',
                        autoResult: false,
                        status: 'submitted'
                    }
                    const res = await chai.request(config.baseUrl)
                        .put(`/collections/${deletedCollection.collectionId}/reviews/${deletedAsset.assetId}/${environment.testCollection.ruleId}`)
                        .set('Authorization', `Bearer ${user.token}`)
                        .send(putBody)

                    expect(res).to.have.status(403)
                })
                it('Test all projections are returned and contain accurate data. ', async () => {

                    const putBody = {
                        result: 'pass',
                        detail: 'test\nvisible to lvl1',
                        comment: 'sure',
                        autoResult: false,
                        status: 'submitted'
                    }

                    const res = await chai.request(config.baseUrl)
                        .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}?projection=rule&projection=history&projection=stigs&projection=metadata`)
                        .set('Authorization', `Bearer ${user.token}`)
                        .send(putBody)
                    if(user.name === 'collectioncreator') {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body.result).to.equal(putBody.result)
                    expect(res.body.detail).to.equal(putBody.detail)
                    expect(res.body.comment).to.equal(putBody.comment)
                    expect(res.body.status.label).to.equal(putBody.status)
                    expect(res.body.metadata).to.be.an('object')
                    expect(res.body.metadata).to.have.property(environment.testCollection.metadataKey)
                    expect(res.body.metadata[environment.testCollection.metadataKey]).to.be.equal(environment.testCollection.metadataValue)

                    //projections

                    expect(res.body).to.have.property("rule")
                    expect(res.body).to.have.property("history")
                    expect(res.body).to.have.property("stigs")
                    expect(res.body).to.have.property("metadata")

                    expect(res.body.rule.ruleId).to.be.eql(environment.testCollection.ruleId)
                    expect(res.body.history).to.have.lengthOf(6)
                    expect(res.body.stigs).to.have.lengthOf(1)
                    expect(res.body.metadata).to.have.property(environment.testCollection.metadataKey)
                    expect(res.body.metadata[environment.testCollection.metadataKey]).to.be.equal(environment.testCollection.metadataValue)

                    expect(res.body.rule).to.be.an('object')
                    expect(res.body.rule.ruleId).to.be.eql(environment.testCollection.ruleId)
                })
                it('Set properties of a Review ', async () => {

                    const putBody = {
                        "autoResult": true,
                        "comment": "comment",
                        "detail": "detail",
                        "metadata": {
                            "additionalProp1": "string",
                            
                        },
                        "result": "fail",
                        "resultEngine": {
                            "checkContent": {
                            "component": "string",
                            "location": "string"
                            },
                            "overrides": [
                            {
                                "authority": "string",
                                "newResult": "fail",
                                "oldResult": "fail",
                                "remark": "string",
                                "time": "2024-06-05T17:01:07.162Z"
                            }
                            ],
                            "product": "string",
                            "time": "2024-06-05T17:01:07.162Z",
                            "type": "scap",
                            "version": "string"
                        },
                        "status": "saved"
                    }
                    
                    const res = await chai.request(config.baseUrl)
                    .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}?projection=rule&projection=history&projection=stigs&projection=metadata`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .send(putBody)
                    if(user.name === 'collectioncreator') {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                    expect(res.body.assetId).to.be.eql(environment.testAsset.assetId)
                    expect(res.body.result).to.be.eql(putBody.result)
                    expect(res.body.detail).to.be.eql(putBody.detail)
                    expect(res.body.comment).to.be.eql(putBody.comment)
                    expect(res.body.status.label).to.be.eql(putBody.status)
                    expect(res.body.metadata).to.be.eql(putBody.metadata)
                    expect(res.body.resultEngine).to.be.eql(putBody.resultEngine)

                })
            })

            describe('PUT - putReviewMetadata - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata', () => {

            before(async function () {
                this.timeout(4000)
                await utils.uploadTestStigs()
                await utils.loadAppData()
                await utils.createDisabledCollectionsandAssets()
            })

            it('Set all metadata of a Review', async () => {
                const res = await chai.request(config.baseUrl)
                .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}/metadata`)
                .set('Authorization', `Bearer ${user.token}`)
                .send({[environment.testCollection.metadataKey]: environment.testCollection.metadataValue})
                if(user.name === 'collectioncreator') {
                    expect(res).to.have.status(403)
                    return
                }
                expect(res).to.have.status(200)
                expect(res.body).to.eql({[environment.testCollection.metadataKey]: environment.testCollection.metadataValue})

            })
            })

            describe('PUT - putReviewMetadataValue - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata/keys/{key}', () => {

            before(async function () {
            this.timeout(4000)
            await utils.uploadTestStigs()
            await utils.loadAppData()
            await utils.createDisabledCollectionsandAssets()
            })

                it('Set one metadata key/value of a Review', async () => {
                const res = await chai.request(config.baseUrl)
                    .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}/metadata/keys/${environment.testCollection.metadataKey}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .set('Content-Type', 'application/json') 
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

