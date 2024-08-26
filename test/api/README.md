# API testing
This project contains a set of Mocha and Chai tests for stig-manager.

## Runtime environment
### Authentication Server
Run ***ONE*** of the following:
- A container instance of [our demo Keycloak image](https://hub.docker.com/r/nuwcdivnpt/stig-manager-auth) 
   > Example with docker
    ```
   docker run --name stig-manager-auth -p 8080:8080 nuwcdivnpt/stig-manager-auth
   ```
  

- An HTTP server on port 8080 that accepts requests for the content in `./mock-keycloak`

   > Example with Python3:

   ```
   cd mock-keycloak && python3 -m http.server 8080 &
   ```

### Database
- Run an instance of [the official MySQL image](https://hub.docker.com/_/mysql)

   > Example with docker
    ```
   docker run --name stig-manager-db \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpw \
  -e MYSQL_DATABASE=stigman \
  -e MYSQL_USER=stigman \
  -e MYSQL_PASSWORD=stigman \
  mysql:8
   ```

### API
- Run the API so it answering requests at `localhost:64001/api`, and can communicate with the Authentication Server and database.
- The API can be run in a dev environment such as Visual Studio Code or in a container

   > Example with docker
   ```
  docker run --name stig-manager-api \
  -p 64001:54000 \
  nuwcdivnpt/stig-manager
   ```



## Installation

To install the dependencies required to run the test suite, run:

```
npm install
```

Ensure that you set uphave the necessary configuration files:
```test/api/mocha/testConfig.json```


## Usage

To run the tests for local developmeent, use the following bash script:

```test/api/runMocha.sh``` (use -h flag for help)


The test suite uses Mocha as the test runner and Chai-http to call endpoints and Chai for assertions. 

## How to Write Tests

The test suite relies on several conventions:

- ```test/api/mocha``` is the root for all testing files 
- ```test/api/mocha/data``` are tests that check for the vailidty of our endpoints in a basic form. They simply call endpoints to ensure correctness of data.
- Each directory in the ```test/api/mocha/data``` is organized by api tag.
- Test files MOSTLY follow the naming convention of, ```<apiTag><HTTPrequestMethod>.test.js``` example: ```assetPatch.test.js```
- ```/test/api/mocha/data/crossBoundary``` tests for lvl1 cross boundary
- ```/test/api/mocha/integration```are our integration tests (here describe what an integration test is) in our definiton it is a set of related endpoints called together to test major app functionalities. where the data tests are more unit type tests but for one specific api call.
- all tests willl rely on their respective 'referenceData.js' and 'expectations.js' to look for our test 'answers' these answers are the data coming back from the api is going to be expected against for correctness. 
- referencedata.js is mostly static or more global data about the tests or api paths
- expectations.js contains data  specific to the current iterations (in our case we use users in different iterations) this file will also control if a test is going to be run for a specific iteration
- iterations.js and iterations in genrerarl are a list of iterations that a test or group of tests willb e called. (see code exmaples attached for our major for loop that does iterations)

#### Test Naming conventions

- top level describes: describe('<httpmethod> - <tag>', function () { example describe('DELETE - Asset', function () {
- describe within an iteration (used by our runMocha.sh to run for a specific iteration) describe(`iteration:${iteration.name}`, function () {
- endpoint level describe describe(`<operationId - path/path/path, function () {exmaple describe(`deleteAssetMetadataKey - /assets/{assetId}/metadata/keys/{key}`, function () {

Make sure these files are correctly set up before running the tests.

## Test Policy

- All PRs to the project repo must pass all API tests before they will be accepted.
- All PRs to the project repo should include new or updated API tests that cover the changes made by the PR to the API.

## Test Coverage

- The API tests cover all endpoints of the API, and all HTTP methods supported by the API.
- The PR Workflow running the tests will also generate a coverage report showing how much of the API code is covered by the tests.


****
