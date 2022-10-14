cd ./smartcontracts/
npx hardhat run .\scripts\generate-ipfs.ts
npx hardhat run .\scripts\deploy.ts --network goerli
cd ../subgraph
graph deploy --product hosted-service hotspurhn/mixort
cd ../front
npm run serve