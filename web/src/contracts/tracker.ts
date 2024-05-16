export const address = '0x75062fAB27490219E43D94017327593DbE4B81C6';
export const abi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_underlyingToken',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'balances',
    inputs: [
      {
        name: 'userAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'challenges',
    inputs: [
      {
        name: 'arxAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'minimunCheckIns',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'startTimestamp',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'endTimestamp',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'donateDestination',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'perUserStake',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'totalStake',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'settled',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'checkIn',
    inputs: [
      {
        name: 'arxAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'msgHash',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'v',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'r',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 's',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'checkIns',
    inputs: [
      {
        name: 'arxAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'userAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserChallenges',
    inputs: [
      {
        name: 'userAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserCheckInCounts',
    inputs: [
      {
        name: 'arxAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'userAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hasJoined',
    inputs: [
      {
        name: 'arxAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'userAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'join',
    inputs: [
      {
        name: 'arxAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'participants',
    inputs: [
      {
        name: 'arxAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'register',
    inputs: [
      {
        name: 'arxAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'description',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'minimunCheckIns',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'startTimestamp',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'endTimestamp',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'donateDestination',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'stake',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'settle',
    inputs: [
      {
        name: 'arxAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'succeedParticipants',
    inputs: [
      {
        name: 'arxAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'underlyingToken',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'userChallenges',
    inputs: [
      {
        name: 'userAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'withdraw',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'CheckIn',
    inputs: [
      {
        name: 'userAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'arxAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'timestamp',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Join',
    inputs: [
      {
        name: 'userAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'arxAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Register',
    inputs: [
      {
        name: 'arxAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'description',
        type: 'string',
        indexed: false,
        internalType: 'string',
      },
      {
        name: 'startTimestamp',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'endTimestamp',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'minimumCheckIns',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Settle',
    inputs: [
      {
        name: 'arxAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [
      {
        name: 'target',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ECDSAInvalidSignature',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ECDSAInvalidSignatureLength',
    inputs: [
      {
        name: 'length',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'ECDSAInvalidSignatureS',
    inputs: [
      {
        name: 's',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
  },
  {
    type: 'error',
    name: 'FailedCall',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientBalance',
    inputs: [
      {
        name: 'balance',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'needed',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'SafeERC20FailedOperation',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
] as const;
