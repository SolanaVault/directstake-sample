export type DirectedStake = {
  "version": "0.1.0",
  "name": "directed_stake",
  "instructions": [
    {
      "name": "initDirector",
      "docs": [
        "Initializes a [Director] for a new account."
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Owner of the [Director]."
          ]
        },
        {
          "name": "director",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The [Director]."
          ]
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Payer."
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System program. Required for initialization."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "closeDirector",
      "docs": [
        "Closes the [Director] for the account."
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Owner of the [Director]."
          ]
        },
        {
          "name": "director",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The [Director]."
          ]
        },
        {
          "name": "rentDestination",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Where to send the rent to for the closed account."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "setStakeTarget",
      "docs": [
        "Sets the [Director]'s stake target."
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "director",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTarget",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The vote account [Pubkey] of the validator."
          ]
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The [Clock]."
          ]
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "director",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakeTarget",
            "type": "publicKey"
          },
          {
            "name": "lastUpdatedAt",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidTimestamp",
      "msg": "Invalid timestamp."
    },
    {
      "code": 6001,
      "name": "StakeTargetNotSet",
      "msg": "Stake target not set"
    }
  ]
};

export const IDL: DirectedStake = {
  "version": "0.1.0",
  "name": "directed_stake",
  "instructions": [
    {
      "name": "initDirector",
      "docs": [
        "Initializes a [Director] for a new account."
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Owner of the [Director]."
          ]
        },
        {
          "name": "director",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The [Director]."
          ]
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Payer."
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System program. Required for initialization."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "closeDirector",
      "docs": [
        "Closes the [Director] for the account."
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Owner of the [Director]."
          ]
        },
        {
          "name": "director",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The [Director]."
          ]
        },
        {
          "name": "rentDestination",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Where to send the rent to for the closed account."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "setStakeTarget",
      "docs": [
        "Sets the [Director]'s stake target."
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "director",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTarget",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The vote account [Pubkey] of the validator."
          ]
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The [Clock]."
          ]
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "director",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakeTarget",
            "type": "publicKey"
          },
          {
            "name": "lastUpdatedAt",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidTimestamp",
      "msg": "Invalid timestamp."
    },
    {
      "code": 6001,
      "name": "StakeTargetNotSet",
      "msg": "Stake target not set"
    }
  ]
};
