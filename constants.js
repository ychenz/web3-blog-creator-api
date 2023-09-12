const blogTablesContractAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
const blogTablesAbi = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
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
        inputs: [
            {
                internalType: "uint64",
                name: "id",
                type: "uint64",
            },
        ],
        name: "deleteVal",
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
        name: "insertIntoBlogSiteTable",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "val",
                type: "string",
            },
        ],
        name: "insertVal",
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
        inputs: [],
        name: "tableName",
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
                internalType: "uint64",
                name: "id",
                type: "uint64",
            },
            {
                internalType: "string",
                name: "val",
                type: "string",
            },
        ],
        name: "updateVal",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

exports.blogTablesContractAddress = blogTablesContractAddress;
exports.blogTablesAbi = blogTablesAbi;
