import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// STEP 2: Contratos medianos
const UnitPointsEcosystemStep4Module = buildModule("UnitPointsEcosystemStep4", (m) => {
  const daoGovernance = m.contract("DAOGovernance");
  return {daoGovernance};
});

export default UnitPointsEcosystemStep4Module;