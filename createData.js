/**
 * to run this tool, start up auth and mysql from an empty volume. (or no data in stigman i guess)
 * start stigmanager 
 * import the stigs in the test.zip file. 
 * configure the const variables below.
 * use a fresh token (i am using a token for the 'admin burke' user. )
 *
 * WARNING: this tool currentntly does not work right for large numbers of assets.
 *  */

const FormData = require('form-data')
const fs = require('fs')

const collectionsToCreate = 5
const assetsToCreate = 50
const usersToCreate = 20

// the amount of rounds this tool will randomly create reviews for each collection
const reviewCycles = 2

// // const stigImportZip = './test/api/form-data-files/test.zip'
// const stigFilePaths = [
//   path.join(
//     __dirname,
//     'test/api/form-data-files/U_MS_Windows_10_STIG_V1R23_Manual-xccdf.xml'
//   ),
//   path.join(
//     __dirname,
//     'test/api/form-data-files/U_RHEL_7_STIG_V3R0-3_Manual-xccdf.xml'
//   ),
//   // "test/api/form-data-files/U_VPN_SRG_V1R0_Manual-xccdf.xml",
//   //"test/api/form-data-files/U_VPN_SRG_V1R1_Manual-xccdf-replace.xml",
//   path.join(
//     __dirname,
//     'test/api/form-data-files/U_VPN_SRG_V1R1_Manual-xccdf.xml'
//   )
//   //"test/api/form-data-files/U_VPN_SRG_V2R3_Manual-xccdf-reviewKeyChange.xml",
//   //"test/api/form-data-files/U_VPN_SRG-OTHER_V1R1_Manual-xccdf.xml",
//   //"test/api/form-data-files/U_VPN_SRG-OTHER_V1R1_twoRules-matchingFingerprints.xml"
// ]

const stigList = [
  "A10_Networks_ADC_ALG_STIG",
  "AAA_Service_SRG",
  "Adobe_Acrobat_Pro_DC_Continuous_STIG",
]

const token =
 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE3MTg2NTI0MTYsImlhdCI6MTcxODYzNDQxNiwianRpIjoiMWVjYWY5NDEtYmVhOC00OWYyLTk4ZGMtOTFmYjQ5MGIyNTE3IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9zdGlnbWFuIiwiYXVkIjoicmVhbG0tbWFuYWdlbWVudCIsInN1YiI6ImJmODdhMTZmLTM5ZTYtNDZkOS04OTcxLWYwZWY1MWRkM2Y4NSIsInR5cCI6IkJlYXJlciIsImF6cCI6InN0aWctbWFuYWdlciIsInNlc3Npb25fc3RhdGUiOiI4ZDc4MmFmZi1jOTNmLTRhNGMtYjA1Zi01NmQzMzUyMTNiNjgiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiY3JlYXRlX2NvbGxlY3Rpb24iLCJhZG1pbiIsInVzZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfX0sInNjb3BlIjoic3RpZy1tYW5hZ2VyIiwic2lkIjoiOGQ3ODJhZmYtYzkzZi00YTRjLWIwNWYtNTZkMzM1MjEzYjY4IiwibmFtZSI6IkFkbWluIEJ1cmtlIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRtaW4iLCJnaXZlbl9uYW1lIjoiQWRtaW4iLCJmYW1pbHlfbmFtZSI6IkJ1cmtlIn0.qWOIDSgxJUjvEW5hhJfQ7jXky1PpdMJ_e9A6G8CfVVzedB1tRQgshPfkZCGxwbyJJxt2eMt4ugkI7V_f8LdWh6K-8DiQ2ub8hRsXeqVFz6AmCmnopevfw-tkSo2nGNyT4rL9t_zCYjj5A_8EiZbUktZmv9F8cGxOsoj9jVGmvWQ'
const baseUrl = 'http://localhost:64001/api'
const createdCollections = []
const createdUsers = []
//const createdAssets = []
const stigInfo = []
const stigRulesMap = new Map()
//const passingReviews = []
//const submittedReviews = []
const restrictedUsers = []

function getRandomString (length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

function getRandomMetadata () {
  return {
    key1: getRandomString(10),
    key2: getRandomString(10),
    key3: getRandomString(10)
  }
}

function getRandomCollectionId () {
  if (createdCollections.length === 0) {
    return null
  }
  const weights = createdCollections.map((_, i) => {
    return Math.exp(-((i / createdCollections.length) ** 2) / 0.5)
  })
  const cumulativeWeights = weights.map(
    (
      sum => value =>
        (sum += value)
    )(0)
  )
  const randomValue =
    Math.random() * cumulativeWeights[cumulativeWeights.length - 1]

  for (let i = 0; i < cumulativeWeights.length; i++) {
    if (randomValue < cumulativeWeights[i]) {
      return createdCollections[i]
    }
  }
}

function getRandomIp () {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 255)).join(
    '.'
  )
}

