// const chai = require('chai')
// const chaiHttp = require('chai-http')
// chai.use(chaiHttp)
// const expect = chai.expect
// const config = require('../testConfig.json')
// const utils = require('../utils/testUtils')
// const enviornment = require('../enviornment.json')
// const xml2js = require('xml2js');
// const debug = true

// const iteration = JSON.parse(process.env.ITERATION_CONFIG);

// describe(`Asset get tests using each user `, () => {
//   // const iteration = JSON.parse(process.env.ITERATION_CONFIG);
//   // this.setTimeout(1000000)
//   before(async function () {
//     this.timeout(100000)
//     await utils.loadAppData()
//     await utils.uploadTestStigs()
//     // await utils.createDisabledCollectionsandAssets()

//   })
//   // beforeEach(async function () {
//   //   this.timeout(100000)
//   //   // await utils.loadAppData()
//   //   // await utils.uploadTestStigs()
//   //   // await utils.createDisabledCollectionsandAssets()

//   // })

//   describe(`GET - getAsset - /assets/{assetId} user:  ${iteration.user}`, () => {

//     it('Return an Asset (with STIGgrants projection)', async () => {
//       const res = await chai
//         .request(config.baseUrl)
//         .get(`/assets/${enviornment.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
//         .set('Authorization', 'Bearer ' + iteration.token)

//       if (debug) console.log(iteration.user)

//       if (debug) console.log(iteration.grant)
//       if (iteration.user === 'lvl1') {
//         expect(res).to.have.status(403)
//         return
//       }
//       expect(res).to.have.status(200)
//       expect(res.body).to.be.an('object')        
//       expect(res.body.name).to.eql(enviornment.testAsset.name)
//       expect(res.body.collection.collectionId).to.eql(enviornment.testAsset.collectionId)
//       expect(res.body.labelIds).to.be.an('array').of.length(2)
      
//       if(res.request.url.includes("projection=stigGrants")){
//         expect(res.body.stigGrants).to.exist;
//         expect(res.body.stigGrants).to.be.an("array").of.length.at.least(1)
//         for (let grant of res.body.stigGrants){
//             expect(grant.benchmarkId).to.be.oneOf(iteration.validStigs);
//             for(let user of grant.users){
//               expect(user.userId).to.be.oneOf(enviornment.testAsset.usersWithGrant);
//             }
//         }
//       }
//       if(res.request.url.includes('projection=stigs')){
//         expect(res.body.stigs).to.exist;
//         expect(res.body.stigs).to.be.an("array").of.length.at.least(1)
//         for (let stig of res.body.stigs){
//           expect(stig.benchmarkId).to.be.oneOf(iteration.validStigs);
//         }
//       }
//       if(res.request.url.includes('projection=statusStats')){
//         expect(res.body.statusStats).to.exist;
//         expect(res.body.statusStats).to.be.an("object")
//       }
//     })

//     it(`Return an Asset (with STIGgrants projection) - Asset - no assigned STIGs - user: ${iteration.user}`, async () => {
//       const res = await chai
//         .request(config.baseUrl)
//         .get(`/assets/${enviornment.testAssetNoStigs.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
//         .set('Authorization', 'Bearer ' + iteration.token)
        
//       if (iteration.user === 'lvl1') {
//         expect(res).to.have.status(403)
//         return
//       }
//       expect(res).to.have.status(200)
//       expect(res.body).to.be.an('object')        
//       expect(res.body.name).to.eql(enviornment.testAssetNoStigs.name)
//       expect(res.body.collection.collectionId).to.eql(enviornment.testAssetNoStigs.collectionId)
//       expect(res.body.labelIds).to.be.an('array').of.length(0)

//       if(res.request.url.includes('projection=stigGrants')){
//         expect(res.body.stigGrants).to.exist;
//         expect(res.body.stigGrants).to.be.an("array").of.length(0)
//       }

//       if(res.request.url.includes('projection=stigs')){
//         expect(res.body.stigs).to.exist;
//         expect(res.body.stigs).to.be.an("array").of.length(0)
//       }
//       if(res.request.url.includes('projection=statusStats')){
//         expect(res.body.statusStats).to.exist;
//         expect(res.body.statusStats).to.be.an("object")
//       }
//     })

//     it('Return an Asset (without STIGgrants projection)', async () => {
//       const res = await chai
//         .request(config.baseUrl)
//         .get(`/assets/${enviornment.testAsset.assetId}?projection=statusStats&projection=stigs`)
//         .set('Authorization', 'Bearer ' + iteration.token)

//       expect(res).to.have.status(200)
//       expect(res.body).to.be.an('object')        
//       expect(res.body.name).to.eql(enviornment.testAsset.name)
//       expect(res.body.collection.collectionId).to.eql(enviornment.testAssetNoStigs.collectionId)
//       expect(res.body.stigGrants).to.not.exist
//       if(res.request.url.includes('projection=stigs')){
//         expect(res.body.stigs).to.exist;
//         expect(res.body.stigs).to.be.an("array").of.length.at.least(1)
//         for (let stig of res.body.stigs){
//             expect(stig.benchmarkId).to.be.oneOf(iteration.validStigs);
//         }
//       }
//       if(res.request.url.includes('projection=statusStats')){
//         expect(res.body.statusStats).to.exist;
//         expect(res.body.statusStats).to.be.an("object")
//       }
//     })


//   })

// })
