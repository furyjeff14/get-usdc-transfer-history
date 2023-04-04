import { ethers } from "ethers";

export const GetClosestBlock = async (timestamp) => {
  let minBlockNumber = 0;
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let maxBlockNumber = await provider.getBlockNumber();
  let closestBlockNumber = Math.floor((maxBlockNumber + minBlockNumber) / 2);
  let closestBlock = await provider.getBlock(closestBlockNumber);
  let foundExactBlock = false;

  while (minBlockNumber <= maxBlockNumber) {
    console.log(`checking blockNumber=${closestBlockNumber}...`);
    if (closestBlock.timestamp === timestamp) {
      foundExactBlock = true;
      break;
    } else if (closestBlock.timestamp > timestamp) {
      maxBlockNumber = closestBlockNumber - 1;
    } else {
      minBlockNumber = closestBlockNumber + 1;
    }

    closestBlockNumber = Math.floor((maxBlockNumber + minBlockNumber) / 2);
    closestBlock = await provider.getBlock(closestBlockNumber);
  }

  return closestBlockNumber;
};
