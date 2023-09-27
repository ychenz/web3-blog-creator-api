const kavach = require("@lighthouse-web3/kavach");
const ethers = require("ethers");

const { getAuthMessage, getJWT } = kavach;

const listenForTxMine = (txResponse, provider) => {
    console.log(`Mining ${txResponse.hash}...`);
    return new Promise((resolve, reject) => {
        // listen for transaction to finish
        provider.once(txResponse.hash, (txReceipt) => {
            txReceipt.confirmations().then((confirmations) => {
                console.log(`Completed with ${confirmations} confirmations`);
                resolve(txReceipt);
            });
        });
    });
};

/**
 * Get signer from contract owner's account
 * @returns {ethers.Wallet} signer
 */
const getSigner = () => {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.NETWORK === "local"
            ? "http://127.0.0.1:8545"
            : "https://api.calibration.node.glif.io/rpc/v1" // UsingFilecoin calibration testnet if not local
    );
    const signer = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);

    return signer;
};

const getOwnerPublicKey = () => {
    const contractOwnerSigningKey = new ethers.utils.SigningKey(process.env.OWNER_PRIVATE_KEY);

    return contractOwnerSigningKey.publicKey;
};

const toWei = (tokenAmount) => {
    return ethers.utils.parseEther(tokenAmount);
};

const getLighthouseJWT = async () => {
    const signer = getSigner();
    // get consensus message
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    const { jwt, error } = await getJWT(signer.address, signedMessage);
    if (error) throw new Error(error);

    return jwt;
};

const getLighthouseSignedMessage = async () => {
    const signer = getSigner();
    // get consensus message
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    return signedMessage;
};

exports.getSigner = getSigner;
exports.getOwnerPublicKey = getOwnerPublicKey;
exports.listenForTxMine = listenForTxMine;
exports.toWei = toWei;
exports.getLighthouseJWT = getLighthouseJWT;
exports.getLighthouseSignedMessage = getLighthouseSignedMessage;
