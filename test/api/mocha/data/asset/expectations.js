//This data contains expected response data that varies by iteration "scenario" or "user" for each test case. These expectations are relative to the "referenceData.js" data used to construct the API requests.

const distinct = {
  stigmanadmin: {
    user: 'admin',
    testAssetStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    userId: '87',
    testAssetStats: {
      ruleCount: 368,
      stigCount: 2,
      savedCount: 2,
      acceptedCount: 0,
      rejectedCount: 0,
      submittedCount: 7
    },
    grant: 'admin',
    assignedStigs: ['VPN_SRG_TEST'],
    assetIds: ['29', '62', '42', '154'],
    validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    collectionIds: ['21'],
    canModifyCollection: true,
    assetsAvailableFullLabel: ["62","42"],
    assetsAvailableBenchmark: ["42","62", "154"],
    assetsAvailableStigGrants:["42","62", "154"],
    
  },
  lvl1: {
    testAssetStigs: ['VPN_SRG_TEST'],
    testAssetStats: {
      ruleCount: 81,
      stigCount: 1,
      savedCount: 1,
      acceptedCount: 0,
      rejectedCount: 0,
      submittedCount: 5
    },
    user: 'lvl1',
    userId: '85',
    grant: 'restricted',
    canModifyCollection: false,
    assignedStigs: ['VPN_SRG_TEST'],
    assetIds: ['42', '154'],
    assetsAvailableFullLabel: ["42"],
    assetsAvailableBenchmark: ["42", "154"],
    validStigs: ['VPN_SRG_TEST'],
    collectionIds: ['21'],
  },
  lvl2: {
    testAssetStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    testAssetStats: {
      ruleCount: 368,
      stigCount: 2,
      savedCount: 2,
      acceptedCount: 0,
      rejectedCount: 0,
      submittedCount: 7
    },
    user: 'admin',
    userId: '87',
    canModifyCollection: false,
    grant: 'admin',
    assignedStigs: ['VPN_SRG_TEST'],
    assetIds: ['29', '62', '42', '154'],
    assetsAvailableFullLabel: ["62","42"],
    assetsAvailableBenchmark: ["42","62", "154"],
    validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    collectionIds: ['21'],
  },
  lvl3: {
    testAssetStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    testAssetStats: {
      ruleCount: 368,
      stigCount: 2,
      savedCount: 2,
      acceptedCount: 0,
      rejectedCount: 0,
      submittedCount: 7
    },
    user: 'admin',
    userId: '87',
    grant: 'admin',
    canModifyCollection: true,
    assignedStigs: ['VPN_SRG_TEST'],
    assetIds: ['29', '62', '42', '154'],
    validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    collectionIds: ['21'],
    assetsAvailableFullLabel: ["62","42"],
    assetsAvailableBenchmark: ["42","62", "154"],
    assetsAvailableStigGrants:["42","62", "154"],
  },
  lvl4: {
    testAssetStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    testAssetStats: {
      ruleCount: 368,
      stigCount: 2,
      savedCount: 2,
      acceptedCount: 0,
      rejectedCount: 0,
      submittedCount: 7
    },
    user: 'admin',
    userId: '87',
    grant: 'admin',
    canModifyCollection: true,
    assetsAvailableFullLabel: ["62","42"],
    assignedStigs: ['VPN_SRG_TEST'],
    assetIds: ['29', '62', '42', '154'],
    assetsAvailableBenchmark: ["42","62", "154"],
    validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    collectionIds: ['21'],
    assetsAvailableStigGrants:["42","62", "154"],
  },
  collectioncreator: {
    canModifyCollection: false,
  }
}
module.exports = distinct
