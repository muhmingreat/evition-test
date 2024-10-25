// import hre from 'hardhat'
// async function main(){
//       const ONE_GWEI = 1_000_000_000 as any;

//     const MyToken = await hre.ethers.getContractFactory('MyToken')
//     const myToken = await MyToken.deploy(ONE_GWEI,{value: "TOKEN", "TOKENISE"});

//     await myToken.waitForDeployment() 

//     console.log(`Deploying COntract : ${myToken.getAddress}`);

// }

//  main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

import { ethers } from "hardhat";

async function main() {
  // Get the contract factory for MyToken
  const MyToken = await ethers.getContractFactory("MyToken");

  // Specify the initial owner address
  const initialOwner = "0xYourOwnerAddressHere"; // Replace with the actual address

  // Deploy the contract
  const myToken = await MyToken.deploy(initialOwner);

  // Wait for the deployment to be mined
  await myToken.deployed();

  console.log("MyToken deployed to:", myToken.address);

  // Optionally mint some tokens to an address
  const recipient = " 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with the actual recipient address
  const amount = ethers.utils.parseUnits("1000", 18); // Mint 1000 tokens

  const mintTx = await myToken.mint(recipient, amount);
  await mintTx.wait();

  console.log(`Minted ${amount.toString()} tokens to ${recipient}`);
}

// Run the main function and handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
