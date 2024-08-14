// This data represents components of the primary test Collections, Assets, etc. contained in the standard appData.json file without regard to access controls being exercised by the tests.  These Ids, etc. should be used to construct test case API requests. This data should only be used as expectations in cases where all test scenarios exercised are expected to return the same data.

// The standard "testCollection" includes users named after the roles they have for that specific Collection, is used in most "GET" tests or tests not expected to change data that could alter expectations for subsequent tests. "scrapCollection" is used for tests that alter Collection data in some way.

const reference = {
  benchmark: 'VPN_SRG_TEST',
  scrapBenchmark: 'RHEL_7_STIG_TEST',
  testStigfile: "U_VPN_SRG_V1R1_Manual-xccdf.xml",
  checklistLength: 81,
  revisionStr: 'V1R1',
  vpnStigs: ['VPN_SRG_TEST', 'VPN_SRG_OTHER', 'VPN_SRG_Rule-fingerprint-match-test'],
  allStigsForAdmin: ["A10_Networks_ADC_ALG_STIG","AAA_Service_SRG", "Adobe_Acrobat_Pro_DC_Continuous_STIG",
    "RHEL_7_STIG_TEST","VPN_SRG_OTHER", "VPN_SRG_Rule-fingerprint-match-test","VPN_SRG_TEST","Windows_10_STIG_TEST"],
  testCollection: {
    cci: "000015",
    ruleId: 'SV-106179r1_rule',
    groupId: "V-97041",
  },
}

module.exports = reference
