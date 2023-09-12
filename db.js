const Database = require("@tableland/sdk").Database;
const getSigner = require("./web3Helpers").getSigner;

const queryBlogSiteByAddress = async (creatorAddress) => {
    const blogSiteTableName = "blog_site_31337_6";
    const db = new Database({ signer: getSigner() });
    const { results } = await db
        .prepare(`SELECT * FROM ${blogSiteTableName} WHERE creator_address=${creatorAddress}`)
        .all();

    return results.map((result) => ({
        name: result.site_cid,
        owner: result.creator_address,
        siteCid: result.site_cid,
    }));
};

exports.queryBlogSiteByAddress = queryBlogSiteByAddress;
