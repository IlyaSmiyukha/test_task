set -o allexport; source ./.env; set +o allexport;
export $(grep -v '^#' .env | xargs -d '\n')

anvil -f $ETH_PROVIDER --fork-block-number $ETH_BLOCK --chain-id $ETH_CHAIN_ID

