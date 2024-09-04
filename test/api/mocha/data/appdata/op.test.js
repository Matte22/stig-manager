const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils.js')
const iterations = require('../../iterations.js')

describe('Op', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const iteration of iterations){
    describe(`iteration:${iteration.name}`, () => {
      describe('GET - getAppData - /op/appdata', () => {
        it('Export application data', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/op/appdata?elevate=true`)
            .set('Authorization', `Bearer ${iteration.token}`)
        if(iteration.name !== "stigmanadmin"){
          expect(res).to.have.status(403)
          return
        }
        expect(res).to.have.status(200)
        })
      })
      describe('GET - getConfiguration - /op/configuration', () => {
        it('Return API version and configuration information', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/op/configuration`)
            .set('Authorization', `Bearer ${iteration.token}`)
        expect(res).to.have.status(200)
        })
        it('delate alter test', async () => {
          const res = await chai.request(config.baseUrl)
              .get(`/op/configuration`)
              .set('Authorization', `Bearer ${iteration.token}`)
          expect(res).to.have.status(200)
          })
      })
      describe('GET - getDetails - /op/details', () => {
        it('Return API Deployment Details', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/op/details?elevate=true`)
            .set('Authorization', `Bearer ${iteration.token}`)
        if(iteration.name !== "stigmanadmin"){
          expect(res).to.have.status(403)
          return
        }
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body.dbInfo).to.exist
        expect(res.body.dbInfo).to.have.property('tables')
        expect(res.body.stigmanVersion).to.exist
									
        })
      })
      describe('GET - getDefinition - /op/definition', () => {
        it('Return API Deployment Definition', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/op/definition`)
            .set('Authorization', `Bearer ${iteration.token}`)
        expect(res).to.have.status(200)
        })
      })
    })
  }
})
