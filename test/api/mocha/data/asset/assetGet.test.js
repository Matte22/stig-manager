const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const xml2js = require('xml2js');
const users = require('../../iterations.js')
const expectations = require('./expectations.js')
const reference = require('../../referenceData.js')


describe('GET - Asset', function () {
  before(async function () {
    this.timeout(4000)
    await utils.uploadTestStigs()
    await utils.loadAppData()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users){
    if (expectations[user.name] === undefined){
      it(`No expectations for this iteration scenario: ${user.name}`, async function () {})
      continue
    }

    describe(`user:${user.name}`, function () {
      const distinct = expectations[user.name]

      describe('getAsset - /assets/{assetId}', function () {
      
        it('Return an Asset (with STIGgrants projection)', async function () {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)

          if(distinct.canModifyCollection === false){
            expect(res).to.have.status(403)
            return
          }
          else{
            expect(res).to.have.status(200)
          }
          expect(res.body.name, "expect asset name to equal test asset").to.eql(reference.testAsset.name)
          expect(res.body.collection.collectionId, "expect asset to be a part of test collection").to.eql(reference.testAsset.collectionId)
          expect(res.body.collection.name, "expect collection name to equal test collection").to.eql(reference.testCollection.name)
          expect(res.body.labelIds).to.be.an('array').of.length(reference.testAsset.labels.length)
          for(const label of res.body.labelIds){
            expect(label).to.be.oneOf(reference.testAsset.labels)
          }
          expect(res.body.metadata).to.deep.equal({
            [reference.testAsset.metadataKey]: reference.testAsset.metadataValue
          })
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

        it('Return an Asset (with STIGgrants projection) - Asset - no assigned STIGs', async function () {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAssetNoStigs.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)

          if(distinct.canModifyCollection === false){
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

        it('Return an Asset (without STIGgrants projection)', async function () {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}?projection=statusStats&projection=stigs`)
            .set('Authorization', 'Bearer ' + user.token)

          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(403)
            return
          }

          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')        
          expect(res.body.name).to.eql(reference.testAsset.name)
          expect(res.body.collection.collectionId).to.eql(reference.testAsset.collectionId)
          expect(res.body.collection.name, "expect collection name to equal test collection").to.eql(reference.testCollection.name)
          expect(res.body.labelIds).to.be.an('array').of.length(reference.testAsset.labels.length)
          for(const label of res.body.labelIds){
            expect(label).to.be.oneOf(reference.testAsset.labels)
          }
          expect(res.body.metadata).to.deep.equal({
            [reference.testAsset.metadataKey]: reference.testAsset.metadataValue
          })
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

        it('Return an Asset (without STIGgrants projection) - Asset - no assigned STIGs', async function () {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAssetNoStigs.assetId}?projection=statusStats&projection=stigs`)
            .set('Authorization', 'Bearer ' + user.token)

            if(!distinct.hasAccessToTestAssetNoStigs){
              expect(res).to.have.status(403)
              return
            }
            else{
              expect(res).to.have.status(200)
            }
            expect(res.body.name).to.eql(reference.testAssetNoStigs.name)
            expect(res.body.collection.collectionId).to.eql(reference.testAssetNoStigs.collectionId)
            expect(res.body.labelIds).to.be.an('array').of.length(reference.testAssetNoStigs.labels.length)
            expect(res.body.collection.name, "expect collection name to equal test collection").to.eql(reference.testCollection.name)
            expect(res.body.labelIds).to.be.an('array').of.length(reference.testAssetNoStigs.labels.length)
            for(const label of res.body.labelIds){
              expect(label).to.be.oneOf(reference.testAssetNoStigs.labels)
            }

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

      describe('getAssetMetadata - /assets/{assetId}/metadata,', function () {
        it('Return the Metadata for an Asset', async function () {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}/metadata`)
            .set('Authorization', 'Bearer ' + user.token)

          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')      
          expect(res.body.testkey).to.exist
          expect(res.body.testkey).to.eql(reference.testAsset.metadataValue)
        })
      })
      describe('getAssetMetadataKeys - /assets/{assetId}/metadata/keys', function () {
        it('Return the Metadata KEYS for an Asset', async function () {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}/metadata/keys`)
            .set('Authorization', 'Bearer ' + user.token)
          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.include(reference.testAsset.metadataKey)
        })
      })

      describe('getAssetMetadataValue - /assets/{assetId}/metadata/keys/{key}', function () {
        it('Return the Metadata VALUE for an Asset metadata KEY', async function () {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}/metadata/keys/${reference.testAsset.metadataKey}`)
            .set('Authorization', 'Bearer ' + user.token)
          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.include(reference.testAsset.metadataValue)
        })
      })

      describe('getAssets - /assets', function () {

        it('Assets accessible to the requester (with STIG grants projection)', async function () {
          const res = await chai
            .request(config.baseUrl).get(`/assets?collectionId=${reference.testCollection.collectionId}&benchmarkId=${reference.benchmark}&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)
          if(distinct.canModifyCollection === false){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(distinct.assetsAvailableStigGrants.length)
          for(const asset of res.body){
            expect(asset.assetId).to.be.oneOf(distinct.assetsAvailableStigGrants)
            expect(reference.benchmark).to.be.oneOf(asset.stigs.map(stig => stig.benchmarkId))
            if(asset.assetId === reference.testAsset.assetId){
              expect(asset.name, "expect asset name to equal test asset").to.eql(reference.testAsset.name)
              expect(asset.collection.collectionId, "expect asset to be a part of test collection").to.eql(reference.testAsset.collectionId)
              expect(asset.collection.name, "expect collection name to equal test collection").to.eql(reference.testCollection.name)
              expect(asset.labelIds).to.be.an('array').of.length(reference.testAsset.labels.length)
              for(const label of asset.labelIds){
                expect(label).to.be.oneOf(reference.testAsset.labels)
              }
              expect(asset.metadata).to.deep.equal({
                [reference.testAsset.metadataKey]: reference.testAsset.metadataValue
              })
            }            
          }
          const jsonData = res.body;
          const regex = new RegExp(distinct.assetMatchString)
          
          for (let asset of jsonData){
            expect(asset.name).to.match(regex)
          }
        })

        it('Assets accessible to the requester (with STIG grants projection - no benchmark specified)', async function () {
          const res = await chai
            .request(config.baseUrl).get(`/assets?collectionId=${reference.testCollection.collectionId}&projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)

          if(distinct.canModifyCollection === false){
            expect(res).to.have.status(403)
            return
          }

          expect(res).to.have.status(200)

          expect(res.body).to.be.an('array').of.length(distinct.assetIds.length)
        
          const jsonData = res.body;
          const regex = new RegExp(distinct.assetMatchString)
          
          for (let asset of jsonData){
            expect(asset.name).to.match(regex)
            expect(asset.assetId).to.be.oneOf(distinct.assetIds)

            for(let stig of asset.stigs){
              expect(stig.benchmarkId).to.be.oneOf(reference.testCollection.validStigs);
            }
            for(let grant of asset.stigGrants){
              expect(grant.benchmarkId).to.be.oneOf(reference.testCollection.validStigs);
            }
            if(asset.assetId === reference.testAsset.assetId){
              expect(asset.name, "expect asset name to equal test asset").to.eql(reference.testAsset.name)
              expect(asset.collection.collectionId, "expect asset to be a part of test collection").to.eql(reference.testAsset.collectionId)
              expect(asset.collection.name, "expect collection name to equal test collection").to.eql(reference.testCollection.name)
              expect(asset.labelIds).to.be.an('array').of.length(reference.testAsset.labels.length)
              for(const label of asset.labelIds){
                expect(label).to.be.oneOf(reference.testAsset.labels)
              }
              expect(asset.metadata).to.deep.equal({
                [reference.testAsset.metadataKey]: reference.testAsset.metadataValue
              })
              expect(asset.statusStats.ruleCount).to.eql(distinct.testAssetStats.ruleCount);
            }            
          }
        })

        it('Assets accessible to the requester - labels', async function () {
          const res = await chai
            .request(config.baseUrl).get(`/assets?collectionId=${reference.testCollection.collectionId}&labelId=${reference.testCollection.fullLabel}`)
            .set('Authorization', 'Bearer ' + user.token)

          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(distinct.assetsAvailableFullLabel.length)
          for(let asset of res.body){
            expect(asset.labelIds).to.include(reference.testCollection.fullLabel)
          }
        })

        it('Assets accessible to the requester - No StigGrants (for lvl1 user success)', async function () {
          const res = await chai
            .request(config.baseUrl).get(`/assets?collectionId=${reference.testCollection.collectionId}&benchmarkId=${reference.benchmark}`)
            .set('Authorization', 'Bearer ' + user.token)

          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(distinct.assetsAvailableBenchmark.length)
          
          const jsonData = res.body;
          const regex = new RegExp(distinct.assetMatchString)
          
          for (const asset of jsonData){
            expect(asset.name).to.match(regex)
            expect(asset.assetId, "expect assetId to be within the parameters of test collection and have test benchmark").to.be.oneOf(distinct.assetsAvailableBenchmark)
            if(asset.assetId === reference.testAsset.assetId){
              expect(asset.name, "expect asset name to equal test asset").to.eql(reference.testAsset.name)
              expect(asset.collection.collectionId, "expect asset to be a part of test collection").to.eql(reference.testAsset.collectionId)
              expect(asset.collection.name, "expect collection name to equal test collection").to.eql(reference.testCollection.name)
              expect(asset.labelIds).to.be.an('array').of.length(reference.testAsset.labels.length)
              for(const label of asset.labelIds){
                expect(label, "expect label to be a valid label").to.be.oneOf(reference.testAsset.labels)
              }
              expect(asset.metadata, "expect metadata to match test asset").to.deep.equal({
                [reference.testAsset.metadataKey]: reference.testAsset.metadataValue
              })
            }
          }
        })
      })

      describe('getChecklistByAsset - /assets/{assetId}/checklists', function () {

        it('Return the Checklist for the supplied Asset with benchmark query param', async function () {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}/checklists?benchmarkId=${reference.benchmark}`)
            .set('Authorization', 'Bearer ' + user.token)

          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(403)
            return
          }

          expect(res).to.have.status(200)

          let cklData

          xml2js.parseString(res.body, function (err, result) {
            cklData = result
          })
          let cklHostName = cklData.CHECKLIST.ASSET[0].HOST_NAME[0]
          let cklIStigs = cklData.CHECKLIST.STIGS[0].iSTIG
      
          const regex = new RegExp(distinct.assetMatchString)
          expect(cklHostName).to.match(regex)

          for (let stig of cklIStigs){
            for(let stigData of stig.STIG_INFO[0].SI_DATA){
              if (stigData.SID_NAME[0] == 'stigid'){
                currentStigId = stigData.SID_DATA[0]
                expect(currentStigId).to.be.eql(reference.benchmark)
            }
            }
            let cklVulns = stig.VULN;
            expect(cklVulns).to.be.an('array');
            if (currentStigId == reference.benchmark) {
                expect(cklVulns).to.be.an('array').of.length(reference.checklistLength);
            }
          }
        })

        it('Return the Checklist for the supplied Asset and MULTI-STIG JSON (.cklB) - no specified STIG', async function () {
            
            const res = await chai
              .request(config.baseUrl)
              .get(`/assets/${reference.testAsset.assetId}/checklists?format=cklb`)
              .set('Authorization', 'Bearer ' + user.token)

            if(!distinct.hasAccessToTestAsset){
              expect(res).to.have.status(403)
              return
            }
      
            expect(res).to.have.status(200)
            let cklbData = res.body
            let cklbHostName = cklbData.target_data.host_name
            let cklbIStigs = cklbData.stigs

            const regex = new RegExp(distinct.assetMatchString)
            expect(cklbHostName).to.match(regex)

            for (let stig of cklbIStigs){
              let stigId = stig.stig_id
              expect(stigId).to.be.oneOf(reference.testCollection.validStigs)
              let cklbVulns = stig.rules;
              expect(cklbVulns).to.be.an('array');
              if (stigId == reference.benchmark) {
                  expect(cklbVulns).to.be.an('array').of.length(reference.checklistLength);
              }
            }
        })

        it('Return the Checklist for the supplied Asset and MULTI-STIG JSON (.cklB) - specific STIGs', async function () {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}/checklists?format=cklb&benchmarkId=${reference.benchmark}&benchmarkId=Windows_10_STIG_TEST`)
            .set('Authorization', 'Bearer ' + user.token)

          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(403)
            return
          }
          if(distinct.grant === 'restricted'){
            expect(res).to.have.status(400)
            return
          }
          expect(res).to.have.status(200)
          let cklbData = res.body
          let cklbHostName = cklbData.target_data.host_name
          let cklbIStigs = cklbData.stigs

          const regex = new RegExp(distinct.assetMatchString)
          expect(cklbHostName).to.match(regex)

          for (let stig of cklbIStigs){
            let stigId = stig.stig_id
            expect(stigId).to.be.oneOf(reference.testCollection.validStigs)
            let cklbVulns = stig.rules;
            expect(cklbVulns).to.be.an('array');
            if (stigId == reference.benchmark) {
                expect(cklbVulns).to.be.an('array').of.length(reference.checklistLength);
            }
          }

        })

        it('Return the Checklist for the supplied Asset and MULTI-STIG XML (.CKL) - no specified stigs', async function () {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}/checklists/`)
            .set('Authorization', 'Bearer ' + user.token)

          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(403)
            return
          }

          expect(res).to.have.status(200)

          let cklData

          xml2js.parseString(res.body, function (err, result) {
            cklData = result
          })

          let cklHostName = cklData.CHECKLIST.ASSET[0].HOST_NAME[0]
          let cklIStigs = cklData.CHECKLIST.STIGS[0].iSTIG

          const regex = new RegExp(distinct.assetMatchString)
          expect(cklHostName).to.match(regex)

          for (let stig of cklIStigs){
            for(let stigData of stig.STIG_INFO[0].SI_DATA){
              if (stigData.SID_NAME[0] == 'stigid'){
                currentStigId = stigData.SID_DATA[0]
                expect(currentStigId).to.be.oneOf(reference.testCollection.validStigs)
            }
            }
            let cklVulns = stig.VULN;
            expect(cklVulns).to.be.an('array');
            if (currentStigId == reference.benchmark) {
                expect(cklVulns).to.be.an('array').of.length(reference.checklistLength);
            }
          }
        })

        it('Return the Checklist for the supplied Asset and MULTI-STIG XML (.CKL) - specified stigs', async function () {
            
            const res = await chai
              .request(config.baseUrl)
              .get(`/assets/${reference.testAsset.assetId}/checklists?benchmarkId=${reference.benchmark}&benchmarkId=Windows_10_STIG_TEST`)
              .set('Authorization', 'Bearer ' + user.token)
      
            if(!distinct.hasAccessToTestAsset){
              expect(res).to.have.status(403)
              return
            }
            if(distinct.grant === 'restricted'){
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
      
            const regex = new RegExp(distinct.assetMatchString)
            expect(cklHostName).to.match(regex)
      
            for (let stig of cklIStigs){
              for(let stigData of stig.STIG_INFO[0].SI_DATA){
                if (stigData.SID_NAME[0] == 'stigid'){
                  currentStigId = stigData.SID_DATA[0]
                  expect(currentStigId).to.be.oneOf(reference.testCollection.validStigs)
              }
              }
              let cklVulns = stig.VULN;
              expect(cklVulns).to.be.an('array');
              if (currentStigId == reference.benchmark) {
                  expect(cklVulns).to.be.an('array').of.length(reference.checklistLength);
              }
            }
        })
      })

      describe('getChecklistByAssetStig - /assets/{assetId}/checklists/{benchmarkId}/{revisionStr}', function () {

        it('Return the Checklist for the supplied Asset and benchmarkId and revisionStr', async function () {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}/checklists/${reference.benchmark}/${reference.revisionStr}?format=ckl`)
            .set('Authorization', 'Bearer ' + user.token)

          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(204)
            return
          }

          expect(res).to.have.status(200)

          let cklData

          xml2js.parseString(res.body, function (err, result) {
            cklData = result
          })

          let cklHostName = cklData.CHECKLIST.ASSET[0].HOST_NAME[0]
          let cklIStigs = cklData.CHECKLIST.STIGS[0].iSTIG

          const regex = new RegExp(distinct.assetMatchString)
          expect(cklHostName).to.match(regex)

          for (let stig of cklIStigs){
            for(let stigData of stig.STIG_INFO[0].SI_DATA){
              if (stigData.SID_NAME[0] == 'stigid'){
                currentStigId = stigData.SID_DATA[0]
                expect(currentStigId).to.be.eql(reference.benchmark)
            }
            }
            let cklVulns = stig.VULN;
            expect(cklVulns).to.be.an('array');
            if (currentStigId == reference.benchmark) {
                expect(cklVulns).to.be.an('array').of.length(reference.checklistLength);
            }
          }
        })

        it('Return the Checklist for the supplied Asset and STIG XML (.cklB) - specific STIG', async function () {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}/checklists/${reference.benchmark}/${reference.revisionStr}?format=cklb`)
            .set('Authorization', 'Bearer ' + user.token)

          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(204)
            return
          }

          expect(res).to.have.status(200)
        
          let cklbData = res.body
          let cklbHostName = cklbData.target_data.host_name
          let cklbIStigs = cklbData.stigs

          const regex = new RegExp(distinct.assetMatchString)
          expect(cklbHostName).to.match(regex)

          for (let stig of cklbIStigs){
            let stigId = stig.stig_id
            expect(stigId).to.be.oneOf(reference.testCollection.validStigs)
            let cklbVulns = stig.rules;
            expect(cklbVulns).to.be.an('array');
            if (stigId == reference.benchmark) {
                expect(cklbVulns).to.be.an('array').of.length(reference.checklistLength);
            }
          }
        })

        it('Return the Checklist for the supplied Asset and STIG JSON', async function () {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}/checklists/${reference.benchmark}/${reference.revisionStr}?format=json`)
            .set('Authorization', 'Bearer ' + user.token)

          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(204)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(reference.checklistLength)
        })
      })

      describe('getStigsByAsset - /assets/{assetId}/stigs', function () {

        it('Return the Checklist for the supplied Asset and benchmarkId and revisionStr - rules', async function () {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${reference.testAsset.assetId}/stigs`)
            .set('Authorization', 'Bearer ' + user.token)
          expect(res).to.have.status(200)
          if(!distinct.hasAccessToTestAsset){
            expect(res.body).to.eql([])
            return
          }
          expect(res.body).to.be.an('array').of.length(distinct.validStigs.length)
          for(let stig of res.body){
            expect(stig.benchmarkId).to.be.oneOf(reference.testCollection.validStigs)
          }
        })
      })

      describe('getAssetsByCollectionLabelId - /collections/{collectionId}/labels/{labelId}/assets', function () {

        it('Return the Checklist for the supplied Asset and benchmarkId - rules', async function () {

          const res = await chai
            .request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/labels/${reference.testCollection.fullLabel}/assets`)
            .set('Authorization', 'Bearer ' + user.token)

          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(distinct.assetsAvailableFullLabel.length)
          
          const regex = new RegExp(distinct.assetMatchString)
          for(let asset of res.body){
            expect(asset.name).to.match(regex)
            expect(asset.assetId).to.be.oneOf(distinct.assetsAvailableFullLabel)
          }   
        })
      })

      describe('getAssetsByStig - /collections/{collectionId}/stigs/{benchmarkId}/assets', function () {

        it('Assets in a Collection attached to a STIG', async function () {

          const res = await chai
            .request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/stigs/${reference.benchmark}/assets?projection=restrictedUserAccess`)
            .set('Authorization', 'Bearer ' + user.token)
            
          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(distinct.assetsAvailableBenchmark.length)
          const regex = new RegExp(distinct.assetMatchString)
          for(let asset of res.body){
            expect(asset.name, "expect asset name to match regex").to.match(regex)
            expect(asset.assetId, "expect assetId to be an asset attached to this bnenchmark").to.be.oneOf(distinct.assetsAvailableBenchmark)
            expect(asset.collectionId, "expect collectionId to be equal to reference.testCollection.collectionId").to.be.eql(reference.testCollection.collectionId)
            for(const label of asset.assetLabelIds){
              expect(label).to.be.oneOf(reference.testCollection.labels, 'Label should be one of the valid labels')
            }
            expect(asset.restrictedUserAccess).to.exist
            if(asset.restrictedUserAccess){
              for(let user of asset.restrictedUserAccess){
                expect(user.username).to.be.eql("lvl1")
              }
            }
          }   
        })
        it('Assets in a Collection attached to a STIG - label-lvl1', async function () {

          const res = await chai
            .request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/stigs/${reference.benchmark}/assets?labelId=${reference.testCollection.lvl1Label}`)
            .set('Authorization', 'Bearer ' + user.token)

          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(reference.testCollection.lvl1LabelAssetIds.length)
          for(const asset of res.body){
            expect(asset.assetId).to.be.oneOf(reference.testCollection.lvl1LabelAssetIds)
            expect(asset.collectionId, "expect collectionId to be equal to reference.testCollection.collectionId").to.be.eql(reference.testCollection.collectionId)
            for(const label of asset.assetLabelIds){
              expect(label).to.be.oneOf(reference.testCollection.labels, 'Label should be one of the valid labels')
            }            
          }
          const regex = new RegExp(distinct.assetMatchString)
          for(let asset of res.body){
            expect(asset.name).to.match(regex)
          }   
        })
        it('Assets in a Collection attached to a STIG - label', async function () {

          const res = await chai
            .request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/stigs/${reference.benchmark}/assets?labelId=${reference.testCollection.fullLabel}`)
            .set('Authorization', 'Bearer ' + user.token)

          if(!distinct.hasAccessToTestAsset){
            expect(res).to.have.status(403)
            return
          }

          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(distinct.assetsAvailableFullLabel.length)

          const regex = new RegExp(distinct.assetMatchString)
          for(let asset of res.body){
            expect(asset.name, "expect asset name to match regex").to.match(regex)
            expect(asset.assetId, "expect assetId to be an asset attached to this bnenchmark").to.be.oneOf(distinct.assetsAvailableBenchmark)
            expect(asset.collectionId, "expect collectionId to be equal to reference.testCollection.collectionId").to.be.eql(reference.testCollection.collectionId)
            for(const label of asset.assetLabelIds){
              expect(label).to.be.oneOf(reference.testCollection.labels, 'Label should be one of the valid labels')
            }            
          }   
        })
      })
    })
  }
})

