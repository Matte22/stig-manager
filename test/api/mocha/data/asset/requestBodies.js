//This data contains expected response data that varies by iteration "scenario" or "iteration" for each test case. These expectations are relative to the "referenceData.js" data used to construct the API requests.

const requestBodies = {
    tempAssetPost: {
        name: 'tempAsset',
        collectionId: "21",
        description: 'temp',
        ip: '1.1.1.1',
        fqdn: null,
        noncomputing: true,
        mac: null,
        labelIds: [],
        metadata: {
            testKey: 'testValue'
        },
        stigs: ["VPN_SRG_TEST", "Windows_10_STIG_TEST"],
    },
    testAssetPut: {
        name: "Collection_X_lvl1_asset-1",
        collectionId: "21",
        description: "",
        ip: "",
        noncomputing: true,
        mac: null,
        labelIds: [
            "755b8a28-9a68-11ec-b1bc-0242ac110002",
            "5130dc84-9a68-11ec-b1bc-0242ac110002"
        ],
        metadata: {
         testkey: "testvalue"
        },
        stigs: ["VPN_SRG_TEST", "Windows_10_STIG_TEST"],
      },
      scrapAssetPut: {
        name: "test asset stigmanadmin",
        collectionId: "1",
        description: "test desc",
        ip: "1.1.1.1",
        fqdn: null,
        noncomputing: true,
        mac: null,
        labelIds: [],
        metadata: {},
        stigs: ["VPN_SRG_TEST", "Windows_10_STIG_TEST","RHEL_7_STIG_TEST"],
      },
  }
module.exports = requestBodies
  