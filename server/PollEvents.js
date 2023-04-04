import { ethers } from "ethers";

//Listen to all transfer, do this on a server like node
const ListenTransfer = async () => {
  let url = "https://1rpc.io/eth";
  let contractAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  let provider = new ethers.providers.JsonRpcProvider(url);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  contract.on("transfer", (from, to, value) => {
    let info = {
      from: from,
      to: to,
      value: value.toString(),
    };
    //Save info to database
    console.log(JSON.stringify(info, null, 3));
  });
};
