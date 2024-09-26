//This data contains expected response data that varies by iteration "scenario" or "user" for each test case. These expectations are relative to the "referenceData.js" data used to construct the API requests.

const requestBodies = {
  iterationSetup: {
    //  
    //   acl_assetBenchmark_rw:
    //    [{"benchmarkId":"VPN_SRG_TEST","assetId":"42","access":"rw"},{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"}],
    //    acl_label_assetBenchmark_rw:
    //     [{"benchmarkId":"VPN_SRG_TEST","assetId":"42","access":"rw"},{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"}],
    //   acl_labelBenchmark_rw:
    //     [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","access":"rw"}],
    //   acl_labelAsset_rw:
    //     [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"assetId":"154","access":"rw"}],
    //   acl_label_minus_assetBenchmark_rw:
    //     [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","assetId":"42","access":"none"},{"benchmarkId":"Windows_10_STIG_TEST","assetId":"62","access":"none"}],
    //   acl_label_minus_stig_rw:
    //     [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","access":"none"}],
    //   acl_label_minus_asset:
    //     [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"assetId":"154","access":"none"}],
    //   acl_benchmark_conflictingAccess:
    //     [{"benchmarkId":"VPN_SRG_TEST","access":"rw"}, {"benchmarkId":"VPN_SRG_TEST","access":"none"}],
    // },

    // no access
    none: [],
    all: [],

    // 42 = "Collection_X_lvl1_asset-1"
    // 29 = ACHERNAR_Collection_X_asset
    //62 = Collection_X_asset
    //154 = Collection_X_lvl1_asset-2
    // full label = 755



    // single
    label_rw: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"}],
    label_r: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"r"}],
    label_none: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"none"}],
    benchmark_rw: [{"benchmarkId":"VPN_SRG_TEST","access":"rw"}],
    benchmark_r: [{"benchmarkId":"VPN_SRG_TEST","access":"r"}],
    benchmark_none: [{"benchmarkId":"VPN_SRG_TEST","access":"none"}],
    asset_rw: [{"assetId":"42","access":"rw"}],
    asset_r: [{"assetId":"42","access":"r"}],
    asset_none: [{"assetId":"42","access":"none"}],
    assetBenchmark_rw: [{"benchmarkId":"VPN_SRG_TEST","assetId":"42","access":"rw"}],
    assetBenchmark_r: [{"benchmarkId":"VPN_SRG_TEST","assetId":"42","access":"r"}],
    assetBenchmark_none: [{"benchmarkId":"VPN_SRG_TEST","assetId":"42","access":"none"}],


    // double assetBenchmark +/- label
    assetBenchmark_rw_label_rw: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"}],
    assetBenchmark_rw_label_r: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"r"}],
    assetBenchmark_rw_label_none: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"none"}],
    assetBenchmark_r_label_rw: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"r"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"}],
    assetBenchmark_r_label_r: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"r"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"r"}],
    assetBenchmark_r_label_none: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"r"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"none"}],
    assetBenchmark_none_label_rw: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"none"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"}],
    assetBenchmark_none_label_r: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"none"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"r"}],
    assetBenchmark_none_label_none: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"none"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"none"}],

    // double assetBenchmark +/- benchmark
    assetBenchmark_rw_benchmark_rw: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","access":"rw"}],
    assetBenchmark_rw_benchmark_r: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","access":"r"}],
    assetBenchmark_rw_benchmark_none: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","access":"none"}],
    assetBenchmark_r_benchmark_rw: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"r"},{"benchmarkId":"Windows_10_STIG_TEST","access":"rw"}],
    assetBenchmark_r_benchmark_r: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"r"},{"benchmarkId":"Windows_10_STIG_TEST","access":"r"}],
    assetBenchmark_r_benchmark_none: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"r"},{"benchmarkId":"Windows_10_STIG_TEST","access":"none"}],
    assetBenchmark_none_benchmark_rw: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"none"},{"benchmarkId":"Windows_10_STIG_TEST","access":"rw"}],
    assetBenchmark_none_benchmark_r: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"none"},{"benchmarkId":"Windows_10_STIG_TEST","access":"r"}],
    assetBenchmark_none_benchmark_none: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"none"},{"benchmarkId":"Windows_10_STIG_TEST","access":"none"}],

    // double assetBenchmark +/- asset
    assetBenchmark_rw_asset_rw: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"assetId":"42","access":"rw"}],
    assetBenchmark_rw_asset_r: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"assetId":"42","access":"r"}],
    assetBenchmark_rw_asset_none: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"assetId":"42","access":"none"}],
    assetBenchmark_r_asset_rw: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"r"},{"assetId":"42","access":"rw"}],
    assetBenchmark_r_asset_r: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"r"},{"assetId":"42","access":"r"}],
    assetBenchmark_r_asset_none: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"r"},{"assetId":"42","access":"none"}],
    assetBenchmark_none_asset_rw: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"none"},{"assetId":"42","access":"rw"}],
    assetBenchmark_none_asset_r: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"none"},{"assetId":"42","access":"r"}],
    assetBenchmark_none_asset_none: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"none"},{"assetId":"42","access":"none"}],

    // double label +/- benchmark
    // dont think the data will allow this one to happen
    label_rw_benchmark_rw: [],
    label_rw_benchmark_r: [],
    label_rw_benchmark_none: [],
    label_r_benchmark_rw: [],
    label_r_benchmark_r: [],
    label_r_benchmark_none: [],
    label_none_benchmark_rw: [],
    label_none_benchmark_r: [],
    label_none_benchmark_none: [],

    // double label +/- asset
    label_rw_asset_rw: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"assetId":"154","access":"rw"}],
    label_rw_asset_r: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"assetId":"154","access":"r"}],
    label_rw_asset_none: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"assetId":"154","access":"none"}],
    label_r_asset_rw: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"r"},{"assetId":"154","access":"rw"}],
    label_r_asset_r: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"r"},{"assetId":"154","access":"r"}],
    label_r_asset_none: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"r"},{"assetId":"154","access":"none"}],
    label_none_asset_rw: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"none"},{"assetId":"154","access":"rw"}],
    label_none_asset_r: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"none"},{"assetId":"154","access":"r"}],
    label_none_asset_none: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"none"},{"assetId":"154","access":"none"}],

    // double benchmark +/- asset
    // could use better data but not really too neccessary
    // when quierying the effective endpoint I do not see asset 29 in the response this is wrong? 
    benchmark_rw_asset_rw: [{"benchmarkId":"VPN_SRG_TEST","access":"rw"},{"assetId":"29","access":"rw"}],
    benchmark_rw_asset_r: [{"benchmarkId":"VPN_SRG_TEST","access":"rw"},{"assetId":"29","access":"r"}],
    benchmark_rw_asset_none: [{"benchmarkId":"VPN_SRG_TEST","access":"rw"},{"assetId":"29","access":"none"}],
    benchmark_r_asset_rw: [{"benchmarkId":"VPN_SRG_TEST","access":"r"},{"assetId":"29","access":"rw"}],
    benchmark_r_asset_r: [{"benchmarkId":"VPN_SRG_TEST","access":"r"},{"assetId":"29","access":"r"}],
    benchmark_r_asset_none: [{"benchmarkId":"VPN_SRG_TEST","access":"r"},{"assetId":"29","access":"none"}],
    benchmark_none_asset_rw: [{"benchmarkId":"VPN_SRG_TEST","access":"none"},{"assetId":"29","access":"rw"}],
    benchmark_none_asset_r: [{"benchmarkId":"VPN_SRG_TEST","access":"none"},{"assetId":"29","access":"r"}],
    benchmark_none_asset_none: [{"benchmarkId":"VPN_SRG_TEST","access":"none"},{"assetId":"29","access":"none"}],

    // triple label +/- benchmark +/- asset
    label_rw_benchmark_rw_asset_rw: [],
    label_rw_benchmark_rw_asset_r: [],
    label_rw_benchmark_rw_asset_none: [],
    label_rw_benchmark_r_asset_rw: [],
    label_rw_benchmark_r_asset_r: [],
    label_rw_benchmark_r_asset_none: [],
    label_rw_benchmark_none_asset_rw: [],
    label_rw_benchmark_none_asset_r: [],
    label_rw_benchmark_none_asset_none: [],
    label_r_benchmark_rw_asset_rw: [],
    label_r_benchmark_rw_asset_r: [],
    label_r_benchmark_rw_asset_none: [],
    label_r_benchmark_r_asset_rw: [],
    label_r_benchmark_r_asset_r: [],
    label_r_benchmark_r_asset_none: [],
    label_r_benchmark_none_asset_rw: [],
    label_r_benchmark_none_asset_r: [],
    label_r_benchmark_none_asset_none: [],
    label_none_benchmark_rw_asset_rw: [],
    label_none_benchmark_rw_asset_r: [],
    label_none_benchmark_rw_asset_none: [],
    label_none_benchmark_r_asset_rw: [],
    label_none_benchmark_r_asset_r: [],
    label_none_benchmark_r_asset_none: [],
    label_none_benchmark_none_asset_rw: [],
    label_none_benchmark_none_asset_r: [],
    label_none_benchmark_none_asset_none: [],

    // idk if needed
    // triple assetBenchmark +/- label +/- benchmark +/- asset
    assetBenchmark_rw_label_rw_benchmark_rw_asset_rw: [],
    assetBenchmark_rw_label_rw_benchmark_r_asset_r: [],
    assetBenchmark_rw_label_rw_benchmark_none_asset_none: [],
    assetBenchmark_rw_label_r_benchmark_rw_asset_rw: [],
    assetBenchmark_rw_label_r_benchmark_r_asset_r: [],
    assetBenchmark_rw_label_r_benchmark_none_asset_none: [],
    assetBenchmark_rw_label_none_benchmark_rw_asset_rw: [],
    assetBenchmark_rw_label_none_benchmark_r_asset_r: [],
    assetBenchmark_rw_label_none_benchmark_none_asset_none: [],
    assetBenchmark_r_label_rw_benchmark_rw_asset_rw: [],
    assetBenchmark_r_label_rw_benchmark_r_asset_r: [],
    assetBenchmark_r_label_rw_benchmark_none_asset_none: [],
    assetBenchmark_r_label_r_benchmark_rw_asset_rw: [],
    assetBenchmark_r_label_r_benchmark_r_asset_r: [],
    assetBenchmark_r_label_r_benchmark_none_asset_none: [],
    assetBenchmark_r_label_none_benchmark_rw_asset_rw: [],
    assetBenchmark_r_label_none_benchmark_r_asset_r: [],
    assetBenchmark_r_label_none_benchmark_none_asset_none: [],
    assetBenchmark_none_label_rw_benchmark_rw_asset_rw: [],
    assetBenchmark_none_label_rw_benchmark_r_asset_r: [],
    assetBenchmark_none_label_rw_benchmark_none_asset_none: [],
    assetBenchmark_none_label_r_benchmark_rw_asset_rw: [],
    assetBenchmark_none_label_r_benchmark_r_asset_r: [],
    assetBenchmark_none_label_r_benchmark_none_asset_none: [],
    assetBenchmark_none_label_none_benchmark_rw_asset_rw: [],
    assetBenchmark_none_label_none_benchmark_r_asset_r: [],
    assetBenchmark_none_label_none_benchmark_none_asset_none: [],


    // conflicting (same asset,label,benchmark different access)
    asset_conflict_rw_r: [{"assetId":"42","access":"rw"},{"assetId":"42","access":"r"}],
    asset_conflict_rw_none: [{"assetId":"42","access":"rw"},{"assetId":"42","access":"none"}],
    asset_conflict_r_none: [{"assetId":"42","access":"r"},{"assetId":"42","access":"none"}],

    benchmark_conflict_rw_r: [{"benchmarkId":"VPN_SRG_TEST","access":"rw"},{"benchmarkId":"VPN_SRG_TEST","access":"r"}],
    benchmark_conflict_rw_none: [{"benchmarkId":"VPN_SRG_TEST","access":"rw"},{"benchmarkId":"VPN_SRG_TEST","access":"none"}],
    benchmark_conflict_r_none: [{"benchmarkId":"VPN_SRG_TEST","access":"r"},{"benchmarkId":"VPN_SRG_TEST","access":"none"}],

    label_conflict_rw_r: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"r"}],
    label_conflict_rw_none: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"none"}],
    label_conflict_r_none: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"r"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"none"}],


    // label - multiple assets
    label_rw_asset_rw_asset_r: [{"labelId": "755b8a28-9a68-11ec-b1bc-0242ac110002", "access": "rw"}, {"assetId":"29","access":"rw"}, {"assetId": "154", "access": "r"}], // whole label rw, asset 1 rw, asset 2 r
    label_rw_asset_rw_asset_none: [{"labelId": "755b8a28-9a68-11ec-b1bc-0242ac110002", "access": "rw"}, {"assetId":"29","access":"rw"}, {"assetId": "42", "access": "none"}], // whole label rw, asset 1 rw, minus asset 2 which is in whole label rw label

    // label - multiple benchmarks
    //data is not set up to allow this to happen
    label_rw_benchmark_rw_benchmark_r: [], // whole label rw, benchmark 1 rw, benchmark 2 r
    label_rw_benchmark_rw_benchmark_none: [], // whole label rw, benchmark 1 rw, minus benchmark 2

    // benchmark - multiple assets
    benchmark_rw_asset_rw_asset_r: [{"benchmarkId": "VPN_SRG_TEST", "access": "rw"}, {"assetId":"29","access":"rw"}, {"assetId": "42", "access": "r"}], // whole benchmark rw, add new asset asset 1 rw which isnt in the benchamrk then make asset 2 test assset read only
    benchmark_rw_asset_rw_asset_none: [{"benchmarkId": "VPN_SRG_TEST", "access": "rw"}, {"assetId":"29","access":"rw"}, {"assetId": "42", "access": "none"}], // whole benchmark rw, asset 1 rw, minus asset 2 test asset

    // benchmark - multiple labels
    // data is not set up to allow this to happen
    // one below shows some double assets 
    benchmark_rw_label_rw_label_none:  [{"benchmarkId": "VPN_SRG_TEST", "access": "rw"}, {"labelId": "755b8a28-9a68-11ec-b1bc-0242ac110002", "access": "rw"}, {"labelId": "5130dc84-9a68-11ec-b1bc-0242ac110002", "access": "none"}], // whole benchmark rw, label 1 rw, label 2 r

    // label - multiple benchmarks - multiple assets
    label_rw_benchmark_rw_benchmark_r_asset_rw_asset_r: [], // whole label rw, benchmark 1 rw, benchmark 2 r, asset 1 rw, asset 2 r
    label_rw_benchmark_rw_benchmark_r_asset_none_asset_none: [], // whole label rw, benchmark 1 rw, benchmark 2 r, minus asset 1, minus asset 2
    label_rw_benchmark_none_benchmark_r_asset_rw_asset_none: [], // whole label rw, minus benchmark 1, minus benchmark 2, asset 1 rw, minus asset 2

    // benchmark - multiple labels - multiple assets
    benchmark_rw_label_rw_label_r_asset_rw_asset_r: [], // whole benchmark rw, label 1 rw, label 2 r, asset 1 rw, asset 2 r
    benchmark_rw_label_rw_label_r_asset_none_asset_none: [], // whole benchmark rw, label 1 rw, label 2 r, minus asset 1, minus asset 2
    benchmark_rw_label_none_label_r_asset_rw_asset_none: [], // whole benchmark rw, minus label 1, label 2 r , asset 1 rw, minus asset 2

    // asset - multiple labels - multiple benchmarks
    asset_rw_label_rw_label_r_benchmark_rw_benchmark_r: [], // whole asset rw, label 1 rw, label 2 r, benchmark 1 rw, benchmark 2 r
    asset_rw_label_rw_label_r_benchmark_none_benchmark_none: [], // whole asset rw, label 1 rw, label 2 r, minus benchmark 1, minus benchmark 2
    asset_rw_label_none_label_r_benchmark_rw_benchmark_none: [] // whole asset rw, minus label 1, label 2 r, benchmark 1 rw, minus benchmark 2
  }
}

module.exports = requestBodies
