import logo from "./logo.svg";
import "./App.css";
import { ethers } from "ethers";
import { useState } from "react";
const { GetClosestBlock } = require("./GetBlockByTimeStamp.js");
const abiusc = require("./contracts/usdc.json").abi;

function App() {
  const [walletAddress, SetAccount] = useState("");

  const [contractLogs, SetHistoryLogs] = useState(null);

  async function GetTransferHistory() {
    let url = "https://1rpc.io/eth";
    let ownerProvider = new ethers.providers.JsonRpcProvider(url);
    let contractAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

    //const blockNumber = await GetClosestBlock(1680478439);
    //console.log("Block number : " + blockNumber);
    let allLogs = [];
    let abi = [
      "event Transfer(address indexed from, address indexed to, uint value)",
    ];
    let iface = new ethers.utils.Interface(abi);

    var filter = {
      address: contractAddress,
      fromBlock: 16964685, //block number from april 3
      toBlock: 16964685 + 10,
      topics: [ethers.utils.id("Transfer(address,address,uint256)")],
    };
    const logsCall = await ownerProvider.getLogs(filter);

    for (let i = 0; i < logsCall.length; i++) {
      let events = logsCall.map((log) => iface.parseLog(log));
      allLogs.push(events[i]);
    }

    SetHistoryLogs(allLogs);

    //Save to database or whatever we want to do
  }

  const transactions = () => {
    if (contractLogs != null) {
      var data = [];

      for (var i = 0; i < 10; i++) {
        let values = contractLogs[i].args;
        const args = {
          from: values[0],
          to: values[1],
          value: values[2],
        };
        data.push(
          <div key={i} style={{ Display: "block" }}>
            <label>
              From:{args.from.toString()} To: {args.to.toString()} Value:
              {args.value.toString()}
            </label>
          </div>
        );
      }
      return data;
    }
  };

  /**Notes, Jeffrey Luna.
   * Polling on events should be done on a backserver, I will not be setting this up, instead I have the script on ../server/PollEvents to do it
   * this application only gets 600-700 transactions due to server limitations on the EVM itself meaning its not possible to get so many logs at an instance
   * and I only display 10 transactions on Transfer events for the USDC contract as proof of concept**/
  return (
    <div className="App">
      <button onClick={GetTransferHistory}>Get Transfer Logs</button>
      <div style={{ verticalAlign: "center" }}>{transactions()}</div>
    </div>
  );
}

export default App;
