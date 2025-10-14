import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// STEP 3: Solo el contrato más grande
const UnitPointsEcosystemStep3Module = buildModule(
  "UnitPointsEcosystemStep3",
  (m) => {
    // Solo el contrato más grande (TokenSwap)
    const tokenSwap = m.contract("TokenSwap");
    return {tokenSwap};
  }
);

export default UnitPointsEcosystemStep3Module;
