# XCM squid 

A sample [Squid](https://subsquid.io) project to demonstrate how to store the ETL results in a local CSV file. 
This squid collects all the relevant `XCMPallet` calls to track the XCM transfers on Kusama. For a full reference see the [docs](https://docs.subsquid.io)


## Prerequisites

* node 16.x
* docker
* npm -- note that `yarn` package manager is not supported

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
```

The squid output CSV file is located at `assets/xcm_transfers.csv`. To restart the indexing from scratch, delete the file and drop the database with

```sh
make down
```
