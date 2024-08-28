// This data represents components of the primary test Collections, Assets, etc. contained in the standard appData.json file without regard to access controls being exercised by the tests.  These Ids, etc. should be used to construct test case API requests. This data should only be used as expectations in cases where all test scenarios exercised are expected to return the same data. 

// The standard "testCollection" includes users named after the roles they have for that specific Collection, is used in most "GET" tests or tests not expected to change data that could alter expectations for subsequent tests. "scrapCollection" is used for tests that alter Collection data in some way.

const reference = {
  // collectionId: "21",
  // collectionName: "Test Collection",
  // collectionDescription: "This is a test collection",
  collectionOwner: "admin",
  collectionOwnerID: "87",
  benchmark: "VPN_SRG_TEST",
  checklistLength: 81,
  revisionStr: "V1R1",
  grantCheckUserId: "85",
  lvl1ValidStigs: ["VPN_SRG_TEST"],
  testAssetLvl1NoAccess: "62",
  testCollection: {
    name: "Collection X",
    collectionId: "21",
    benchmark: "VPN_SRG_TEST",
    defaultRevision: "V1R1",    
    pinRevision: "V1R0",    
    collectionMetadataKey: "pocName",
    collectionMetadataValue: "poc2Patched",
    owners: ["87", "1", "45"],
    assetIds: ["29", "62", "42", "154"],
    assetsWithHistory: ["42", "154"],
    testAssetId: "42",
    validStigs: ["VPN_SRG_TEST", "Windows_10_STIG_TEST"],
    labelCount: 2,
    lvl1LabelName: "test-label-lvl1",
    lvl1Label: "5130dc84-9a68-11ec-b1bc-0242ac110002",
    lvl1LabelAssetIds: ["42"],
    fullLabelName: "test-label-full",
    fullLabel: "755b8a28-9a68-11ec-b1bc-0242ac110002",
    labels: [
      "755b8a28-9a68-11ec-b1bc-0242ac110002",
      "5130dc84-9a68-11ec-b1bc-0242ac110002"
    ],
    allMetadata: [
      {
        key: "pocEmail",
        value: "pocEmail@email.com"
      },
      {
        key: "pocName",
        value: "poc2Patched"
      },
      {
        key: "pocPhone",
        value: "12342"
      },
      {
        key: "reqRar",
        value: "true"
      }
    ],
    reviewHistory: {
      assetId: "42",
      startDate: "1900-10-01",
      endDate: "2020-10-01",
      deletedEntriesByDate: 6,
      deletedEntriesByDateAsset: 4,
      ruleId: "SV-106179r1_rule",
      status: "submitted",
      rulesWithHistoryCnt: 2,
      reviewHistoryRuleCnt: 2,
      reviewHistoryTotalEntryCnt: 7,
      reviewHistory_endDateCnt: 6,
      reviewHistory_startAndEndDateCnt: 6,
      reviewHistory_startDateCnt: 2,
      reviewHistory_byStatusCnt: 3,
      reviewHistory_testAssetCnt: 5,
      reviewHistory_entriesByRuleIdCnt: 4,
    },
    assetsProjected: [
      {
        name: "ACHERNAR_Collection_X_asset",
        assetId: "29",
      },
      {
        name: "Collection_X_asset",
        assetId: "62",
      },
      {
        name: "Collection_X_lvl1_asset-1",
        assetId: "42",
      },
      {
        name: "Collection_X_lvl1_asset-2",
        assetId: "154",
      },
    ],
    grantsProjected: [
      {
        user: {
          userId: "86",
          username: "bizarroLvl1",
          displayName: "bizarroLvl1"
          },
        accessLevel: 1
      },
      {
        user: {
          userId: "85",
          username: "lvl1",
          displayName: "lvl1"
        },
        accessLevel: 1
      },
      {
        user: {
          userId: "21",
          username: "lvl2",
          displayName: "lvl2"
        },
        accessLevel: 2
      },
      {
        user: {
          userId: "44",
          username: "lvl3",
          displayName: "lvl3"
        },
        accessLevel: 3
      },
      {
        user: {
          userId: "87",
          username: "admin",
          displayName: "Admin Burke"
        },
        accessLevel: 4
      },
      {
        user: {
          userId: "1",
          username: "stigmanadmin",
          displayName: "STIGMAN Admin"
        },
        accessLevel: 4
      },
      {
        user: {
          userId: "45",
          username: "lvl4",
          displayName: "lvl4"
        },
        accessLevel: 4
      }
    ],
    ownersProjected: [
      {
        email: "admin@admin.com",
        userId: "87",
        username: "admin",
        displayName: "Admin Burke"
      },
      {
        email: null,
        userId: "1",
        username: "stigmanadmin",
        displayName: "STIGMAN Admin"
      },
      {
        email: null,
        userId: "45",
        username: "lvl4",
        displayName: null
      }
    ],
    stigsProjected: [
      {
        ruleCount: 81,
        benchmarkId: "VPN_SRG_TEST",
        revisionStr: "V1R0",
        benchmarkDate: "2010-07-19",
        revisionPinned: true
      },
      {
        ruleCount: 287,
        benchmarkId: "Windows_10_STIG_TEST",
        revisionStr: "V1R23",
        benchmarkDate: "2020-06-17",
        revisionPinned: false
      }
    ],
    statisticsProjected: {
      assetCount: 4,
      grantCount: 7,
      checklistCount: 6
    },
    labelsProjected: [
      {
        name: "test-label-full",
        description: "",
        color: "FF99CC",
        uses: 2
      },
      {
        name: "test-label-lvl1",
        description: "",
        color: "99CCFF",
        uses: 1
      }
    ]
  },
  deleteCollection: {
    collectionId_adminOnly: "84",
    collectionId: "85"
  },
  scrapCollection: {
    collectionId: "1",
    validStigs: ["VPN_SRG_TEST", "Windows_10_STIG_TEST", "RHEL_7_STIG_TEST"],
    scrapLabel: "df4e6836-a003-11ec-b1bc-0242ac110002",
    collectionMetadataKey: "pocName",
    collectionMetadataValue: "poc2Patched"
  },
  scrapLvl1User: {
    userId: "86",
    username: "bizarroLvl1"
  },
  scrapAsset: {
    assetId: "34",
    scrapBenchmark: "RHEL_7_STIG_TEST",
    metadataKey: "testkey",
    metadataValue: "testvalue"
  },
  testAsset: {
    name: "Collection_X_lvl1_asset-1",
    assetId: "42",
    collectionId: "21",
    usersWithGrant: ["86","85"],
    benchmark: "VPN_SRG_TEST",
    validStigs: ["VPN_SRG_TEST", "Windows_10_STIG_TEST"],
    reviewCnt: 9,
    metadataKey: "testkey",
    metadataValue: "testvalue",
    labels: [
      "755b8a28-9a68-11ec-b1bc-0242ac110002",
      "5130dc84-9a68-11ec-b1bc-0242ac110002"
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
  testCci: {
    id: "000015",
    status: "draft",
  },
  lvl1User:{
    username: "lvl1",
    userId: "85"
  },
  testRule: {
    ruleId: "SV-106179r1_rule",
    groupId: "V-97041",
    version: "SRG-NET-000019-VPN-000040",
  },
  ruleIdLvl1NoAccess: "SV-77809r3_rule",
  testGroupId: "V-97041",
  allUserIds: ['87', '86', '82', '85', '21', '44', '45', '1', '22', '43'],
  wfTest: {
    username: 'wf-test',
    userId: '22'
  },
  deleteUser: {
    username: 'workforce-60',
    userId: '43'
  },  
  testBenchmarkAllRevisions: ['V1R1', 'V1R0'],
  scrapBenchmark: 'RHEL_7_STIG_TEST',
  testStigfile: 'U_VPN_SRG_V1R1_Manual-xccdf.xml',
  vpnStigs: [
    'VPN_SRG_TEST',
    'VPN_SRG_OTHER',
    'VPN_SRG_Rule-fingerprint-match-test'
  ],
  allStigsForAdmin: [
    'A10_Networks_ADC_ALG_STIG',
    'AAA_Service_SRG',
    'Adobe_Acrobat_Pro_DC_Continuous_STIG',
    'RHEL_7_STIG_TEST',
    'VPN_SRG_OTHER',
    'VPN_SRG_Rule-fingerprint-match-test',
    'VPN_SRG_TEST',
    'Windows_10_STIG_TEST'
  ],  
};

module.exports = reference;