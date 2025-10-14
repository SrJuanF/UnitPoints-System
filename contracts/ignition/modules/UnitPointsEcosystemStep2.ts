import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// STEP 2: Contratos medianos
const UnitPointsEcosystemStep2Module = buildModule("UnitPointsEcosystemStep2", (m) => {
  // Contratos medianos
  const eventManager = m.contract("EventManager");
  return {eventManager};
});

export default UnitPointsEcosystemStep2Module;