function getRandomMac () {
  return Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 255)
      .toString(16)
      .padStart(2, '0')
  ).join(':')
}

async function createCollections () {
  for (let i = 0; i < collectionsToCreate; i++) {
    const collection = {
      name: getRandomString(10),
      metadata: getRandomMetadata(),
      description: getRandomString(200),
      grants: [
        {
          accessLevel: 4,
          userId: '1'
        }
      ]
    }

    try {
      const response = await fetch(
        `${baseUrl}/collections?elevate=true&projection=grants`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(collection)
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(`Failed to create collection: ${response.statusText}`)
      }

    
      createdCollections.push(data.collectionId)
      console.log(`Created collection with ID: ${data.collectionId}`)
    } catch (error) {
      console.error('Error creating collection:', error)
    }
  }
}

async function createUsers () {
  for (let i = 0; i < usersToCreate; i++) {
    const accessLevels = [1, 2, 3, 4]
    const user = {
      username: getRandomString(10),
      collectionGrants: [
        {
          collectionId: getRandomCollectionId(),
          accessLevel: accessLevels[Math.floor(Math.random() * accessLevels.length)]
        }
      ]
    }

    try {
      const response = await fetch(`${baseUrl}/users?elevate=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Include the token in the headers
        },
        body: JSON.stringify(user)
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`)
      }

      createdUsers.push(data.userId)
      console.log(`Created user with ID: ${data.userId}`)
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }
}

async function importStigs () {
  for (const file of stigFilePaths) {
   
    const formData = new FormData();
formData.append('file', fs.createReadStream('foo.txt'));
// formData.append('blah', 42);
// fetch('http://httpbin.org/post', {
//     method: 'POST',
//     body: formData
// })
    try {
      const response = await fetch(`${baseUrl}/stigs?clobber=false`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
         // 'Accept': 'application/json',
        },
        body: formData
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(`Failed to import STIG: ${response.statusText}`)
      }

      console.log(`Imported STIG from ${fileName}:`, data)
    } catch (error) {
      console.error(`Error importing STIG from ${fileName}:`, error)
    }
  }
}

async function getAssets(collectionId){
  try{
    const response = await fetch(`${baseUrl}/assets?collectionId=${collectionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(`Failed to get assets: ${response.statusText}`)
    }
    //console.log('Assets:', data)
    return data
  } catch (error) {
    console.error('Error getting assets:', error)
  }

}

async function createAssets () {
  for (let i = 0; i < assetsToCreate; i++) {
    const asset = {
      name: getRandomString(10),
      collectionId: getRandomCollectionId(),
      metadata: getRandomMetadata(),
      description: getRandomString(200),
      ip: getRandomIp(),
      mac: getRandomMac(),
      fqdn: getRandomString(10),
      noncomputing: false,
      stigs: stigList
    }

    try {
      const response = await fetch(`${baseUrl}/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(asset)
      })
      const data = await response.json()
      //createdAssets.push({assetId: data.assetId, collectonId: data.collection.collectionId})
      if (!response.ok) {
        throw new Error(`Failed to create asset: ${response.statusText}`)
      }
      console.log(`Created asset with ID: ${data.assetId}`)
    } catch (error) {
      console.error('Error creating asset:', error)
    }
  }
}

