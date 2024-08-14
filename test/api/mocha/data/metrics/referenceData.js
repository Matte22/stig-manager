// This data represents components of the primary test Collections, Assets, etc. contained in the standard appData.json file without regard to access controls being exercised by the tests.  These Ids, etc. should be used to construct test case API requests. This data should only be used as expectations in cases where all test scenarios exercised are expected to return the same data.

// The standard "testCollection" includes users named after the roles they have for that specific Collection, is used in most "GET" tests or tests not expected to change data that could alter expectations for subsequent tests. "scrapCollection" is used for tests that alter Collection data in some way.

const reference = {
  collectionId: '21',
  benchmark: 'VPN_SRG_TEST',
  testCollection: {
    collectionId: '21',
    lvl1LabelName: 'test-label-lvl1',
    lvl1Label: '5130dc84-9a68-11ec-b1bc-0242ac110002',
    fullLabel: '755b8a28-9a68-11ec-b1bc-0242ac110002',
    fullLabelName: 'test-label-full'
  },
  testAsset: {
    assetId: '42'
  }
}

module.exports = reference
