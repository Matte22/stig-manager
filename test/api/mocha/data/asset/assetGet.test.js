const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const xml2js = require('xml2js');
const users = require('../../iterations.json')
const expectations = require('./expectations.js')
const reference = require('./referenceData.js')


describe('GET - Asset', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users){

    describe(`user:${user.name}`, () => {
      const distinct = expectations[user.name]

      describe('getAsset - /assets/{assetId}', () => {
      
        it('Return an Asset (with STIGgrants projection)', async () => {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)

          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          else{
            expect(res).to.have.status(200)
          }
          expect(res.body.name).to.eql(reference.testAsset.name)
          expect(res.body.collection.collectionId).to.eql(reference.testAsset.collectionId)
          expect(res.body.labelIds).to.be.an('array').of.length(reference.testAsset.validStigs.length)
          
          if(res.request.url.includes('projection=stigGrants')){
            expect(res.body.stigGrants).to.be.an("array").of.length(distinct.testAssetStigs.length)
            for (let grant of res.body.stigGrants){
                expect(grant.benchmarkId).to.be.oneOf(distinct.testAssetStigs)
                for(let user of grant.users){
                  expect(user.userId).to.be.oneOf(reference.testAsset.usersWithGrant);
                }
            }
          }
          // stigs projection
          expect(res.body.stigs).to.be.an("array").of.length(distinct.testAssetStigs.length)
          for (let stig of res.body.stigs){
              expect(stig.benchmarkId).to.be.oneOf(distinct.testAssetStigs);
          }
          // statusStats projection
          expect(res.body.statusStats.ruleCount, "rule count").to.eql(distinct.testAssetStats.ruleCount)
          expect(res.body.statusStats.stigCount, "stig count").to.eql(distinct.testAssetStats.stigCount)
          expect(res.body.statusStats.savedCount, "saved count").to.eql(distinct.testAssetStats.savedCount)
          expect(res.body.statusStats.acceptedCount, "accepted count").to.eql(distinct.testAssetStats.acceptedCount)
          expect(res.body.statusStats.rejectedCount, "rejected count").to.eql(distinct.testAssetStats.rejectedCount)
          expect(res.body.statusStats.submittedCount, "submitted count").to.eql(distinct.testAssetStats.submittedCount)

        })

        it('Return an Asset (with STIGgrants projection) - Asset - no assigned STIGs', async () => {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAssetNoStigs.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)

          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          else{
            expect(res).to.have.status(200)
          }
          expect(res.body.name).to.eql(reference.testAssetNoStigs.name)
          expect(res.body.collection.collectionId).to.eql(reference.testAssetNoStigs.collectionId)
          expect(res.body.labelIds).to.be.an('array').of.length(reference.testAssetNoStigs.labels.length)

          // stig grants
          expect(res.body.stigGrants).to.exist;
          expect(res.body.stigGrants).to.be.an("array").of.length(0)

          // stigs
          expect(res.body.stigs).to.be.an("array").of.length(reference.testAssetNoStigs.stigs.length)

          // statusStats
          expect(res.body.statusStats.ruleCount, "rule count").to.eql(reference.testAssetNoStigs.stats.ruleCount)
          expect(res.body.statusStats.stigCount, "stig Count").to.eql(reference.testAssetNoStigs.stats.stigCount)
          expect(res.body.statusStats.savedCount, "saved Count").to.eql(reference.testAssetNoStigs.stats.savedCount)
          expect(res.body.statusStats.acceptedCount, "accepted Count").to.eql(reference.testAssetNoStigs.stats.acceptedCount)
          expect(res.body.statusStats.rejectedCount, "rejected count").to.eql(reference.testAssetNoStigs.stats.rejectedCount)
          expect(res.body.statusStats.submittedCount, "submitted count").to.eql(reference.testAssetNoStigs.stats.submittedCount)
          expect(res.body.statusStats.acceptedCount, "accepted count").to.eql(reference.testAssetNoStigs.stats.acceptedCount)

        })

        it('Return an Asset (without STIGgrants projection)', async () => {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}?projection=statusStats&projection=stigs`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')        
          expect(res.body.name).to.eql(reference.testAsset.name)
          expect(res.body.collection.collectionId).to.eql(reference.testAsset.collectionId)

          //stigs
          expect(res.body.stigs).to.exist;
          expect(res.body.stigs).to.be.an("array").of.length(distinct.testAssetStigs.length)
          for (let stig of res.body.stigs){
              expect(stig.benchmarkId).to.be.oneOf(reference.testAsset.validStigs);
          }

          // statusStats
          expect(res.body.statusStats.ruleCount, "rule count").to.eql(distinct.testAssetStats.ruleCount)
          expect(res.body.statusStats.stigCount, "stig count").to.eql(distinct.testAssetStats.stigCount)
          expect(res.body.statusStats.savedCount, "saved count").to.eql(distinct.testAssetStats.savedCount)
          expect(res.body.statusStats.acceptedCount, "accepted count").to.eql(distinct.testAssetStats.acceptedCount)
          expect(res.body.statusStats.rejectedCount, "rejected count").to.eql(distinct.testAssetStats.rejectedCount)
          expect(res.body.statusStats.submittedCount, "submitted count").to.eql(distinct.testAssetStats.submittedCount)

        })

        it('Return an Asset (without STIGgrants projection) - Asset - no assigned STIGs', async () => {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAssetNoStigs.assetId}?projection=statusStats&projection=stigs`)
            .set('Authorization', 'Bearer ' + user.token)

            if(user.name === "lvl1"){
              expect(res).to.have.status(403)
              return
            }
            else{
              expect(res).to.have.status(200)
            }
            expect(res.body.name).to.eql(reference.testAssetNoStigs.name)
            expect(res.body.collection.collectionId).to.eql(reference.testAssetNoStigs.collectionId)
            expect(res.body.labelIds).to.be.an('array').of.length(reference.testAssetNoStigs.labels.length)
  
            // stigs
            expect(res.body.stigs).to.be.an("array").of.length(reference.testAssetNoStigs.stigs.length)
  
            // statusStats
            expect(res.body.statusStats.ruleCount, "rule count").to.eql(reference.testAssetNoStigs.stats.ruleCount)
            expect(res.body.statusStats.stigCount, "stig Count").to.eql(reference.testAssetNoStigs.stats.stigCount)
            expect(res.body.statusStats.savedCount, "saved Count").to.eql(reference.testAssetNoStigs.stats.savedCount)
            expect(res.body.statusStats.acceptedCount, "accepted Count").to.eql(reference.testAssetNoStigs.stats.acceptedCount)
            expect(res.body.statusStats.rejectedCount, "rejected count").to.eql(reference.testAssetNoStigs.stats.rejectedCount)
            expect(res.body.statusStats.submittedCount, "submitted count").to.eql(reference.testAssetNoStigs.stats.submittedCount)
            expect(res.body.statusStats.acceptedCount, "accepted count").to.eql(reference.testAssetNoStigs.stats.acceptedCount)
        })
      })

      describe('getAssetMetadata - /assets/{assetId}/metadata,', () => {
        it('Return the Metadata for an Asset', async () => {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}/metadata`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')      
          expect(res.body.testkey).to.exist
          expect(res.body.testkey).to.eql(reference.testAsset.metadataValue)
        })
      })
      describe('getAssetMetadataKeys - /assets/{assetId}/metadata/keys', () => {
        it('Return the Metadata KEYS for an Asset', async () => {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}/metadata/keys`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.include(reference.testAsset.metadataKey)
        })
      })

      describe('getAssetMetadataValue - /assets/{assetId}/metadata/keys/{key}', () => {
        it('Return the Metadata VALUE for an Asset metadata KEY', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}/metadata/keys/${reference.testAsset.metadataKey}`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
          expect(res.body).to.include(reference.testAsset.metadataValue)
        })
      })

      describe('getAssets - /assets', () => {

        it('Assets accessible to the requester (with STIG grants projection)', async () => {
          const res = await chai
            .request(config.baseUrl).get(`/assets?collectionId=${reference.testCollection.collectionId}&benchmarkId=${reference.benchmark}`)
            .set('Authorization', 'Bearer ' + user.token)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(3)
          for(const asset of res.body){
            expect(asset.assetId).to.be.oneOf(reference.testCollection.assetIds)
          }
          const jsonData = res.body;
          const regex = new RegExp("asset")
          
          for (let asset of jsonData){
            expect(asset.name).to.match(regex)
          }
        })

        it('Assets accessible to the requester (with STIG grants projection - no benchmark specified)', async () => {
          const res = await chai
            .request(config.baseUrl).get(`/assets?collectionId=${environment.testCollection.collectionId}&projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)

          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          else{
            expect(res).to.have.status(200)
          }

          expect(res.body).to.be.an('array').of.length(4)
        
          const jsonData = res.body;
          const assetMatchString = environment.assetMatchString
          const regex = new RegExp(assetMatchString)
          
          for (let asset of jsonData){
            expect(asset.name).to.match(regex)

            if(res.request.url.includes('/projection=statusStats/')){
              expect(asset.statusStats).to.exist;
              if(asset.assetId === environment.testAsset.assetId){
                if (res.request.url.includes('benchmarkId=')) {
                  expect(asset.statusStats.ruleCount).to.eql(81);
                } else {
                  expect(asset.statusStats.ruleCount).to.eql(368);
                }
              }
            }
            if (res.request.url.includes('projection=stigs')) {
              for(let stig of asset.stigs){
                expect(stig.benchmarkId).to.be.oneOf(environment.testCollection.validStigs);
              }
            }
            if (res.request.url.includes('projection=stigGrants')) {
              for(let grant of asset.stigGrants){
                expect(grant.benchmarkId).to.be.oneOf(environment.testCollection.validStigs);
              }
            }
          }

        })

        it('Assets accessible to the requester - labels', async () => {
          const res = await chai
            .request(config.baseUrl).get(`/assets?collectionId=${environment.testCollection.collectionId}&labelId=${environment.testCollection.testLabel}`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
          if(user.name === "lvl1"){
            expect(res.body).to.be.an('array').of.length(1)
          }
          else{
          expect(res.body).to.be.an('array').of.length(2)
          }

          for(let asset of res.body){
            expect(asset.labelIds).to.include(environment.testCollection.testLabel)
          }
        })

    it('Assets accessible to the requester - No StigGrants (for lvl1 user success)', async () => {
      const res = await chai
        .request(config.baseUrl).get(`/assets?collectionId=${environment.testCollection.collectionId}&benchmarkId=${environment.testCollection.benchmark}&projection=statusStats&projection=stigs`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)

      if(user.name === "lvl1"){
        expect(res.body).to.be.an('array').of.length(2)
      }
      else{
        expect(res.body).to.be.an('array').of.length(3)
      }
      
      const jsonData = res.body;
      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      
      for (let asset of jsonData){
        expect(asset.name).to.match(regex)

        if(res.request.url.includes('/projection=statusStats/')){
          expect(asset.statusStats).to.exist;
          if(asset.assetId === environment.testAsset.assetId){
            if (res.request.url.includes('benchmarkId=')) {
              expect(asset.statusStats.ruleCount).to.eql(81);
            } else {
              expect(asset.statusStats.ruleCount).to.eql(368);
            }
          }
        }
        if (res.request.url.includes('projection=stigs')) {
          for(let stig of asset.stigs){
            expect(stig.benchmarkId).to.be.oneOf(environment.testCollection.validStigs);
          }
        }
      }
    })

      })

      describe('getChecklistByAsset - /assets/{assetId}/checklists', () => {

        it('Return the Checklist for the supplied Asset with benchmark query param', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${environment.testAsset.assetId}/checklists?benchmarkId=${environment.testCollection.benchmark}`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)

          let cklData

          xml2js.parseString(res.body, function (err, result) {
            cklData = result
          })
          let cklHostName = cklData.CHECKLIST.ASSET[0].HOST_NAME[0]
          let cklIStigs = cklData.CHECKLIST.STIGS[0].iSTIG
      
          const assetMatchString = environment.assetMatchString
          const regex = new RegExp(assetMatchString)
          expect(cklHostName).to.match(regex)

          for (let stig of cklIStigs){
            for(let stigData of stig.STIG_INFO[0].SI_DATA){
              if (stigData.SID_NAME[0] == 'stigid'){
                currentStigId = stigData.SID_DATA[0]
                expect(currentStigId).to.be.eql(environment.testCollection.benchmark)
            }
            }
            let cklVulns = stig.VULN;
            expect(cklVulns).to.be.an('array');
            if (currentStigId == 'VPN_SRG_TEST') {
                expect(cklVulns).to.be.an('array').of.length(environment.metrics.checklistLength);
            }
          }
        })

        it('Return the Checklist for the supplied Asset and MULTI-STIG JSON (.cklB) - no specified STIG', async () => {
            
            const res = await chai
              .request(config.baseUrl)
              .get(`/assets/${environment.testAsset.assetId}/checklists?format=cklb`)
              .set('Authorization', 'Bearer ' + user.token)
      
            expect(res).to.have.status(200)
            let cklbData = res.body
            let cklbHostName = cklbData.target_data.host_name
            let cklbIStigs = cklbData.stigs

            const assetMatchString = environment.assetMatchString
            const regex = new RegExp(assetMatchString)
            expect(cklbHostName).to.match(regex)

            for (let stig of cklbIStigs){
              let stigId = stig.stig_id
              expect(stigId).to.be.oneOf(environment.testCollection.validStigs)
              let cklbVulns = stig.rules;
              expect(cklbVulns).to.be.an('array');
              if (stigId == 'VPN_SRG_TEST') {
                  expect(cklbVulns).to.be.an('array').of.length(environment.metrics.checklistLength);
              }
            }
        })

        it('Return the Checklist for the supplied Asset and MULTI-STIG JSON (.cklB) - specific STIGs', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${environment.testAsset.assetId}/checklists?format=cklb&benchmarkId=${environment.testCollection.benchmark}&benchmarkId=Windows_10_STIG_TEST`)
            .set('Authorization', 'Bearer ' + user.token)

          if(user.name === "lvl1"){
            expect(res).to.have.status(400)
            return
          }
         
          expect(res).to.have.status(200)
          let cklbData = res.body
          let cklbHostName = cklbData.target_data.host_name
          let cklbIStigs = cklbData.stigs

          const assetMatchString = environment.assetMatchString
          const regex = new RegExp(assetMatchString)
          expect(cklbHostName).to.match(regex)

          for (let stig of cklbIStigs){
            let stigId = stig.stig_id
            expect(stigId).to.be.oneOf(environment.testCollection.validStigs)
            let cklbVulns = stig.rules;
            expect(cklbVulns).to.be.an('array');
            if (stigId == 'VPN_SRG_TEST') {
                expect(cklbVulns).to.be.an('array').of.length(environment.metrics.checklistLength);
            }
          }

        })

        it('Return the Checklist for the supplied Asset and MULTI-STIG XML (.CKL) - no specified stigs', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${environment.testAsset.assetId}/checklists/`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)

          let cklData

          xml2js.parseString(res.body, function (err, result) {
            cklData = result
          })

          let cklHostName = cklData.CHECKLIST.ASSET[0].HOST_NAME[0]
          let cklIStigs = cklData.CHECKLIST.STIGS[0].iSTIG

          const assetMatchString = environment.assetMatchString
          const regex = new RegExp(assetMatchString)
          expect(cklHostName).to.match(regex)

          for (let stig of cklIStigs){
            for(let stigData of stig.STIG_INFO[0].SI_DATA){
              if (stigData.SID_NAME[0] == 'stigid'){
                currentStigId = stigData.SID_DATA[0]
                expect(currentStigId).to.be.oneOf(environment.testCollection.validStigs)
            }
            }
            let cklVulns = stig.VULN;
            expect(cklVulns).to.be.an('array');
            if (currentStigId == 'VPN_SRG_TEST') {
                expect(cklVulns).to.be.an('array').of.length(environment.metrics.checklistLength);
            }
          }
        })

        it('Return the Checklist for the supplied Asset and MULTI-STIG XML (.CKL) - specified stigs', async () => {
            
            const res = await chai
              .request(config.baseUrl)
              .get(`/assets/${environment.testAsset.assetId}/checklists?benchmarkId=${environment.testCollection.benchmark}&benchmarkId=Windows_10_STIG_TEST`)
              .set('Authorization', 'Bearer ' + user.token)
      
            if(user.name === "lvl1"){
              expect(res).to.have.status(400)
              return
            }
            
            expect(res).to.have.status(200)
      
            let cklData
      
            xml2js.parseString(res.body, function (err, result) {
              cklData = result
            })
      
            let cklHostName = cklData.CHECKLIST.ASSET[0].HOST_NAME[0]
            let cklIStigs = cklData.CHECKLIST.STIGS[0].iSTIG
      
            const assetMatchString = environment.assetMatchString
            const regex = new RegExp(assetMatchString)
            expect(cklHostName).to.match(regex)
      
            for (let stig of cklIStigs){
              for(let stigData of stig.STIG_INFO[0].SI_DATA){
                if (stigData.SID_NAME[0] == 'stigid'){
                  currentStigId = stigData.SID_DATA[0]
                  expect(currentStigId).to.be.oneOf(environment.testCollection.validStigs)
              }
              }
              let cklVulns = stig.VULN;
              expect(cklVulns).to.be.an('array');
              if (currentStigId == 'VPN_SRG_TEST') {
                  expect(cklVulns).to.be.an('array').of.length(environment.metrics.checklistLength);
              }
            }
        })
      })

      describe('getChecklistByAssetStig - /assets/{assetId}/checklists/{benchmarkId}/{revisionStr}', () => {

        it('Return the Checklist for the supplied Asset and benchmarkId and revisionStr', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${environment.testAsset.assetId}/checklists/${environment.testCollection.benchmark}/${environment.testCollection.revisionStr}?format=ckl`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)

          let cklData

          xml2js.parseString(res.body, function (err, result) {
            cklData = result
          })

          let cklHostName = cklData.CHECKLIST.ASSET[0].HOST_NAME[0]
          let cklIStigs = cklData.CHECKLIST.STIGS[0].iSTIG

          const assetMatchString = environment.assetMatchString
          const regex = new RegExp(assetMatchString)
          expect(cklHostName).to.match(regex)

          for (let stig of cklIStigs){
            for(let stigData of stig.STIG_INFO[0].SI_DATA){
              if (stigData.SID_NAME[0] == 'stigid'){
                currentStigId = stigData.SID_DATA[0]
                expect(currentStigId).to.be.eql(environment.testCollection.benchmark)
            }
            }
            let cklVulns = stig.VULN;
            expect(cklVulns).to.be.an('array');
            if (currentStigId == 'VPN_SRG_TEST') {
                expect(cklVulns).to.be.an('array').of.length(environment.metrics.checklistLength);
            }
          }
        })

        it('Return the Checklist for the supplied Asset and STIG XML (.cklB) - specific STIG', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${environment.testAsset.assetId}/checklists/${environment.testCollection.benchmark}/${environment.testCollection.revisionStr}?format=cklb`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
        
          let cklbData = res.body
          let cklbHostName = cklbData.target_data.host_name
          let cklbIStigs = cklbData.stigs

          const assetMatchString = environment.assetMatchString
          const regex = new RegExp(assetMatchString)
          expect(cklbHostName).to.match(regex)

          for (let stig of cklbIStigs){
            let stigId = stig.stig_id
            expect(stigId).to.be.oneOf(environment.testCollection.validStigs)
            let cklbVulns = stig.rules;
            expect(cklbVulns).to.be.an('array');
            if (stigId == 'VPN_SRG_TEST') {
                expect(cklbVulns).to.be.an('array').of.length(environment.metrics.checklistLength);
            }
          }
        })

        it('Return the Checklist for the supplied Asset and STIG JSON', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${environment.testAsset.assetId}/checklists/${environment.testCollection.benchmark}/${environment.testCollection.revisionStr}?format=json`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(environment.metrics.checklistLength)
        })
      })

      describe('getStigsByAsset - /assets/{assetId}/stigs', () => {

        it('Return the Checklist for the supplied Asset and benchmarkId and revisionStr - rules', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${environment.testAsset.assetId}/stigs`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          
          for(let stig of res.body){
            expect(stig.benchmarkId).to.be.oneOf(environment.testCollection.validStigs)
          }
        })
      })

      describe('getAssetsByCollectionLabelId - /collections/{collectionId}/labels/{labelId}/assets', () => {

        it('Return the Checklist for the supplied Asset and benchmarkId - rules', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/collections/${environment.testCollection.collectionId}/labels/${environment.testCollection.testLabel}/assets`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
          if(user.name === "lvl1"){
            expect(res.body).to.be.an('array').of.length(1)
          }else{
            expect(res.body).to.be.an('array').of.length(2)
          }
          const assetMatchString = environment.assetMatchString
          const regex = new RegExp(assetMatchString)
          for(let asset of res.body){
            expect(asset.name).to.match(regex)
            expect(asset.assetId).to.be.oneOf(['42','62'])
          }   
        })
      })

      describe('getAssetsByStig - /collections/{collectionId}/stigs/{benchmarkId}/assets', () => {

        it('Assets in a Collection attached to a STIG', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/collections/${environment.testCollection.collectionId}/stigs/${environment.testCollection.benchmark}/assets?projection=restrictedUserAccess`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
          if(user.name === "lvl1"){
            expect(res.body).to.be.an('array').of.length(2)
          }else{
            expect(res.body).to.be.an('array').of.length(3)
          }
          const assetMatchString = environment.assetMatchString
          const regex = new RegExp(assetMatchString)
          for(let asset of res.body){
            expect(asset.name).to.match(regex)

            if(res.request.url.includes('/projection=restrictedUserAccess/')){
              expect(asset.restrictedUserAccess).to.exist;
            }
          }   
        })
        it('Assets in a Collection attached to a STIG - label-lvl1', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/collections/${environment.testCollection.collectionId}/stigs/${environment.testCollection.benchmark}/assets?projection=restrictedUserAccess&labelId=${environment.lvl1.label}`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.be.an('array').of.length(1)
          const assetMatchString = environment.assetMatchString
          const regex = new RegExp(assetMatchString)
          for(let asset of res.body){
            expect(asset.name).to.match(regex)
            if(res.request.url.includes('/projection=restrictedUserAccess/')){
              expect(asset.restrictedUserAccess).to.exist;
            }
          }   
        })
        it('Assets in a Collection attached to a STIG - label', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/collections/${environment.testCollection.collectionId}/stigs/${environment.testCollection.benchmark}/assets?projection=restrictedUserAccess&labelId=${environment.testCollection.testLabel}`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
          if(user.name === "lvl1"){
            expect(res.body).to.be.an('array').of.length(1)
          }else{
            expect(res.body).to.be.an('array').of.length(2)
          }
          const assetMatchString = environment.assetMatchString
          const regex = new RegExp(assetMatchString)
          for(let asset of res.body){
            expect(asset.name).to.match(regex)
            if(res.request.url.includes('/projection=restrictedUserAccess/')){
              expect(asset.restrictedUserAccess).to.exist;
            }
          }   
        })
      })
    })
  }
})

