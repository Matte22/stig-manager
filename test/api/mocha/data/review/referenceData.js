// This data represents components of the primary test Collections, Assets, etc. contained in the standard appData.json file without regard to access controls being exercised by the tests.  These Ids, etc. should be used to construct test case API requests. This data should only be used as expectations in cases where all test scenarios exercised are expected to return the same data.
// The standard "testCollection" includes users named after the roles they have for that specific Collection, is used in most "GET" tests or tests not expected to change data that could alter expectations for subsequent tests. "scrapCollection" is used for tests that alter Collection data in some way.

const reference = {
  collectionId: '21',
  benchmark: 'VPN_SRG_TEST',
  checklistLength: 81,
  revisionStr: 'V1R1',
  testCollection: {
    collectionId: '21',
    benchmark: 'VPN_SRG_TEST',
    defaultRevision: 'V1R1',
    collectionMetadataKey: 'pocName',
    collectionMetadataValue: 'poc2Patched',
    metadataKey: 'testkey',
    metadataValue: 'testvalue',
    assetIds: ['29', '62', '42', '154'],
    validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    ruleId: 'SV-106179r1_rule',
  },
  testAsset: {
    assetId: '42',
    benchmark: 'VPN_SRG_TEST',
    validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    metadataKey: 'testkey',
    metadataValue: 'testvalue',
    labels: [
      '755b8a28-9a68-11ec-b1bc-0242ac110002',
      '5130dc84-9a68-11ec-b1bc-0242ac110002'
    ],
    testRuleId: 'SV-106179r1_rule',
    freshRuleId: 'SV-106195r1_rule',
    testRuleIdHistoryCount: 2,
    testRuleIdStig: 'VPN_SRG_TEST',
    testRuleIdStigCount: 1,
    testBenchmarkReviews: 6,
    reviewRuleIds: [
      "SV-106179r1_rule",
      "SV-106181r1_rule",
      "SV-106183r1_rule",
      "SV-106185r1_rule",
      "SV-106187r1_rule",
      "SV-106189r1_rule",
      'SV-77813r6_rule',
      'SV-77811r1_rule',
      'SV-77809r3_rule'
    ],
  },
  stigmanadmin: {
    username: 'stigmanadmin',
    userId: '1'
  }
}

module.exports = reference
