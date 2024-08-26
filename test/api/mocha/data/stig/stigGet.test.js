const chai = require('chai')
const chaiHttp = require('chai-http')
const deepEqualInAnyOrder = require('deep-equal-in-any-order')
chai.use(chaiHttp)
chai.use(deepEqualInAnyOrder)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const users = require("../../iterations.js")
const reference = require('./referenceData.js')
const expectations = require('./expectations.js')

describe('GET - Stig', () => {

    before(async function () {
        this.timeout(4000)
        await utils.uploadTestStigs()
        try{
            await utils.uploadTestStig("U_VPN_SRG_V1R0_Manual-xccdf.xml")
        }
        catch(err){
            console.log("no stig to upload")
        }
        await utils.loadAppData()
    })

    for(const user of users){
        if (expectations[user.name] === undefined){
            it(`No expectations for this iteration scenario: ${user.name}`, async () => {})
            continue
        }
        describe(`user:${user.name}`, () => {
            const distinct = expectations[user.name]
            describe('GET - getSTIGs - /stigs', () => {

                it('Return a list of available STIGs', async () => {
                    const res = await chai.request(config.baseUrl)
                    .get('/stigs')
                    .set('Authorization', `Bearer ${user.token}`)
                   
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')

                    for(let stig of res.body){
                        expect(stig).to.have.property('benchmarkId')
                        expect(stig.benchmarkId, "expect benchmarkId to be one of the stigs available").to.be.oneOf(reference.allStigsForAdmin)
                        if(stig.benchmarkId === reference.benchmark){
                            expect(stig.collectionIds).to.deep.equalInAnyOrder(distinct.testBenchmarkCollections)
                            expect(stig.lastRevisionStr, "checking for correct revision string of test benchmark").to.be.equal(reference.revisionStr)
                            expect(stig.revisionStrs, "checking for correct possible revision strings of test benchmark").to.be.eql(reference.testBenchmarkAllRevisions)
                            expect(stig.ruleCount, "checking for correct checklist length of test benchmark").to.be.equal(reference.checklistLength)
                        }
                    }
                })
                it('Return a list of available STIGs NAME FILTER', async () => {
                    const res = await chai.request(config.baseUrl)
                    .get('/stigs?title=vpn')
                    .set('Authorization', `Bearer ${user.token}`)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array').of.length(3)
                    for(let stig of res.body){
                        expect(stig.benchmarkId, "expect stig benchmarkId returned to be a VPN varient").to.be.oneOf(reference.vpnStigs)
                        if(stig.benchmarkId === reference.benchmark){
                            expect(stig.collectionIds).to.deep.equalInAnyOrder(distinct.testBenchmarkCollections)
                            expect(stig.lastRevisionStr, "checking for correct revision string of test benchmark").to.be.equal(reference.revisionStr)
                            expect(stig.revisionStrs, "checking for correct possible revision strings of test benchmark").to.be.eql(reference.testBenchmarkAllRevisions)
                            expect(stig.ruleCount, "checking for correct checklist length of test benchmark").to.be.equal(reference.checklistLength)
                        }
                    }
                })
            })
            describe('GET - getCci - /stigs/ccis/{cci}', () => {

                it('Return data for the specified CCI', async () => {
                    const res = await chai.request(config.baseUrl)
                    .get(`/stigs/ccis/${reference.testCollection.cci.id}?projection=stigs&projection=emassAp&projection=references`)
                    .set('Authorization', `Bearer ${user.token}`)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body.cci, "expect to get back test cci").to.be.equal(reference.testCollection.cci.id)
                    expect(res.body.status, "expect to get back test cci status").to.be.equal(reference.testCollection.cci.status)
             
                })
            })
            describe('GET - getRuleByRuleId - /stigs/rules/{ruleId}', () => {
                it('Return data for the specified rule', async () => {
                    const res = await chai.request(config.baseUrl)
                    .get(`/stigs/rules/${reference.testCollection.rule.ruleId}?projection=detail&projection=ccis&projection=check&projection=fix`)
                    .set('Authorization', `Bearer ${user.token}`)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body.ruleId, "expect ruleId returned to be the test ruleId").to.be.equal(reference.testCollection.rule.ruleId)
                    expect(res.body.groupId, "expect fix groupId to be the test groupId").to.be.equal(reference.testCollection.rule.groupId)
                    expect(res.body.version, "expect fix version to be the test version").to.be.equal(reference.testCollection.rule.version)
                    
                })
            })
            describe('GET - getScapMap - /stigs/scap-maps', () => {
                it('Return a list of SCAP maps', async () => {
                    const res = await chai.request(config.baseUrl)
                    .get('/stigs/scap-maps')
                    .set('Authorization', `Bearer ${user.token}`)
                    expect(res).to.have.status(200)
                    expect(res.body).to.deep.equalInAnyOrder([
                        {
                        scapBenchmarkId: 'CAN_Ubuntu_18-04_STIG',
                        benchmarkId: 'U_CAN_Ubuntu_18-04_STIG'
                        },
                        {
                        scapBenchmarkId: 'Mozilla_Firefox_RHEL',
                        benchmarkId: 'Mozilla_Firefox'
                        },
                        {
                        scapBenchmarkId: 'Mozilla_Firefox_Windows',
                        benchmarkId: 'Mozilla_Firefox'
                        },
                        {
                        scapBenchmarkId: 'MOZ_Firefox_Linux',
                        benchmarkId: 'MOZ_Firefox_STIG'
                        },
                        {
                        scapBenchmarkId: 'MOZ_Firefox_Windows',
                        benchmarkId: 'MOZ_Firefox_STIG'
                        },    
                        {
                        scapBenchmarkId: 'Solaris_10_X86_STIG',
                        benchmarkId: 'Solaris_10_X86'
                        }
                    ])
                })
            })
            describe('GET - getStigById - /stigs/{benchmarkId}', () => {

                it('Return properties of the specified STIG', async () => {
                    const res = await chai.request(config.baseUrl)
                    .get(`/stigs/${reference.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('benchmarkId')
                    expect(res.body.benchmarkId, "expect returned benchmark to be the test ben").to.be.equal(reference.benchmark)
                    expect(res.body.collectionIds).to.deep.equalInAnyOrder(distinct.testBenchmarkCollections)
                    expect(res.body.lastRevisionStr, "expect returned last revision to be the test revision").to.be.equal(reference.revisionStr)
                    expect(res.body.ruleCount, "expect returned ruleCount to be the test checklist length").to.be.equal(reference.checklistLength)

                    for(const revision of res.body.revisions){
                        expect(revision.revisionStr, "expect returned revision to be one of the test revisions").to.be.oneOf(reference.testBenchmarkAllRevisions)
                        expect(revision.ruleCount, "expect returned ruleCount to be the test checklist length").to.be.equal(reference.checklistLength)
                    }

                })
            })
            describe('GET - getRevisionsByBenchmarkId - /stigs/{benchmarkId}/revisions', () => {

                it('Return a list of revisions for the specified STIG', async () => {
                    const res = await chai.request(config.baseUrl)
                    .get(`/stigs/${reference.benchmark}/revisions`)
                    .set('Authorization', `Bearer ${user.token}`)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.be.lengthOf(2)
                    for(let revision of res.body){
                        expect(revision.ruleCount).to.eql(reference.checklistLength)
                        expect(revision.benchmarkId).to.be.equal(reference.benchmark)
                        expect(revision.revisionStr).to.be.oneOf(reference.testBenchmarkAllRevisions)
                    }
                })
            })
            describe('GET - getRevisionByString - /stigs/{benchmarkId}/revisions/{revisionStr}', () => {

                it('Return metadata for the specified revision of a STIG', async () => {
                    const res = await chai.request(config.baseUrl)
                    .get(`/stigs/${reference.benchmark}/revisions/${reference.revisionStr}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('revisionStr')
                    expect(res.body.revisionStr).to.be.equal(reference.revisionStr)
                    expect(res.body.ruleCount).to.be.equal(reference.checklistLength)
                    expect(res.body.benchmarkId).to.be.equal(reference.benchmark)

                })
            })
            describe('GET - getCcisByRevision - /stigs/{benchmarkId}/revisions/{revisionStr}/ccis', () => {
                it('Return a list of CCIs from a STIG revision', async () => {
                    const res = await chai.request(config.baseUrl)
                    .get(`/stigs/${reference.benchmark}/revisions/${reference.revisionStr}/ccis`)
                    .set('Authorization', `Bearer ${user.token}`)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.be.lengthOf(85)
                })
            })
            describe('GET - getGroupsByRevision - /stigs/{benchmarkId}/revisions{revisionStr}/groups', () => {
                it('Return the list of groups for the specified revision of a STIG.', async () => {
                    const res = await chai.request(config.baseUrl)
                    .get(`/stigs/${reference.benchmark}/revisions/${reference.revisionStr}/groups?projection=rules`)
                    .set('Authorization', `Bearer ${user.token}`)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.be.lengthOf(reference.checklistLength)
                    for(let group of res.body){
                        if(group.groupId === reference.testCollection.rule.groupId){
                            for(const rule of group.rules){
                                expect(rule.ruleId).to.be.equal(reference.testCollection.rule.ruleId)
                                expect(rule.version, "expect rule version to be the test version").to.be.equal(reference.testCollection.rule.version)
                            }
                        }
                    }
                })
            })
            describe('GET - getGroupByRevision - /stigs/{benchmarkId}/revisions{revisionStr}/groups/{groupId}', () => {

                it('Return the rules, checks and fixes for a Group from a specified revision of a STIG.', async () => {
                    const res = await chai.request(config.baseUrl)
                    .get(`/stigs/${reference.benchmark}/revisions/${reference.revisionStr}/groups/${reference.testCollection.rule.groupId}?projection=rules`)
                    .set('Authorization', `Bearer ${user.token}`)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('groupId')
                    expect(res.body.groupId).to.be.equal(reference.testCollection.rule.groupId)
                    for(const rule of res.body.rules){
                        expect(rule.ruleId).to.be.equal(reference.testCollection.rule.ruleId)
                        expect(rule.version, "expect rule version to be the test version").to.be.equal(reference.testCollection.rule.version)
                    }
                })
            }) 
            describe('GET - getRulesByRevision - /stigs/{benchmarkId}/revisions/{revisionStr}/rules', () => {
                it("Return rule data for the LATEST revision of a STIG", async () => {
                    const res = await chai.request(config.baseUrl)
                    .get(`/stigs/${reference.benchmark}/revisions/${'latest'}/rules?projection=detail&projection=ccis&projection=check&projection=fix`)
                    .set('Authorization', `Bearer ${user.token}`)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.be.lengthOf(reference.checklistLength)
                    for(const rule of res.body){
                        if(rule.ruleId === reference.testCollection.rule.ruleId){
                            expect(rule.groupId, "expect group id to match test group id").to.be.equal(reference.testCollection.rule.groupId)
                            expect(rule.version, "expect rule version to be the test version").to.be.equal(reference.testCollection.rule.version)
                        }
                    }
                })
                it("Return rule data for the specified revision of a STIG.", async () => {
                    const res = await chai.request(config.baseUrl)
                    .get(`/stigs/${reference.benchmark}/revisions/${reference.revisionStr}/rules?projection=detail&projection=ccis&projection=check&projection=fix`)
                    .set('Authorization', `Bearer ${user.token}`)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.be.lengthOf(81)
                    for(const rule of res.body){
                        if(rule.ruleId === reference.testCollection.rule.ruleId){
                            expect(rule.groupId, "expect group id to match test group id").to.be.equal(reference.testCollection.rule.groupId)
                            expect(rule.version, "expect rule version to be the test version").to.be.equal(reference.testCollection.rule.version)
                        }
                    }
                })
            }) 
            describe('GET - getRuleByRevision - /stigs/{benchmarkId}/revisions/{revisionStr}/rules/{ruleId}', () => {
                it("Return rule data for the specified revision of a STIG.", async () => {
                    const res = await chai.request(config.baseUrl)
                    .get(`/stigs/${reference.benchmark}/revisions/${reference.revisionStr}/rules/${reference.testCollection.rule.ruleId}?projection=detail&projection=ccis&projection=check&projection=fix`)
                    .set('Authorization', `Bearer ${user.token}`)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body.ruleId).to.be.equal(reference.testCollection.rule.ruleId)
                    expect(res.body.groupId, "expect group id to match test group id").to.be.equal(reference.testCollection.rule.groupId)
                    expect(res.body.version, "expect rule version to be the test version").to.be.equal(reference.testCollection.rule.version)
                })
            })
        })
    }
})

