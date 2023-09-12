const ethers = require("ethers");

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

const getSigner = () => {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);

    return signer;
};

exports.getSigner = getSigner;
exports.listenForTxMine = listenForTxMine;
