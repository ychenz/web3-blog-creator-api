const express = require("express");
const lighthouse = require("@lighthouse-web3/sdk");
const fs = require("fs");
const constants = require("./constants");
const web3Helpers = require("./web3Helpers");
const ethers = require("ethers");
const { queryBlogSiteByAddress } = require("./db");

const { blogTablesAbi, blogTablesContractAddress } = constants;
const { getSigner } = web3Helpers;

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

app.get("/api/blogSites", (request, response) => {
    console.log(request.query);

    const { creatorAddress } = request.query;

    queryBlogSiteByAddress(creatorAddress)
        .then((blogSites) => {
            response.status(200).send(blogSites);
        })
        .catch((error) => {
            console.log(error);
            response.status(500).send({ success: "false", error });
        });
});

app.post("/api/createSite", (request, response) => {
    console.log(request.body);
    const { name, themeColor, creatorAddress } = request.body;
    console.log(LIGHTHOUSE_API_KEY);

    // Write site info into a file inside template so that the newly
    //  created blog site from the template can identify itself
    fs.writeFileSync(
        "./blog_template/site_info.json",
        JSON.stringify({ name, themeColor, creatorAddress }),
        { encoding: "utf8", flag: "w" }
    );

    const MockSiteCid = "QmPYY5Kg3aYoXYbNi62KwTxBw6HWe2jVK9z8AnHiZrFj8H";

    // Insert into web3 tableland table
    storeNewBlogSiteToDB({ siteName: name, siteCid: MockSiteCid, creatorAddress })
        .then(() => {
            response.send({ success: "true", siteCid: MockSiteCid, siteName: name });
        })
        .catch((error) => {
            console.log(error);
            response.status(500).send({ success: "false", error });
        });

    // Uploading static website folder to IPFS via Lighthouse
    // lighthouse
    //     .upload("./blog_template", LIGHTHOUSE_API_KEY, true, { network: "calibration" })
    //     .then(({ data }) => {
    //         console.log(data);
    //         const { Hash: hash } = data;

    //         const MockSiteCid = "QmPYY5Kg3aYoXYbNi62KwTxBw6HWe2jVK9z8AnHiZrFj8H";

    //         // Insert into web3 tableland table
    //         storeNewBlogSiteToDB({ creatorAddress, siteCid }).then(() => {
    //             response.send({ success: "true", siteCid: MockSiteCid });
    //         });
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         response.status(500).send({ success: "false", error });
    //     });
});

const storeNewBlogSiteToDB = async ({ siteName, siteCid, creatorAddress }) => {
    const signer = getSigner();
    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    try {
        const transactionResponse = await contract.insertIntoBlogSiteTable(
            siteName,
            siteCid,
            creatorAddress
        );

        // // Listen for the tx to be mined
        await transactionResponse.wait(1);
        console.log("Done inserting!");
    } catch (e) {
        console.log(e);
        throw e;
    }
};
