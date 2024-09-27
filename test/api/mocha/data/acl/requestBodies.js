//This data contains expected response data that varies by iteration "scenario" or "user" for each test case. These expectations are relative to the "referenceData.js" data used to construct the API requests.

const { benchmark } = require("../../referenceData")

// 42 = "Collection_X_lvl1_asset-1"
// 29 = ACHERNAR_Collection_X_asset
//62 = Collection_X_asset
// 154 = Collection_X_lvl1_asset-2
// full label = 755

//https://www.geeksforgeeks.org/pairwise-software-testing/

const requestBodies = {
  iterationSetup: {

    none: [],
    all: [],
   
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

    //double asset +/- asset
    asset_rw_asset_rw: [{"assetId":"42","access":"rw"},{"assetId":"154","access":"rw"}],
    asset_rw_asset_r: [{"assetId":"42","access":"rw"},{"assetId":"154","access":"r"}],
    asset_rw_asset_none: [{"assetId":"42","access":"rw"},{"assetId":"154","access":"none"}],
    asset_r_asset_rw: [{"assetId":"42","access":"r"},{"assetId":"154","access":"rw"}],
    asset_r_asset_r: [{"assetId":"42","access":"r"},{"assetId":"154","access":"r"}],
    asset_r_asset_none: [{"assetId":"42","access":"r"},{"assetId":"154","access":"none"}],
    asset_none_asset_rw: [{"assetId":"42","access":"none"},{"assetId":"154","access":"rw"}],
    asset_none_asset_r: [{"assetId":"42","access":"none"},{"assetId":"154","access":"r"}],
    asset_none_asset_none: [{"assetId":"42","access":"none"},{"assetId":"154","access":"none"}],

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
    
    // double assetBenchmark +/- assetBenchmark 
    assetBenchmark_rw_benchmark_rw: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","assetId":"42","access":"rw"}],
    assetBenchmark_rw_benchmark_r: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","assetId":"42","access":"r"}],
    assetBenchmark_rw_benchmark_none: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","assetId":"42","access":"none"}],
    assetBenchmark_r_benchmark_rw: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"r"},{"benchmarkId":"Windows_10_STIG_TEST","assetId":"42","access":"rw"}],
    assetBenchmark_r_benchmark_r: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"r"},{"benchmarkId":"Windows_10_STIG_TEST","assetId":"42","access":"r"}],
    assetBenchmark_r_benchmark_none: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"r"},{"benchmarkId":"Windows_10_STIG_TEST","assetId":"42","access":"none"}],
    assetBenchmark_none_benchmark_rw: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"none"},{"benchmarkId":"Windows_10_STIG_TEST","assetId":"42","access":"rw"}],
    assetBenchmark_none_benchmark_r: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"none"},{"benchmarkId":"Windows_10_STIG_TEST","assetId":"42","access":"r"}],
    assetBenchmark_none_benchmark_none: [{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"none"},{"benchmarkId":"Windows_10_STIG_TEST","assetId":"42","access":"none"}],

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

    // double label +/- label 
    label_rw_label_rw: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"labelId":"5130dc84-9a68-11ec-b1bc-0242ac110002","access":"rw"}],
    label_rw_label_r: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"labelId":"5130dc84-9a68-11ec-b1bc-0242ac110002","access":"r"}],
    label_rw_label_none: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"labelId":"5130dc84-9a68-11ec-b1bc-0242ac110002","access":"none"}],
    label_r_label_rw: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"r"},{"labelId":"5130dc84-9a68-11ec-b1bc-0242ac110002","access":"rw"}],
    label_r_label_r: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"r"},{"labelId":"5130dc84-9a68-11ec-b1bc-0242ac110002","access":"r"}],
    label_r_label_none: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"r"},{"labelId":"5130dc84-9a68-11ec-b1bc-0242ac110002","access":"none"}],
    label_none_label_rw: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"none"},{"labelId":"5130dc84-9a68-11ec-b1bc-0242ac110002","access":"rw"}],
    label_none_label_r: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"none"},{"labelId":"5130dc84-9a68-11ec-b1bc-0242ac110002","access":"r"}],
    label_none_label_none: [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"none"},{"labelId":"5130dc84-9a68-11ec-b1bc-0242ac110002","access":"none"}],

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

    // double benchmark +/- benchmark
    benchmark_rw_benchmark_rw: [{"benchmarkId":"VPN_SRG_TEST","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","access":"rw"}],
    benchmark_rw_benchmark_r: [{"benchmarkId":"VPN_SRG_TEST","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","access":"r"}],
    benchmark_rw_benchmark_none: [{"benchmarkId":"VPN_SRG_TEST","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","access":"none"}],
    benchmark_r_benchmark_rw: [{"benchmarkId":"VPN_SRG_TEST","access":"r"},{"benchmarkId":"Windows_10_STIG_TEST","access":"rw"}],
    benchmark_r_benchmark_r: [{"benchmarkId":"VPN_SRG_TEST","access":"r"},{"benchmarkId":"Windows_10_STIG_TEST","access":"r"}],
    benchmark_r_benchmark_none: [{"benchmarkId":"VPN_SRG_TEST","access":"r"},{"benchmarkId":"Windows_10_STIG_TEST","access":"none"}],
    benchmark_none_benchmark_rw: [{"benchmarkId":"VPN_SRG_TEST","access":"none"},{"benchmarkId":"Windows_10_STIG_TEST","access":"rw"}],
    benchmark_none_benchmark_r: [{"benchmarkId":"VPN_SRG_TEST","access":"none"},{"benchmarkId":"Windows_10_STIG_TEST","access":"r"}],
    benchmark_none_benchmark_none: [{"benchmarkId":"VPN_SRG_TEST","access":"none"},{"benchmarkId":"Windows_10_STIG_TEST","access":"none"}],

    // triple label +/- benchmark +/- asset
    // non pair wise test cases
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
     // this is going to be done pairwise so 3^2 = 9 ooposed to 3^3 = 27
    label_rw_benchmark_rw_asset_rw: [],
    label_rw_benchmark_r_asset_none: [],
    label_r_benchmark_none_asset_rw: [],
    label_r_benchmark_rw_asset_r: [],
    label_none_benchmark_r_asset_rw: [],
    label_none_benchmark_rw_asset_none: [],
    label_rw_benchmark_none_asset_r: [],
    label_r_benchmark_rw_asset_rw: [],
    label_none_benchmark_r_asset_r: [],

    // triple assetBenchmark +/- label +/- benchmark
    assetBenchmark_rw_label_rw_benchmark_rw: [],
    assetBenchmark_rw_label_rw_benchmark_r: [],
    assetBenchmark_rw_label_rw_benchmark_none: [],
    assetBenchmark_rw_label_r_benchmark_rw: [],
    assetBenchmark_rw_label_r_benchmark_r: [],
    assetBenchmark_rw_label_r_benchmark_none: [],
    assetBenchmark_rw_label_none_benchmark_rw: [],
    assetBenchmark_rw_label_none_benchmark_r: [],
    assetBenchmark_rw_label_none_benchmark_none: [],
    assetBenchmark_r_label_rw_benchmark_rw: [],
    assetBenchmark_r_label_rw_benchmark_r: [],
    assetBenchmark_r_label_rw_benchmark_none: [],
    assetBenchmark_r_label_r_benchmark_rw: [],
    assetBenchmark_r_label_r_benchmark_r: [],
    assetBenchmark_r_label_r_benchmark_none: [],
    assetBenchmark_r_label_none_benchmark_rw: [],
    assetBenchmark_r_label_none_benchmark_r: [],
    assetBenchmark_r_label_none_benchmark_none: [],
    assetBenchmark_none_label_rw_benchmark_rw: [],
    assetBenchmark_none_label_rw_benchmark_r: [],
    assetBenchmark_none_label_rw_benchmark_none: [],
    assetBenchmark_none_label_r_benchmark_rw: [],
    assetBenchmark_none_label_r_benchmark_r: [],
    assetBenchmark_none_label_r_benchmark_none: [],
    assetBenchmark_none_label_none_benchmark_rw: [],
    assetBenchmark_none_label_none_benchmark_r: [],
    assetBenchmark_none_label_none_benchmark_none: [],
    // piecewise test cases assetBenchmark +/- label +/- benchmark
    assetBenchmark_rw_label_rw_benchmark_rw: [],
    assetBenchmark_rw_label_r_benchmark_none: [],
    assetBenchmark_r_label_none_benchmark_rw: [],
    assetBenchmark_r_label_rw_benchmark_r: [],
    assetBenchmark_none_label_r_benchmark_rw: [],
    assetBenchmark_none_label_rw_benchmark_none: [],
    assetBenchmark_rw_label_none_benchmark_r: [],
    assetBenchmark_r_label_rw_benchmark_rw: [],
    assetBenchmark_none_label_r_benchmark_r: [],

    // triple assetBenchmark +/- label +/- asset
    assetBenchmark_rw_label_rw_asset_rw: [],
    assetBenchmark_rw_label_rw_asset_r: [],
    assetBenchmark_rw_label_rw_asset_none: [],
    assetBenchmark_rw_label_r_asset_rw: [],
    assetBenchmark_rw_label_r_asset_r: [],
    assetBenchmark_rw_label_r_asset_none: [],
    assetBenchmark_rw_label_none_asset_rw: [],
    assetBenchmark_rw_label_none_asset_r: [],
    assetBenchmark_rw_label_none_asset_none: [],
    assetBenchmark_r_label_rw_asset_rw: [],
    assetBenchmark_r_label_rw_asset_r: [],
    assetBenchmark_r_label_rw_asset_none: [],
    assetBenchmark_r_label_r_asset_rw: [],
    assetBenchmark_r_label_r_asset_r: [],
    assetBenchmark_r_label_r_asset_none: [],
    assetBenchmark_r_label_none_asset_rw: [],
    assetBenchmark_r_label_none_asset_r: [],
    assetBenchmark_r_label_none_asset_none: [],
    assetBenchmark_none_label_rw_asset_rw: [],
    assetBenchmark_none_label_rw_asset_r: [],
    assetBenchmark_none_label_rw_asset_none: [],
    assetBenchmark_none_label_r_asset_rw: [],
    assetBenchmark_none_label_r_asset_r: [],
    assetBenchmark_none_label_r_asset_none: [],
    assetBenchmark_none_label_none_asset_rw: [],
    assetBenchmark_none_label_none_asset_r: [],
    assetBenchmark_none_label_none_asset_none: [],
    // piecewise test cases assetBenchmark +/- label +/- asset
    assetBenchmark_rw_label_rw_asset_rw: [],
    assetBenchmark_rw_label_r_asset_none: [],
    assetBenchmark_r_label_none_asset_rw: [],
    assetBenchmark_r_label_rw_asset_r: [],
    assetBenchmark_none_label_r_asset_rw: [],
    assetBenchmark_none_label_rw_asset_none: [],
    assetBenchmark_rw_label_none_asset_r: [],
    assetBenchmark_r_label_rw_asset_rw: [],
    assetBenchmark_none_label_r_asset_r: [],

    // triple assetBenchmark +/- benchmark +/- asset\
    assetBenchmark_rw_benchmark_rw_asset_rw: [],
    assetBenchmark_rw_benchmark_rw_asset_r: [],
    assetBenchmark_rw_benchmark_rw_asset_none: [],
    assetBenchmark_rw_benchmark_r_asset_rw: [],
    assetBenchmark_rw_benchmark_r_asset_r: [],
    assetBenchmark_rw_benchmark_r_asset_none: [],
    assetBenchmark_rw_benchmark_none_asset_rw: [],
    assetBenchmark_rw_benchmark_none_asset_r: [],
    assetBenchmark_rw_benchmark_none_asset_none: [],
    assetBenchmark_r_benchmark_rw_asset_rw: [],
    assetBenchmark_r_benchmark_rw_asset_r: [],
    assetBenchmark_r_benchmark_rw_asset_none: [],
    assetBenchmark_r_benchmark_r_asset_rw: [],
    assetBenchmark_r_benchmark_r_asset_r: [],
    assetBenchmark_r_benchmark_r_asset_none: [],
    assetBenchmark_r_benchmark_none_asset_rw: [],
    assetBenchmark_r_benchmark_none_asset_r: [],
    assetBenchmark_r_benchmark_none_asset_none: [],
    assetBenchmark_none_benchmark_rw_asset_rw: [],
    assetBenchmark_none_benchmark_rw_asset_r: [],
    assetBenchmark_none_benchmark_rw_asset_none: [],
    assetBenchmark_none_benchmark_r_asset_rw: [],
    assetBenchmark_none_benchmark_r_asset_r: [],
    assetBenchmark_none_benchmark_r_asset_none: [],
    assetBenchmark_none_benchmark_none_asset_rw: [],
    assetBenchmark_none_benchmark_none_asset_r: [],
    assetBenchmark_none_benchmark_none_asset_none: [],
     // this is going to be done pairwise so 3^2 = 9 ooposed to 3^3 = 27
    assetBenchmark_rw_benchmark_rw_asset_rw: [],
    assetBenchmark_rw_benchmark_r_asset_none: [],
    assetBenchmark_r_benchmark_none_asset_rw: [],
    assetBenchmark_r_benchmark_rw_asset_r: [],
    assetBenchmark_none_benchmark_r_asset_rw: [],
    assetBenchmark_none_benchmark_rw_asset_none: [],
    assetBenchmark_rw_benchmark_none_asset_r: [],
    assetBenchmark_r_benchmark_rw_asset_rw: [],
    assetBenchmark_none_benchmark_r_asset_r: [],

    // idk if needed anyway
    // quad assetBenchmark +/- label +/- benchmark +/- asset
    assetBenchmark_rw_label_rw_benchmark_rw_asset_rw: [],
    assetBenchmark_rw_label_rw_benchmark_rw_asset_r: [],
    assetBenchmark_rw_label_rw_benchmark_rw_asset_none: [],
    assetBenchmark_rw_label_rw_benchmark_r_asset_rw: [],
    assetBenchmark_rw_label_rw_benchmark_r_asset_r: [],
    assetBenchmark_rw_label_rw_benchmark_r_asset_none: [],
    assetBenchmark_rw_label_rw_benchmark_none_asset_rw: [],
    assetBenchmark_rw_label_rw_benchmark_none_asset_r: [],
    assetBenchmark_rw_label_rw_benchmark_none_asset_none: [],
    assetBenchmark_rw_label_r_benchmark_rw_asset_rw: [],
    assetBenchmark_rw_label_r_benchmark_rw_asset_r: [],
    assetBenchmark_rw_label_r_benchmark_rw_asset_none: [],
    assetBenchmark_rw_label_r_benchmark_r_asset_rw: [],
    assetBenchmark_rw_label_r_benchmark_r_asset_r: [],
    assetBenchmark_rw_label_r_benchmark_r_asset_none: [],
    assetBenchmark_rw_label_r_benchmark_none_asset_rw: [],
    assetBenchmark_rw_label_r_benchmark_none_asset_r: [],
    assetBenchmark_rw_label_r_benchmark_none_asset_none: [],
    assetBenchmark_rw_label_none_benchmark_rw_asset_rw: [],
    assetBenchmark_rw_label_none_benchmark_rw_asset_r: [],
    assetBenchmark_rw_label_none_benchmark_rw_asset_none: [],
    assetBenchmark_rw_label_none_benchmark_r_asset_rw: [],
    assetBenchmark_rw_label_none_benchmark_r_asset_r: [],
    assetBenchmark_rw_label_none_benchmark_r_asset_none: [],
    assetBenchmark_rw_label_none_benchmark_none_asset_rw: [],
    assetBenchmark_rw_label_none_benchmark_none_asset_r: [],
    assetBenchmark_rw_label_none_benchmark_none_asset_none: [],
    assetBenchmark_r_label_rw_benchmark_rw_asset_rw: [],
    assetBenchmark_r_label_rw_benchmark_rw_asset_r: [],
    assetBenchmark_r_label_rw_benchmark_rw_asset_none: [],
    assetBenchmark_r_label_rw_benchmark_r_asset_rw: [],
    assetBenchmark_r_label_rw_benchmark_r_asset_r: [],
    assetBenchmark_r_label_rw_benchmark_r_asset_none: [],
    assetBenchmark_r_label_rw_benchmark_none_asset_rw: [],
    assetBenchmark_r_label_rw_benchmark_none_asset_r: [],
    assetBenchmark_r_label_rw_benchmark_none_asset_none: [],
    assetBenchmark_r_label_r_benchmark_rw_asset_rw: [],
    assetBenchmark_r_label_r_benchmark_rw_asset_r: [],
    assetBenchmark_r_label_r_benchmark_rw_asset_none: [],
    assetBenchmark_r_label_r_benchmark_r_asset_rw: [],
    assetBenchmark_r_label_r_benchmark_r_asset_r: [],
    assetBenchmark_r_label_r_benchmark_r_asset_none: [],
    assetBenchmark_r_label_r_benchmark_none_asset_rw: [],
    assetBenchmark_r_label_r_benchmark_none_asset_r: [],
    assetBenchmark_r_label_r_benchmark_none_asset_none: [],
    assetBenchmark_r_label_none_benchmark_rw_asset_rw: [],
    assetBenchmark_r_label_none_benchmark_rw_asset_r: [],
    assetBenchmark_r_label_none_benchmark_rw_asset_none: [],
    assetBenchmark_r_label_none_benchmark_r_asset_rw: [],
    assetBenchmark_r_label_none_benchmark_r_asset_r: [],
    assetBenchmark_r_label_none_benchmark_r_asset_none: [],
    assetBenchmark_r_label_none_benchmark_none_asset_rw: [],
    assetBenchmark_r_label_none_benchmark_none_asset_r: [],
    assetBenchmark_r_label_none_benchmark_none_asset_none: [],
    assetBenchmark_none_label_rw_benchmark_rw_asset_rw: [],
    assetBenchmark_none_label_rw_benchmark_rw_asset_r: [],
    assetBenchmark_none_label_rw_benchmark_rw_asset_none: [],
    assetBenchmark_none_label_rw_benchmark_r_asset_rw: [],
    assetBenchmark_none_label_rw_benchmark_r_asset_r: [],
    assetBenchmark_none_label_rw_benchmark_r_asset_none: [],
    assetBenchmark_none_label_rw_benchmark_none_asset_rw: [],
    assetBenchmark_none_label_rw_benchmark_none_asset_r: [],
    assetBenchmark_none_label_rw_benchmark_none_asset_none: [],
    assetBenchmark_none_label_r_benchmark_rw_asset_rw: [],
    assetBenchmark_none_label_r_benchmark_rw_asset_r: [],
    assetBenchmark_none_label_r_benchmark_rw_asset_none: [],
    assetBenchmark_none_label_r_benchmark_r_asset_rw: [],
    assetBenchmark_none_label_r_benchmark_r_asset_r: [],
    assetBenchmark_none_label_r_benchmark_r_asset_none: [],
    assetBenchmark_none_label_r_benchmark_none_asset_rw: [],
    assetBenchmark_none_label_r_benchmark_none_asset_r: [],
    assetBenchmark_none_label_r_benchmark_none_asset_none: [],
    assetBenchmark_none_label_none_benchmark_rw_asset_rw: [],
    assetBenchmark_none_label_none_benchmark_rw_asset_r: [],
    assetBenchmark_none_label_none_benchmark_rw_asset_none: [],
    assetBenchmark_none_label_none_benchmark_r_asset_rw: [],
    assetBenchmark_none_label_none_benchmark_r_asset_r: [],
    assetBenchmark_none_label_none_benchmark_r_asset_none: [],
    assetBenchmark_none_label_none_benchmark_none_asset_rw: [],
    assetBenchmark_none_label_none_benchmark_none_asset_r: [],
    assetBenchmark_none_label_none_benchmark_none_asset_none: [],

    // Pairwise test cases assetBenchmark +/- label +/- benchmark +/- asset
    assetBenchmark_rw_label_rw_benchmark_rw_asset_rw: [],
    assetBenchmark_rw_label_r_benchmark_r_asset_none: [],
    assetBenchmark_rw_label_none_benchmark_rw_asset_r: [],
    assetBenchmark_r_label_rw_benchmark_r_asset_rw: [],
    assetBenchmark_r_label_none_benchmark_r_asset_none: [],
    assetBenchmark_r_label_r_benchmark_none_asset_rw: [],
    assetBenchmark_none_label_rw_benchmark_none_asset_r: [],
    assetBenchmark_none_label_r_benchmark_rw_asset_none: [],
    assetBenchmark_none_label_none_benchmark_none_asset_rw: [],


    // conflicting (same asset,label,benchmark different access) i dont think this is needed at this stage but oh well 
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

    // asset - multiple labels
    asset_rw_label_rw_label_r: [{"assetId": "154", "access": "rw"}, {"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"}, {"labelId": "5130dc84-9a68-11ec-b1bc-0242ac110002", "access": "r"}], // whole asset rw, label 1 rw, label 2 r
    asset_rw_label_rw_label_none: [{"assetId": "154", "access": "rw"}, {"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"}, {"labelId": "5130dc84-9a68-11ec-b1bc-0242ac110002", "access": "none"}], // whole asset rw, label 1 rw, minus label 2

    // asset - multiple benchmarks
    asset_rw_benchmark_rw_benchmark_r: [{"assetId": "154", "access": "rw"}, {"benchmarkId":"VPN_SRG_TEST","access":"rw"}, {"benchmarkId": "Windows_10_STIG_TEST", "access": "r"}], // whole asset rw, benchmark 1 rw, benchmark 2 r
    asset_rw_benchmark_rw_benchmark_none: [{"assetId": "154", "access": "rw"}, {"benchmarkId":"VPN_SRG_TEST","access":"rw"}, {"benchmarkId": "Windows_10_STIG_TEST", "access": "none"}], // whole asset rw, benchmark 1 rw, minus benchmark 2

    // label - multiple assetBenchmarks
    label_rw_assetBenchmark_rw_assetBenchmark_r: [], // whole label rw, assetBenchmark 1 rw, assetBenchmark 2 r
    label_rw_assetBenchmark_rw_assetBenchmark_none: [], // whole label rw, assetBenchmark 1 rw, minus assetBenchmark 2

    // asset - multiple assetBenchmarks
    asset_rw_assetBenchmark_rw_assetBenchmark_r: [], // whole asset rw, assetBenchmark 1 rw, assetBenchmark 2 r
    asset_rw_assetBenchmark_rw_assetBenchmark_none: [], // whole asset rw, assetBenchmark 1 rw, minus assetBenchmark 2

    // benchmark - multiple assetBenchmarks
    benchmark_rw_assetBenchmark_rw_assetBenchmark_r: [], // whole benchmark rw, assetBenchmark 1 rw, assetBenchmark 2 r
    benchmark_rw_assetBenchmark_rw_assetBenchmark_none: [], // whole benchmark rw, assetBenchmark 1 rw, minus assetBenchmark 2

    // assetBenchmark - multiple labels
    assetBenchmark_rw_label_rw_label_r: [], // whole assetBenchmark rw, label 1 rw, label 2 r
    assetBenchmark_rw_label_rw_label_none: [], // whole assetBenchmark rw, label 1 rw, minus label 2

    // assetBenchmark - multiple benchmarks
    assetBenchmark_rw_benchmark_rw_benchmark_r: [], // whole assetBenchmark rw, benchmark 1 rw, benchmark 2 r
    assetBenchmark_rw_benchmark_rw_benchmark_none: [], // whole assetBenchmark rw, benchmark 1 rw, minus benchmark 2

    // assetBenchmark - multiple assets
    assetBenchmark_rw_asset_rw_asset_r: [], // whole assetBenchmark rw, asset 1 rw, asset 2 r
    assetBenchmark_rw_asset_rw_asset_none: [], // whole assetBenchmark rw, asset 1 rw, minus asset 2
  }
}

module.exports = requestBodies
