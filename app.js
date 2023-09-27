const express = require("express");
const lighthouse = require("@lighthouse-web3/sdk");
const fs = require("fs");
const web3Helpers = require("./web3Helpers");
const db = require("./db");
const ethers = require("ethers");
const { assert } = require("console");

const { getLighthouseSignedMessage, getOwnerPublicKey } = web3Helpers;

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const PORT = process.env.PORT || 3001;
const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

/** blogAPIs */
app.get("/api/blogs", (request, response) => {
    const { creatorSiteId } = request.query;
    console.log("=== GET /api/blogs ===");
    console.log(request.query);

    db.queryBlogsBySite(creatorSiteId)
        .then((tiers) => {
            response.status(200).send(tiers);
        })
        .catch((error) => {
            console.log(error);
            response.status(500).send({ success: "false", error });
        });
});

app.post("/api/blog", (request, response) => {
    const { creatorAddress, creatorSiteId, creatorMembershipTierId, blogName, blogContent } =
        request.body;
    console.log("=== POST /api/blog ===");
    console.log(request.body);
    const ownerAddress = process.env.OWNER_ADDRESS;

    // Callbacks

    /**
     * Callback function after uploading blog to Lighthouse
     * @param {*} lighthouseRes
     * @param {*} jwt - jwt is only passed when the new blog is encrypted (When creatorMembershipTierId exists)
     */
    const onUploadedCallback = (lighthouseRes) => {
        console.log(
            `============ Uploaded ${
                creatorMembershipTierId ? "Encrypted" : ""
            } blog to Lighthouse! ============`
        );
        console.log(lighthouseRes);
        console.log("================================================");

        const blogCid = lighthouseRes.data.Hash;

        if (creatorMembershipTierId) {
            getLighthouseSignedMessage().then((signedMessage) => {
                lighthouse
                    .shareFile(ownerAddress, [creatorAddress], blogCid, signedMessage)
                    .then((res) => {
                        console.log("Uploaded blog and shared with creator:", creatorAddress);
                    })
                    .catch((error) => {
                        console.log(
                            "Uploaded blog but failed to share it with creator:",
                            creatorAddress
                        );
                    });
            });
        }

        // Insert into web3 tableland table
        db.insertNewBlogToDB({
            blogCid,
            blogName,
            creatorAddress,
            creatorSiteId,
            creatorMembershipTierId: creatorMembershipTierId || null,
        }).then(() => {
            response.send({
                success: "true",
                data: {
                    blogCid,
                    blogName,
                    creatorAddress,
                    creatorSiteId,
                    creatorMemberShipTierId: creatorMembershipTierId,
                },
            });
        });
    };

    const onErrorCallback = (error) => {
        console.log(error);
        response.status(500).send({ success: "false", error });
    };

    // Uploading logics
    // if (false) {
    if (creatorMembershipTierId) {
        // getLighthouseSignedMessage()
        //     .then((signedMessage) => {
        //         console.log("**** Uploading encrypted blog to Lighthouse ...");
        //         console.log("ownerAddress (Public Key):", ownerAddress);
        //         console.log("signedMessage:", signedMessage);

        //         lighthouse
        //             .textUploadEncrypted(
        //                 blogContent,
        //                 LIGHTHOUSE_API_KEY,
        //                 ownerAddress,
        //                 signedMessage,
        //                 // Use .md filename in the future, .txt for now for simplicity
        //                 `${blogName}.txt`
        //             )
        //             .then(onUploadedCallback)
        //             .catch(onErrorCallback);
        //     })
        //     .catch(onErrorCallback);

        //Mock paid blog
        let blogCid = "QmWTipWQtDwwZ2VTSpDTLuiwEemnnS3H3AhGbHcHYeqBCu";
        db.insertNewBlogToDB({
            blogCid,
            blogName,
            creatorAddress,
            creatorSiteId,
            creatorMembershipTierId: creatorMembershipTierId || null,
        }).then(() => {
            response.send({
                success: "true",
                data: {
                    blogCid,
                    blogName,
                    creatorAddress,
                    creatorSiteId,
                    creatorMembershipTierId: creatorMembershipTierId,
                },
            });
        });
    } else {
        console.log("**** Uploading free blog to Lighthouse ...");
        console.log(blogContent, LIGHTHOUSE_API_KEY, blogName);
        // lighthouse
        //     .uploadText(blogContent, LIGHTHOUSE_API_KEY, blogName)
        //     .then(onUploadedCallback)
        //     .catch(onErrorCallback);

        //Mock free blog
        let blogCid = "Qmd5CCwgjy4jCWntmuB3iaLJHoUDJqW8qjSKTAqHPY1E3h";
        db.insertNewBlogToDB({
            blogCid,
            blogName,
            creatorAddress,
            creatorSiteId,
            creatorMembershipTierId: creatorMembershipTierId || null,
        }).then(() => {
            response.send({
                success: "true",
                data: {
                    blogCid,
                    blogName,
                    creatorAddress,
                    creatorSiteId,
                    creatorMembershipTierId: creatorMembershipTierId,
                },
            });
        });
    }
});

