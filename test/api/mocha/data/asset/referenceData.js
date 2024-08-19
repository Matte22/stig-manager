// This data represents components of the primary test Collections, Assets, etc. contained in the standard appData.json file without regard to access controls being exercised by the tests.  These Ids, etc. should be used to construct test case API requests. This data should only be used as expectations in cases where all test scenarios exercised are expected to return the same data.

// The standard "testCollection" includes users named after the roles they have for that specific Collection, is used in most "GET" tests or tests not expected to change data that could alter expectations for subsequent tests. "scrapCollection" is used for tests that alter Collection data in some way.

const reference = {
  collectionId: "21",
  benchmark: "VPN_SRG_TEST",
  checklistLength: "81",
  revisionStr: "V1R1",
  testCollection: {
    name: "Collection X",
    ruleId: "SV-106179r1_rule",
    collectionId: "21",
    assetIds: ["29", "62", "42", "154"],
    validStigs: ["VPN_SRG_TEST", "Windows_10_STIG_TEST"],
    lvl1Label: "5130dc84-9a68-11ec-b1bc-0242ac110002",
    lvl1LabelAssetIds: ["42"],
    fullLabel: "755b8a28-9a68-11ec-b1bc-0242ac110002",
    labels: [
      "755b8a28-9a68-11ec-b1bc-0242ac110002",
      "5130dc84-9a68-11ec-b1bc-0242ac110002",
    ],
  },
  scrapCollection: {
    collectionId: "1",
    validStigs: ["VPN_SRG_TEST", "Windows_10_STIG_TEST", "RHEL_7_STIG_TEST"],
    scrapLabel: "df4e6836-a003-11ec-b1bc-0242ac110002",
    collectionMetadataKey: "pocName",
    collectionMetadataValue: "poc2Patched",
  },
  scrapLvl1User: {
    userId: "86",
    username: "bizarroLvl1",
  },
  scrapAsset: {
    assetId: "34",
    scrapBenchmark: "RHEL_7_STIG_TEST",
    metadataKey: "testkey",
    metadataValue: "testvalue",
  },
  testAssetNoStigs: {
    name: "ACHERNAR_Collection_X_asset",
    assetId: "29",
    collectionId: "21",
    labels: [],
    stigs: [],
    stats: {
        ruleCount: null,
        stigCount: 0,
        savedCount: null,
        acceptedCount: null,
        rejectedCount: null,
        submittedCount: null,
      },
  },
  testAsset: {
    name: "Collection_X_lvl1_asset-1",
    assetId: "42",
    collectionId: "21",
    usersWithGrant: ["86", "85"],
    benchmark: "VPN_SRG_TEST",
    validStigs: ["VPN_SRG_TEST", "Windows_10_STIG_TEST"],
    metadataKey: "testkey",
    metadataValue: "testvalue",
    labels: [
      "755b8a28-9a68-11ec-b1bc-0242ac110002",
      "5130dc84-9a68-11ec-b1bc-0242ac110002",
    ],
    stats: {
      ruleCount: 368,
      stigCount: 2,
      savedCount: 2,
      acceptedCount: 0,
      rejectedCount: 0,
      submittedCount: 7,
    },
  },
};

module.exports = reference;
 