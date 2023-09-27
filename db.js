const Database = require("@tableland/sdk").Database;
const getSigner = require("./web3Helpers").getSigner;
const ethers = require("ethers");
const constants = require("./constants");

const { blogTablesAbi, blogTablesContractAddress } = constants;

// Manage Blog Posts
const queryBlogsBySite = async (creatorSiteId) => {
    // Getting table name
    const signer = getSigner();
    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    const creatorBlogTableName = await contract.CreatorBlogTableName();

    // Query the CreatorSite Table
    const db = new Database({ signer });
    const { results } = await db
        .prepare(`SELECT * FROM ${creatorBlogTableName} WHERE creator_site_id='${creatorSiteId}'`)
        .all();

    return results.map((result) => ({
        id: result.id,
        blogCid: result.blog_cid,
        blogName: result.blog_name,
        creatorAddress: result.creator_address,
        creatorSiteId: result.creator_site_id,
        creatorMembershipTierId: result.creator_membership_tier_id,
    }));
};

const queryBlogByCid = async (blogCid) => {
    // Getting table name
    const signer = getSigner();
    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    const creatorBlogTableName = await contract.CreatorBlogTableName();

    // Query the CreatorSite Table
    const db = new Database({ signer });
    const { results } = await db
        .prepare(`SELECT * FROM ${creatorBlogTableName} WHERE blog_cid='${blogCid}'`)
        .all();

    if (results.length === 0) {
        return null;
    } else {
        const blog = results[0];

        return {
            id: blog.id,
            blogCid: blog.blog_cid,
            blogName: blog.blog_name,
            creatorAddress: blog.creator_address,
            creatorSiteId: blog.creator_site_id,
            creatorMembershipTierId: blog.creator_membership_tier_id,
        };
    }
};

const insertNewBlogToDB = async ({
    blogCid,
    blogName,
    creatorAddress,
    creatorSiteId,
    creatorMembershipTierId,
}) => {
    const signer = getSigner();
    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    try {
        let transactionResponse;

        if (!creatorMembershipTierId) {
            transactionResponse = await contract.insertFreeBlogIntoCreatorBlogTable(
                blogCid,
                blogName,
                creatorAddress,
                creatorSiteId
            );
        } else {
            transactionResponse = await contract.insertIntoCreatorBlogTable(
                blogCid,
                blogName,
                creatorAddress,
                creatorSiteId,
                creatorMembershipTierId
            );
        }

        // // Listen for the tx to be mined
        await transactionResponse.wait(1);
        console.log("Done inserting New Blog!");
    } catch (e) {
        console.log(e);
        throw e;
    }
};

// Manage Blog Sites
const queryBlogSiteByAddress = async (creatorAddress) => {
    // Getting table name
    const signer = getSigner();
    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    const creatorSiteTableName = await contract.CreatorSiteTableName();

    // Query the CreatorSite Table
    const db = new Database({ signer });
    const { results } = await db
        .prepare(`SELECT * FROM ${creatorSiteTableName} WHERE creator_address='${creatorAddress}'`)
        .all();

    return results.map((result) => ({
        id: result.id,
        name: result.site_name,
        owner: result.creator_address,
        siteCid: result.site_cid,
    }));
};

const insertNewBlogSiteToDB = async ({ siteName, siteCid, creatorAddress }) => {
    const signer = getSigner();
    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    try {
        const transactionResponse = await contract.insertIntoCreatorSiteTable(
            siteName,
            siteCid,
            creatorAddress
        );

        // // Listen for the tx to be mined
        await transactionResponse.wait(1);
        console.log("Done inserting New Site!");
    } catch (e) {
        console.log(e);
        throw e;
    }
};

// Manage Membership Tiers
const queryMemberShipTiersBySite = async (creatorSiteId) => {
    // Getting table name
    const signer = getSigner();
    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    const creatorMembershipTiersTableName = await contract.CreatorMembershipTiersTableName();

    // Query the CreatorSite Table
    const db = new Database({ signer });
    const { results } = await db
        .prepare(
            `SELECT * FROM ${creatorMembershipTiersTableName} WHERE creator_site_id='${creatorSiteId}'`
        )
        .all();

    return results.map((result) => ({
        id: result.id,
        creatorAddress: result.creator_address,
        creatorSiteId: result.creator_site_id,
        tierName: result.tier_name,
        tierDescription: result.tier_description,
        tierMonthlyPrice: result.tier_monthly_price / 1e18,
    }));
};

const insertMemberShipTier = async ({
    creatorSiteId,
    creatorAddress,
    tierName,
    tierDescription,
    tierMonthlyPrice,
}) => {
    const signer = getSigner();
    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    try {
        let transactionResponse = await contract.insertIntoCreatorMembershipTiersTable(
            creatorSiteId,
            creatorAddress,
            tierName,
            tierDescription,
            tierMonthlyPrice // Price in WEI
        );

        // Listen for the tx to be mined
        await transactionResponse.wait(3); // This takes a long time to mine

        // Getting the new tierId
        const db = new Database({ signer });
        const creatorMembershipTiersTableName = await contract.CreatorMembershipTiersTableName();
        // Note tier_name need to be unique
        const { results: newTier } = await db
            .prepare(
                `SELECT * FROM ${creatorMembershipTiersTableName} WHERE creator_site_id=${creatorSiteId} and tier_name='${tierName}'`
            )
            .all();

        console.log("Inserted new tier");
        console.log(newTier);
        const newTierId = newTier[0].id;

        // Register the new membership tier with the contract
        transactionResponse = await contract.registerMembershipTier(
            newTierId,
            tierMonthlyPrice, // Price in WEI
            creatorAddress
        );
        await transactionResponse.wait(1);
        console.log("Done inserting New Membership tier!");
    } catch (e) {
        console.log(e);
        throw e;
    }
};

// Manage the UserSiteSubscriptions Table
const queryUserSubsByUserAddress = async (userAddress) => {
    // Getting table name
    const signer = getSigner();
    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    const userSiteSubscriptionsTableName = await contract.UserSiteSubscriptionsTableName();

    // Query the CreatorSite Table
    const db = new Database({ signer });
    const { results } = await db
        .prepare(
            `SELECT * FROM ${userSiteSubscriptionsTableName} WHERE user_address='${userAddress}'`
        )
        .all();

    return results.map((result) => ({
        id: result.id,
        creatorMembershipTierId: result.creator_membership_tier_id,
        subscriptionActivationTimestamp: result.subscription_activation_timestamp,
    }));
};

exports.queryBlogsBySite = queryBlogsBySite;
exports.queryBlogByCid = queryBlogByCid;
exports.insertNewBlogToDB = insertNewBlogToDB;
exports.queryBlogSiteByAddress = queryBlogSiteByAddress;
exports.insertNewBlogSiteToDB = insertNewBlogSiteToDB;
exports.queryMemberShipTiersBySite = queryMemberShipTiersBySite;
exports.insertMemberShipTier = insertMemberShipTier;
exports.queryUserSubsByUserAddress = queryUserSubsByUserAddress;
