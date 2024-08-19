const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const users = require("../../iterations.js")
const reference = require('./referenceData.js')
const expectations = require('./expectations.js')
describe('DELETE - Stig', () => {

    for(const user of users){
        if (expectations[user.name] === undefined){
            it(`No expectations for this iteration scenario: ${user.name}`, async () => {})
            continue
        }
        describe(`user:${user.name}`, () => {
            const distinct = expectations[user.name]
            describe('DELETE - deleteStigById - /stigs/{benchmarkId}', () => {

                beforeEach(async function () {
                    this.timeout(4000)
                    await utils.uploadTestStigs()
                    await utils.loadAppData()
                })

                it('Deletes a STIG (*** and all revisions ***) - expect fail, stig is assigned', async () => {
                    const res = await chai.request(config.baseUrl)
                    .delete(`/stigs/${reference.benchmark}?elevate=true`)
                    .set('Authorization', `Bearer ${user.token}`)
                    if(user.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(422)
                })
                it('Deletes a STIG (*** and all revisions ***)', async () => {
                    const res = await chai.request(config.baseUrl)
                    .delete(`/stigs/${reference.scrapBenchmark}?elevate=true&force=true`)
                    .set('Authorization', `Bearer ${user.token}`)
                    if(user.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)

                    const response = await utils.getStigByBenchmarkId(reference.scrapBenchmark)
                    expect(response).to.be.empty

                })
            })
            describe('DELETE - deleteRevisionByString - /stigs/{benchmarkId}/revisions/{revisionStr}', () => {

                beforeEach(async function () {
                    this.timeout(4000)
                    await utils.uploadTestStigs()
                    await utils.loadAppData()
                })

                it('Deletes the specified revision of a STIG latest', async () => {
                    const res = await chai.request(config.baseUrl)
                    .delete(`/stigs/${reference.benchmark}/revisions/latest?elevate=true&force=true`)
                    .set('Authorization', `Bearer ${user.token}`)
                    if(user.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(400)
                })
                it('Deletes the specified revision of a STIG', async () => {
                
                    const res = await chai.request(config.baseUrl)
                    .delete(`/stigs/${reference.benchmark}/revisions/${reference.revisionStr}?elevate=true&force=true`)
                    .set('Authorization', `Bearer ${user.token}`)
                    if(user.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                    const response = await utils.getStigByBenchmarkId(reference.benchmark)
                    expect(response).to.not.be.empty
                })
        
            })
        })
    }
})

