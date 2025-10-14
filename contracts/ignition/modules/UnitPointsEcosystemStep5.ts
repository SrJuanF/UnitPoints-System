import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// STEP 1: Solo contratos pequeños
const UnitPointsEcosystemStep5Module = buildModule(
  "UnitPointsEcosystemStep5",
  (m) => {
    // Solo contratos pequeños que no causan problemas
    const TokenAdministrator = m.contract("TokenAdministrator");

    return {
      TokenAdministrator
    };
  }
);

export default UnitPointsEcosystemStep5Module;