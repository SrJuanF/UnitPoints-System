import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// STEP 1: Solo contratos pequeños
const UnitPointsEcosystemStep1Module = buildModule(
  "UnitPointsEcosystemStep1",
  (m) => {
    // Solo contratos pequeños que no causan problemas
    const userManager = m.contract("UserManager");
    const companyManager = m.contract("CompanyManager", [], {
      after: [userManager], // Forzar secuencia
    });

    return {
      userManager,
      companyManager,
    };
  }
);

export default UnitPointsEcosystemStep1Module;
