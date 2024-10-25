import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DegenToken = buildModule("DegenToken", (m) => {
  const degenToken = m.contract("DegenToken");

  return { degenToken };
});

export default DegenToken;
