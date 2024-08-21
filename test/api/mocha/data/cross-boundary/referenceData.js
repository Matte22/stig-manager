// This data represents components of the primary test Collections, Assets, etc. contained in the standard appData.json file without regard to access controls being exercised by the tests.  These Ids, etc. should be used to construct test case API requests. This data should only be used as expectations in cases where all test scenarios exercised are expected to return the same data.
// The standard "testCollection" includes users named after the roles they have for that specific Collection, is used in most "GET" tests or tests not expected to change data that could alter expectations for subsequent tests. "scrapCollection" is used for tests that alter Collection data in some way.

const reference = {
    collectionId: '21',
    benchmark: 'VPN_SRG_TEST',
    revisionStr: 'V1R1',
    ruleIdLvl1NoAccess: "SV-77809r3_rule",
    lvl1ValidStigs: ["VPN_SRG_TEST"],
    testAssetLvl1NoAccess: "62",
    testCollection: {
      collectionId: '21',
      benchmark: 'VPN_SRG_TEST',
      validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
      ruleId: 'SV-106179r1_rule',
    },
    testAsset: {
      assetId: '42',
      benchmark: 'VPN_SRG_TEST',
      validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    },
    scrapCollection: {
      collectionId: "1",
    
    }
  }
  
  module.exports = reference
  