/** Membership tier APIs */
app.get("/api/membershipTiers", (request, response) => {
    const { creatorSiteId } = request.query;

    db.queryMemberShipTiersBySite(creatorSiteId)
        .then((tiers) => {
            response.status(200).send(tiers);
        })
        .catch((error) => {
            console.log(error);
            response.status(500).send({ success: "false", error });
        });
});

app.post("/api/membershipTier", (request, response) => {
    console.log("=== POST /api/membershipTier ===");
    console.log(request.body);
    const { tierName, tierDescription, tierMonthlyPrice, creatorSiteId, creatorAddress } =
        request.body;
    const tierMonthlyPriceWei = web3Helpers.toWei(tierMonthlyPrice);

    db.insertMemberShipTier({
        tierName,
        tierDescription,
        tierMonthlyPrice: tierMonthlyPriceWei,
        creatorSiteId,
        creatorAddress,
    }).then(() => {
        response.send({ success: "true", tierName, tierDescription, tierMonthlyPrice });
    });
});

/** Creator site APIs */
app.get("/api/blogSites", (request, response) => {
    const { creatorAddress } = request.query;

    db.queryBlogSiteByAddress(creatorAddress)
        .then((blogSites) => {
            console.log(blogSites);
            response.status(200).send(blogSites);
        })
        .catch((error) => {
            console.log(error);
            response.status(500).send({ success: "false", error });
        });
});

app.post("/api/createSite", (request, response) => {
    console.log("=== POST /api/createSite ===");
    const { name, themeColor, creatorAddress } = request.body;

    // Write site info into a file inside template so that the newly
    //  created blog site from the template can identify itself
    fs.writeFileSync(
        "./blog_template/site_info.json",
        JSON.stringify({ name, themeColor, creatorAddress }),
        { encoding: "utf8", flag: "w" }
    );

    // TODO: Remove this
    // const mockSiteCid = "QmcHUSx8285V4ZXwXX75SN5CqhaDkdFaP7RbkU4A4tqjeZ";
    // Filecoin Calibration testnet mock site cid
    // const mockSiteCid = "QmUiAfDWpKfaJw3bxJFzKG86kPBdt3NaSMPJp29qtEMPDX";

    // // Insert into web3 tableland table with mock site
    // db.insertNewBlogSiteToDB({ siteName: name, siteCid: mockSiteCid, creatorAddress })
    //     .then(() => {
    //         response.send({ success: "true", siteCid: mockSiteCid, siteName: name });
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         response.status(500).send({ success: "false", error });
    //     });

    // Uploading static website folder to IPFS via Lighthouse
    // *Must use deal params to upload to Filecoin network
    const dealParams = {
        num_copies: 2,
        repair_threshold: 28800,
        renew_threshold: 240,
        miner: ["t017840"],
        network: "calibration",
        add_mock_data: 2,
    };

    // Blog replication
    lighthouse
        .upload("./blog_template", LIGHTHOUSE_API_KEY, false, dealParams)
        .then((res) => {
            console.log("============ Uploaded to Lighthouse! ============");
            console.log(res);
            console.log("================================================");

            const siteCid = res.data.Hash;

            // Insert into web3 tableland table
            db.insertNewBlogSiteToDB({
                siteName: name,
                creatorAddress,
                siteCid,
            }).then(() => {
                response.send({ success: "true", siteCid, siteName: name });
            });
        })
        .catch((error) => {
            console.log(error);
            response.status(500).send({ success: "false", error });
        });
});

app.post("/api/unlockBlog", (request, response) => {
    console.log("=== POST /api/unlockBlog ===");
    console.log(request.body);
    const { userAddress, blogCid } = request.body;

    const unlockBlog = async () => {
        // 1. Query post table and get it's required membership tier
        /** @type Blog|null */
        const blog = await db.queryBlogByCid(blogCid);
        assert(blog, `blog ${blogCid} not found`);

        const requireTierId = blog.creatorMembershipTierId;

        // 2. Query user subs table if user has an active subscription
        const userSubs = await db.queryUserSubsByUserAddress(userAddress);
        const requiredSub = userSubs.find((sub) => sub.tierId === requireTierId);

        // Check if the current timestamp (in seconds) is more than 1 month than the sub's activate timestamp, if so, the sub is not active
        const isRequiredSubActive = requiredSub
            ? Date.now() / 1000 - requiredSub.activateTimestamp <= 30 * 24 * 60 * 60
            : false;

        assert(
            requiredSub && isRequiredSubActive,
            `user ${userAddress} does not have an active subscription for blog ${blogCid}}`
        );

        // 3. If user has an active subscription and it's the required tier, share the blog to the userAddress using Lighthouse
        try {
            const lightHouseSignedMessage = await getLighthouseSignedMessage();
            const ownerAddress = process.env.OWNER_ADDRESS;
            const shareFileResult = await lighthouse.shareFile(
                ownerAddress,
                [userAddress],
                blogCid,
                lightHouseSignedMessage
            );

            console.log("==== Successfully shared blog shared with user:", userAddress);
            console.log(shareFileResult);
        } catch (error) {
            throw new Error(error);
        }
    };

    unlockBlog()
        .then(() => response.send({ success: "true", blogCid: blogCid }))
        .catch((error) => {
            console.log(error);
            response.status(500).send({ success: "false", error });
        });
});