async function getStigInfo () {
  try {
    for(const benchmarkId of stigList){
      const response = await fetch(`${baseUrl}/stigs/${benchmarkId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(`Failed to get stig info: ${response.statusText}`)
      }
      stigInfo.push(data)
    }
  }
  catch (error) {
    console.error('Error getting stig info:', error)
  }
}

async function getStigRules () {
  try {
    for(const stig of stigInfo){
      const revisionStr = stig.lastRevisionStr
      const response = await fetch(`${baseUrl}/stigs/${stig.benchmarkId}/revisions/${revisionStr}/rules`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(`Failed to get stig rules: ${response.statusText}`)
      }
      stigRulesMap.set(stig.benchmarkId, data.map(rule => rule.ruleId))
    }
  }
  catch (error) {
    console.error('Error getting stig rules:', error)
  }
}

async function getRandomAssetIds(collectionId){
  const assets = await getAssets(collectionId)
  const totalItems = assets.length;
  const numItemsToSelect = Math.ceil(totalItems * 0.5);

  // Shuffle the array
  for (let i = totalItems - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [assets[i], assets[j]] = [assets[j], assets[i]];
  }

  // Select the first 30% of the shuffled array
  const assetsSelected = assets.slice(0, numItemsToSelect)
  const assetIdsSelected = assetsSelected.map(asset => asset.assetId)
  return assetIdsSelected
}

function getRandomRuleIds() {
  // Gather all values from the map
  let allValues = [];
  for (let values of stigRulesMap.values()) {
    allValues = allValues.concat(values);
  }

  // Shuffle the allValues array
  for (let i = allValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allValues[i], allValues[j]] = [allValues[j], allValues[i]];
  }

  // Select approximately a % of the ruleIds
  const ruleIds = allValues.slice(0, Math.ceil(allValues.length * 0.60));

  return ruleIds;
}

async function getSubmitable () {
  try{
    let modifiedData = []
    for(const collectionId of createdCollections){
      const assets = await getAssets(collectionId)
      for(const asset of assets){
        
        const response = await fetch(`${baseUrl}/collections/${collectionId}/reviews?rules=default-mapped&status=saved&assetId=${asset.assetId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
    
        if(data.length > 0){
          modifiedData.push(data.map(review => ({
            ...review,
            collectionId: collectionId
          })))
        //  passingReviews.push(...modifiedData)
        }
     
        if (!response.ok) {
          throw new Error(`Failed to get submitable reviews: ${response.statusText}`)
        }
       console.log(`Got submitable reviews for collection ${collectionId}, asset ${asset.assetId}`)
       
      }
    }
    return modifiedData
  }
  catch (error) {
    console.error('Error getting submitable reviews:', error)
  
  }
}

async function getRandomSubmitableReviews(submitableReviews) { 
  try{
    
    // get a random 50% of the accepted reviews
    for (let i = submitableReviews.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [submitableReviews[i], submitableReviews[j]] = [submitableReviews[j], submitableReviews[i]];
    }
    const selectedReviews = submitableReviews.slice(0, Math.ceil(submitableReviews.length * .70));

    return selectedReviews;
  }
  catch (error) {
    console.error('Error getting random accepted reviews:', error)
  }

}

async function getSubmittedReviews () {
  try{
    let modifiedData = []
    for(const collectionId of createdCollections){
    //  console.log("looping over", collectionId)      
  //    for(const assetId of createdAssets){
        const response = await fetch(`${baseUrl}/collections/${collectionId}/reviews?rules=default-mapped&result=pass&status=submitted`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        
        const data = await response.json()
        
        if(data.length > 0){
          modifiedData.push(data.map(review => ({
            ...review,
            collectionId: collectionId
          })))
         // submittedReviews.push(...modifiedData)
        }
        if (!response.ok) {
          throw new Error(`Failed to get submitted reviews: ${response.statusText}`)
        }
        if(modifiedData){
        console.log(`Got submotted reviews for collection ${collectionId}`)
        }
        else{
          console.log('No submitted reviews')
        }
      
      //}
    }
    return modifiedData
  }
  catch (error) {
    console.error('Error getting accepted reviews:', error)
  }
}


async function getRandomSubmittedReviews(submittedReviews) { 
  try{
    
    // get a random 50% of the submitted reviews
    for (let i = submittedReviews.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [submittedReviews[i], submittedReviews[j]] = [submittedReviews[j], submittedReviews[i]];
    }
    const selectedReviews = submittedReviews.slice(0, Math.ceil(submittedReviews.length * 0.30));

    return selectedReviews;
  }
  catch (error) {
    console.error('Error getting random submited reviews:', error)
  }

}

async function acceptReviews(){
  try{
    const submittedReviews =  await getSubmittedReviews()
    // get a random % of the accepted reviews
    const flatSubmittedReviews = submittedReviews.flat()
    const randomAcceptedReviews = await getRandomSubmittedReviews(flatSubmittedReviews)
    const reviewStatus = {
      status: 'accepted'
    }
    for(const review of randomAcceptedReviews){
      const response = await fetch(`${baseUrl}/collections/${review.collectionId}/reviews/${review.assetId}/${review.ruleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reviewStatus)
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(`Failed to accept review: ${response.statusText}`)
      }
      console.log(`Accepted review for collection ${review.collectionId}, asset ${review.assetId}, rule ${review.ruleId}`)
    } 
  }
  catch (error) {
    console.error('Error accepting review:', error)
  }

}

async function submitReviews () {
  try{
    const submitableReviews = await getSubmitable()
    // make submitableReviews flat
    const flatSubmitableReviews = submitableReviews.flat()
    const selectedSubmitable = await getRandomSubmitableReviews(flatSubmitableReviews)
    const reviewStatus = {
      status: 'submitted'
    }
    for(const review of selectedSubmitable){
      if(review.result === 'pass' || review.result === 'notapplicable'){
        const response = await fetch(`${baseUrl}/collections/${review.collectionId}/reviews/${review.assetId}/${review.ruleId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(reviewStatus)
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(`Failed to submit review: ${response.statusText}`)
        }
        console.log(`submitted review for collection ${review.collectionId}, asset ${review.assetId}, rule ${review.ruleId}`)
      }
    } 
  }
  catch (error) {
    console.error('Error accepting review:', error)
  }
}

function getRandomResult () {
 
  const skewedArray = [
    "pass", "pass", "pass", "pass",
    "fail", "fail",
    "notapplicable", "notapplicable",
    "informational", "informational",
    "notchecked", "notchecked",
  ];

  const result = skewedArray[Math.floor(Math.random() * skewedArray.length)];
  return result;
 
}

async function createReviewsWithHistory () {
  for (let i = 0; i < reviewCycles; i++){
    for (const collectionId of createdCollections) {
      // const result = resultArray[Math.floor(Math.random() * resultArray.length)]
      const result = getRandomResult();
      const ruleIds  = getRandomRuleIds();
      const review = {
        source: {
          review: {
            result: result,
            detail: getRandomString(200)
          }
        },
        assets: {
          assetIds: await getRandomAssetIds(collectionId)
        },
        rules: {
          ruleIds: ruleIds
        }
        // assets:{
        //   benchmarkIds: stigList
        // },
        // rules:{
        //   benchmarkIds: stigList
  
        // }
      }
      try {
        const response = await fetch(`${baseUrl}/collections/${collectionId}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(review)
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(`Failed to create review: ${response.statusText}`)
        }
      console.log(`Created review for collection ${collectionId}, result: ${result}`)
      } catch (error) {
        console.error('Error creating review:', error)
      }
    }
  }
}

async function getRestrictedUsers () {

  try {
    const response = await fetch(`${baseUrl}/users?elevate=true&projection=collectionGrants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.json()

    // for(const user in data){
    //   for(const collectionGrant in user.collectionGrants){
    //     if(collectionGrant.accessLevel === 1){
    //       restrictedUsers.push({
    //         userId: user.userId,
    //         collectionId: collectionGrant.collection.collectionId
    //       })
    //     }
    //   }
    // }
    data.map(user => {
      user.collectionGrants.map(collectionGrant => {
        if(collectionGrant.accessLevel === 1){
          restrictedUsers.push({
            userId: user.userId,
            collectionId: collectionGrant.collection.collectionId
          })
        }
      }
      )
    })
    if (!response.ok) {
      throw new Error(`Failed to get restricted users: ${response.statusText}`)
    }
    console.log('Got Restricted users:')
  } catch (error) {
    console.error('Error getting restricted users:', error)
  }
}

async function getMappedStigs (collectionId) {
  try {
    const response = await fetch(`${baseUrl}/collections/${collectionId}/stigs?projection=assets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(`Failed to get mapped stigs: ${response.statusText}`)
    }
  // got mapped stig with asssets
    return data
  } catch (error) {
    console.error('Error getting mapped stigs:', error)
  }

}

async function assignRestrictedUsers () {

  restrictedUsers.map(async user => {
    const mappedStigsAndAssets = await getMappedStigs(user.collectionId)
    const assetStig = []
    mappedStigsAndAssets.map(stig => {  
      stig.assets.map(asset => {
        assetStig.push({
          assetId: asset.assetId,
          benchmarkId: stig.benchmarkId
        })
      })
    }
    )
    // select random 20% of the assets with slice 
    const selectedAssets = assetStig.slice(0, Math.ceil(assetStig.length * 0.20))

    try {
      const response = await fetch(`${baseUrl}/collections/${user.collectionId}/grants/${user.userId}/access`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(selectedAssets)
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(`Failed to assign restricted user: ${response.statusText}`)
      }
      console.log(`Assigned restricted user: ${user.userId} to collection: ${user.collectionId}, with some asset Sigs`)
    } catch (error) {
      console.error('Error assigning restricted user:', error)
    }
  })
}

async function createData () {
  await getStigInfo()
  await getStigRules()
  await createCollections()
  await createAssets()
  await createReviewsWithHistory()
  await submitReviews()
  await acceptReviews()
  await createUsers()
  await getRestrictedUsers()
  await assignRestrictedUsers()
}

createData()
