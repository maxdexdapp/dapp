const fs = require("fs");

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.

task("faucet", "Sends ETH and tokens to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver }, { ethers }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const addressesFile =
      __dirname + "/../frontend/src/contracts/contract-address.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson);

    if ((await ethers.provider.getCode(address.Token)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const token = await ethers.getContractAt("Token", address.Token);
    const [sender] = await ethers.getSigners();

    const tx = await token.transfer(receiver, 100);
    await tx.wait();

    const tx2 = await sender.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther,
    });
    await tx2.wait();

    console.log(`Transferred 1 ETH and 100 tokens to ${receiver}`);


  //transfer USDT to address
    const addressesFile2 =
      __dirname + "/../frontend/src/contracts/USDT-address.json";

    if (!fs.existsSync(addressesFile2)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson2 = fs.readFileSync(addressesFile2);
    const address2 = JSON.parse(addressJson2);

    if ((await ethers.provider.getCode(address2.Token)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const token2 = await ethers.getContractAt("USDT", address2.Token);
    const [sender2] = await ethers.getSigners();

    const tx3 = await token2.transfer(receiver, 100000000000000);
    await tx3.wait();
/*
    const tx4 = await sender2.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther,
    });
    await tx4.wait();
*/
    console.log(`Transferred 1 USDT tokens to ${receiver}`);
  });
