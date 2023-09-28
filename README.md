# web3-blog-creator-api

## Project Design

![image](https://github.com/ychenz/web3-blog-creator-api/assets/10768904/1174a0bd-b4e5-4e35-9197-5485fbd16a4a)

This component work closely with the other 3 components shown in the above architecture:

- [The smart contract](https://github.com/ychenz/web3-blog-creator-tables-contract)
- [Blog template (creator created blog site)](https://github.com/ychenz/web3-fvm-blog-template)
- [Web3 blog creator](https://github.com/ychenz/web3-blog-creator)

For the project to work you will need to set them up in the following order:

1. The smart contract
2. Blog template (creator created blog site)
3. (Current repo) Web3 blog creator API
4. Web3 blog creator

## Local Development

1. Install dependencies by running `yarn`
2. Create `.env` file following the `.env.example`. Note that if the `NETWORK` env variable is set to `local`, it makes the ethers js to use local hardhat node's RPC url. It will use the Filecoin Calibration RPC url if this is set to any other value. Please refer to [web3Helpers.js](https://github.com/ychenz/web3-blog-creator-api/blob/main/web3Helpers.js) file's `getSigner` function for implementation details.
3. You hsould have copied the `build` folder when sestting up the [Blog template](https://github.com/ychenz/web3-fvm-blog-template), paste this folder under the root like the following:
   ![image](https://github.com/ychenz/web3-blog-creator-api/assets/10768904/5a057531-aefd-4959-bd3f-57ffc44688e8)

4. Running `yarn start` to start the express js server.

### Important code files

- app.js - Contains all endpoints and Lighthouse upload & file sharing logics. Interesting endpoints: `app.post("/api/createSite"...)`, `app.post("/api/blog"...)`, `app.post("/api/unlockBlog"...)`
- db.js - Contains all Tableland queries. Interesting function: `insertMemberShipTier`, it needed to register the membership tier id and price to the smart contract, since Tableland doesn't support on-chain query yet. This is to make sure that the smart contract know about the membership price to charge when user subscribes with the only the tier id (we can't entrust the user to pass the right price for us).

## TODO

Create daily run job to check for any expired subscription, revoke the Lighthouse file sharing and remove the record from the UserSiteSubscriptions table.


