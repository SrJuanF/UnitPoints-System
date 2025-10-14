import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// STEP 6: Desplegar UnitpointsTokens con parámetros específicos
const UnitPointsEcosystemStep6Module = buildModule(
  "UnitPointsEcosystemStep6",
  (m) => {
    const unitpointsTokens = m.contract("UnitpointsTokens", [
      "UnitPoints", // name
      "UPT", // symbol
      "Token para eventos, conferencias, seminarios y actividades", // sectorDescription
    ]);

    return { unitpointsTokens };
  }
);

export default UnitPointsEcosystemStep6Module;
