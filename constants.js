// const blogTablesContractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const blogTablesContractAddress = "0xC6c5Ab5039373b0CBa7d0116d9ba7fb9831C3f42"; // filecoin cali testnet contract address

const blogTablesAbi = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "BlogCreator__SendMoreToSubscribe",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "chainid",
                type: "uint256",
            },
        ],
        name: "ChainNotSupported",
        type: "error",
    },
    {
        inputs: [],
        name: "CreatorBlogTableName",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "CreatorMembershipTiersTableName",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "CreatorSiteTableName",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "UserSiteSubscriptionsTableName",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint32",
                name: "",
                type: "uint32",
            },
        ],
        name: "creatorMembershipTierIdToTierMonthlyPrice",
        outputs: [
            {
                internalType: "uint256",
                name: "monthlyPrice",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "creatorAddress",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint32",
                name: "tierId",
                type: "uint32",
            },
        ],
        name: "getMembershipTierInfor",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "getPolicy",
        outputs: [
            {
                components: [
                    {
                        internalType: "bool",
                        name: "allowInsert",
                        type: "bool",
                    },
                    {
                        internalType: "bool",
                        name: "allowUpdate",
                        type: "bool",
                    },
                    {
                        internalType: "bool",
                        name: "allowDelete",
                        type: "bool",
                    },
                    {
                        internalType: "string",
                        name: "whereClause",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "withCheck",
                        type: "string",
                    },
                    {
                        internalType: "string[]",
                        name: "updatableColumns",
                        type: "string[]",
                    },
                ],
                internalType: "struct TablelandPolicy",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "getPolicy",
        outputs: [
            {
                components: [
                    {
                        internalType: "bool",
                        name: "allowInsert",
                        type: "bool",
                    },
                    {
                        internalType: "bool",
                        name: "allowUpdate",
                        type: "bool",
                    },
                    {
                        internalType: "bool",
                        name: "allowDelete",
                        type: "bool",
                    },
                    {
                        internalType: "string",
                        name: "whereClause",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "withCheck",
                        type: "string",
                    },
                    {
                        internalType: "string[]",
                        name: "updatableColumns",
                        type: "string[]",
                    },
                ],
                internalType: "struct TablelandPolicy",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "i_owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "blogCid",
                type: "string",
            },
            {
                internalType: "string",
                name: "blogName",
                type: "string",
            },
            {
                internalType: "address",
                name: "creatorAddress",
                type: "address",
            },
            {
                internalType: "uint32",
                name: "creatorSiteId",
                type: "uint32",
            },
        ],
        name: "insertFreeBlogIntoCreatorBlogTable",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "blogCid",
                type: "string",
            },
            {
                internalType: "string",
                name: "blogName",
                type: "string",
            },
            {
                internalType: "address",
                name: "creatorAddress",
                type: "address",
            },
            {
                internalType: "uint32",
                name: "creatorSiteId",
                type: "uint32",
            },
            {
                internalType: "uint32",
                name: "creatorMembershipTierId",
                type: "uint32",
            },
        ],
        name: "insertIntoCreatorBlogTable",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint32",
                name: "creatorSiteId",
                type: "uint32",
            },
            {
                internalType: "address",
                name: "creatorAddress",
                type: "address",
            },
            {
                internalType: "string",
                name: "tierName",
                type: "string",
            },
            {
                internalType: "string",
                name: "tierDescription",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "tierMonthlyPrice",
                type: "uint256",
            },
        ],
        name: "insertIntoCreatorMembershipTiersTable",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "siteName",
                type: "string",
            },
            {
                internalType: "string",
                name: "siteCid",
                type: "string",
            },
            {
                internalType: "address",
                name: "creatorAddress",
                type: "address",
            },
        ],
        name: "insertIntoCreatorSiteTable",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        name: "onERC721Received",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint32",
                name: "tierId",
                type: "uint32",
            },
            {
                internalType: "uint256",
                name: "monthlyPrice",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "creatorAddress",
                type: "address",
            },
        ],
        name: "registerMembershipTier",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "userAddress",
                type: "address",
            },
            {
                internalType: "uint32",
                name: "membershipTierId",
                type: "uint32",
            },
        ],
        name: "subscribe",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
];

exports.blogTablesContractAddress = blogTablesContractAddress;
exports.blogTablesAbi = blogTablesAbi;
