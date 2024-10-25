import hre from 'hardhat'

async function  main() {

    const deploy_address = "0x9816C7F4ddedB461abD585e6b68B10febB376233";

    const myAccount = "0x30307d98d5FC2F6c83541E196FdCE5F38C86d637";

    const signer = await hre.ethers.getSigner(myAccount)

    const interactWithContract =  await hre.ethers.getContractAt(
     "DegenToken",
     deploy_address
    )
 let tokenName,toSymboll, totalSuply;
console.log("################## Deploying the Contract #####################")
 const deployDegenToken = await interactWithContract.connect(signer).DegenToken()



// b). Interact with the Contract:
//    i). Get all items available in the store: Interact with the contract
//     to retrieve the list of items available for redemption.
//    ii) Redeem items: Choose more than one item from the store and 
//    redeem them accordingly by sending the required token amount to the
//     contract. Ensure that the redemption process is properly logged.
//    iii). Token Balance: Get the balance of the user before and after redeeming items.
// }
main().then(()=> process.exit(0)).
catch((error) => {
    console.error(error)
    process.exit(1)
})