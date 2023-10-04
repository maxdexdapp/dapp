// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();

  console.log("Token address:", token.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token);


  const Token2 = await ethers.getContractFactory("USDT");
  const token2 = await Token2.deploy();
  await token2.deployed();

  console.log("Token address:", token2.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles2(token2);

  const Token3 = await ethers.getContractFactory("MXDX");
  const token3 = await Token3.deploy();
  await token3.deployed();

  console.log("Token address:", token3.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles3(token3);

  const Token4 = await ethers.getContractFactory("Presale");
  const token4 = await Token4.deploy();
  await token4.deployed();

  console.log("Token address:", token4.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles4(token4);
  
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Token");

  fs.writeFileSync(
    path.join(contractsDir, "Token.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

function saveFrontendFiles2(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "USDT-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("USDT");

  fs.writeFileSync(
    path.join(contractsDir, "USDT.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

function saveFrontendFiles3(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "MXDX-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("MXDX");

  fs.writeFileSync(
    path.join(contractsDir, "MXDX.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

function saveFrontendFiles4(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "Presale-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Presale");

  fs.writeFileSync(
    path.join(contractsDir, "Presale.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
