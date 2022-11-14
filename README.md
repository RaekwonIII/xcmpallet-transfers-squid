# XCM to BigQuery squid 

A sample [Squid](https://subsquid.io) project to demonstrate how to store the ETL results to a Google BigQuery dataset.
The deployed public dataset is available in BigQuery console by ID `bright-meridian-316511.xcm_transfers`. 
This squid collects all the relevant `XCMPallet` calls to track the XCM transfers on Kusama. For a full reference see the [docs](https://docs.subsquid.io)


## Prerequisites

* node 16.x
* docker
* npm -- note that `yarn` package manager is not supported
* Google BigQuery account

## BigQuery setup

- Create a [service account](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) to access BigQuery
- Generate a private key file and make sure the env variable `GOOGLE_APPLICATION_CREDENTIALS` points to its location
- Create a BigQuery project and a dataset named `xcm_transfers`
- Create a table called `kusama_transfers` with the schema matching the table `bright-meridian-316511.xcm_transfers.kusama_transfers`:
```sql
CREATE TABLE 
xcm_transfers.kusama_transfers
LIKE bright-meridian-316511.xcm_transfers.kusama_transfers
```

## Quickly running the sample

Example commands below use [make(1)](https://www.gnu.org/software/make/).
Please, have a look at commands in [Makefile](Makefile) if your platform doesn't support it.
On Windows we recommend to use [WSL](https://docs.microsoft.com/en-us/windows/wsl/).

```bash
# 1. Install dependencies
npm ci

# 2. Compile typescript files
make build

# 3. Start target Postgres database and detach
make up

# 4. Start the processor
make process

# 5. The command above will block the terminal
#    being busy with fetching the chain data, 
#    transforming and storing it in the target database.
#
#    To start the graphql server open the separate terminal
#    and run
make serve
```


## Deploy the Squid

After a local run, obtain a deployment key by logging in to [Aquarium](https://app.subsquid.io/start) and run 

```sh
npx sqd auth -k YOUR_DEPLOYMENT_KEY
```

Next, inspect the Squid CLI help to deploy and manage your squid:

```sh
npx sqd squid --help
```

Next, setup [secrets](https://docs.subsquid.io/deploy-squid/env-variables/#secrets) for the following variables (with the values from the Google private key file):
- `GOOGLE_PROJECT_ID`
- `GOOGLE_PRIVATE_KEY_ID`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_X509_CERT_URL`

For more information, consult the [Deployment Guide](https://docs.subsquid.io/docs/deploy-squid/).

