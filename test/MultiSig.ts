import { ethers } from "hardhat";
import { expect } from "chai";

describe("MultiSig Contract", function () {
  let MultiSig: any;
  let multiSig: any;
  let owner: any;
  let signers: any[];
  let recipient: string;
  let initialBalance: any;

  beforeEach(async function () {
    // Get the accounts
    [owner, ...signers] = await ethers.getSigners();
    recipient = signers[0].address;

    // Deploy the contract
    const quorum = 2; // Minimum number of signers required to approve a transaction
    MultiSig = await ethers.getContractFactory("MultiSig");
    multiSig = await MultiSig.deploy(
      [signers[0].address, signers[1].address],
      quorum
    );

    // Fund the contract with some Ether
    initialBalance = ethers.utils.parseEther("10.0");
    await owner.sendTransaction({
      to: multiSig.address,
      value: initialBalance,
    });
  });

  it("should initiate a transaction", async function () {
    const amount = ethers.utils.parseEther("1.0");

    await expect(
      multiSig.connect(signers[0]).initiateTransaction(amount, recipient)
    )
      .to.emit(multiSig, "TransactionInitiated")
      .withArgs(1, amount, recipient, signers[0].address);

    const transactions = await multiSig.getAllTransactions();
    expect(transactions.length).to.equal(1);
    expect(transactions[0].amount).to.equal(amount);
    expect(transactions[0].receiver).to.equal(recipient);
  });

  it("should approve a transaction", async function () {
    const amount = ethers.utils.parseEther("1.0");
    await multiSig.connect(signers[0]).initiateTransaction(amount, recipient);

    // Approve the transaction by two different signers
    await multiSig.connect(signers[0]).approveTransaction(1);
    await multiSig.connect(signers[1]).approveTransaction(1);

    const transactions = await multiSig.getAllTransactions();
    expect(transactions[0].isExecuted).to.be.true;

    // Check the recipient's balance
    const recipientBalance = await ethers.provider.getBalance(recipient);
    expect(recipientBalance).to.equal(amount);
  });

  it("should not approve a transaction if already executed", async function () {
    const amount = ethers.utils.parseEther("1.0");
    await multiSig.connect(signers[0]).initiateTransaction(amount, recipient);
    await multiSig.connect(signers[0]).approveTransaction(1);
    await multiSig.connect(signers[1]).approveTransaction(1);

    await expect(
      multiSig.connect(signers[0]).approveTransaction(1)
    ).to.be.revertedWith("transaction already executed");
  });

  it("should allow the owner to add a new signer", async function () {
    const newSigner = signers[2].address;
    await multiSig.connect(owner).addValidSigner(newSigner);

    // Check if the new signer is valid
    expect(await multiSig.isValidSigner(newSigner)).to.be.true;
  });

  it("should allow the owner to remove a signer", async function () {
    await multiSig.connect(owner).removeSigner(0); // Remove first signer

    // Check if the first signer is no longer valid
    expect(await multiSig.isValidSigner(signers[0].address)).to.be.false;
  });

  it("should transfer ownership", async function () {
    await multiSig.connect(owner).transferOwnership(signers[1].address);
    await multiSig.connect(signers[1]).claimOwnership();

    // Check if the new owner is set
    expect(await multiSig.owner()).to.equal(signers[1].address);
  });
});
