import { ethers } from "hardhat";

/**
 * Script paso a paso para configurar el ecosistema UnitPoints
 * Permite ejecutar cada paso de configuración por separado para debugging
 *
 * Uso:
 * npx hardhat run scripts/configure-ecosystem-step-by-step.ts --network <network>
 *
 * Para ejecutar pasos específicos, modificar la variable STEPS_TO_RUN
 */

interface ContractAddresses {
  userManager: string;
  companyManager: string;
  eventManager: string;
  daoGovernance: string;
  tokenAdministrator: string;
  unitpointsTokens: string;
}

// ===== CONFIGURACIÓN =====
// IMPORTANTE: Actualizar estas direcciones con las reales de tu despliegue
const CONTRACT_ADDRESSES: ContractAddresses = {
  userManager: "0x...", // Reemplazar con la dirección real
  companyManager: "0x...", // Reemplazar con la dirección real
  eventManager: "0x...", // Reemplazar con la dirección real
  daoGovernance: "0x...", // Reemplazar con la dirección real
  tokenAdministrator: "0x...", // Reemplazar con la dirección real
  unitpointsTokens: "0x...", // Reemplazar con la dirección real
};

// Pasos a ejecutar (modificar según necesidades)
const STEPS_TO_RUN = {
  GRANT_PERMISSIONS: true,
  SET_ADDRESSES: true,
  REGISTER_TOKENS: true,
  VERIFY_CONFIG: true,
};

async function main() {
  console.log(
    "🚀 Iniciando configuración paso a paso del ecosistema UnitPoints..."
  );

  // Obtener el deployer
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deployer:", deployer.address);

  console.log("📋 Direcciones de contratos:");
  Object.entries(CONTRACT_ADDRESSES).forEach(([name, address]) => {
    console.log(`  ${name}: ${address}`);
  });

  // ===== PASO 1: CONFIGURAR PERMISOS =====
  if (STEPS_TO_RUN.GRANT_PERMISSIONS) {
    console.log("\n🔐 PASO 1: Configurando permisos...");
    await grantPermissions(CONTRACT_ADDRESSES);
  }

  // ===== PASO 2: CONFIGURAR DIRECCIONES =====
  if (STEPS_TO_RUN.SET_ADDRESSES) {
    console.log("\n🔗 PASO 2: Configurando direcciones entre contratos...");
    await setContractAddresses(CONTRACT_ADDRESSES);
  }

  // ===== PASO 3: REGISTRAR TOKENS =====
  if (STEPS_TO_RUN.REGISTER_TOKENS) {
    console.log("\n🪙 PASO 3: Registrando tokens de sector...");
    await registerSectorTokens(CONTRACT_ADDRESSES);
  }

  // ===== PASO 4: VERIFICAR CONFIGURACIÓN =====
  if (STEPS_TO_RUN.VERIFY_CONFIG) {
    console.log("\n✅ PASO 4: Verificando configuración...");
    await verifyConfiguration(CONTRACT_ADDRESSES);
  }

  console.log("\n🎉 ¡Configuración completada exitosamente!");
}

async function grantPermissions(addresses: ContractAddresses) {
  console.log("  🔐 Otorgando permisos entre contratos...");

  // UserManager -> TokenAdministrator
  console.log("    UserManager -> TokenAdministrator");
  const userManager = await ethers.getContractAt(
    "UserManager",
    addresses.userManager
  );
  const tx1 = await userManager.grantAdmin(addresses.tokenAdministrator);
  await tx1.wait();
  console.log("      ✅ Permiso otorgado");

  // EventManager -> TokenAdministrator
  console.log("    EventManager -> TokenAdministrator");
  const eventManager = await ethers.getContractAt(
    "EventManager",
    addresses.eventManager
  );
  const tx2 = await eventManager.grantAdmin(addresses.tokenAdministrator);
  await tx2.wait();
  console.log("      ✅ Permiso otorgado");

  // CompanyManager -> EventManager
  console.log("    CompanyManager -> EventManager");
  const companyManager = await ethers.getContractAt(
    "CompanyManager",
    addresses.companyManager
  );
  const tx3 = await companyManager.grantAdmin(addresses.eventManager);
  await tx3.wait();
  console.log("      ✅ Permiso otorgado");

  // CompanyManager -> TokenAdministrator
  console.log("    CompanyManager -> TokenAdministrator");
  const tx4 = await companyManager.grantAdmin(addresses.tokenAdministrator);
  await tx4.wait();
  console.log("      ✅ Permiso otorgado");

  // DAOGovernance -> EventManager
  console.log("    DAOGovernance -> EventManager");
  const daoGovernance = await ethers.getContractAt(
    "DAOGovernance",
    addresses.daoGovernance
  );
  const tx5 = await daoGovernance.grantAdmin(addresses.eventManager);
  await tx5.wait();
  console.log("      ✅ Permiso otorgado");

  // DAOGovernance -> TokenAdministrator
  console.log("    DAOGovernance -> TokenAdministrator");
  const tx6 = await daoGovernance.grantAdmin(addresses.tokenAdministrator);
  await tx6.wait();
  console.log("      ✅ Permiso otorgado");

  // UnitPointsTokens -> TokenAdministrator
  console.log("    UnitPointsTokens -> TokenAdministrator");
  const unitpointsTokens = await ethers.getContractAt(
    "UnitpointsTokens",
    addresses.unitpointsTokens
  );
  const tx7 = await unitpointsTokens.grantAdmin(addresses.tokenAdministrator);
  await tx7.wait();
  console.log("      ✅ Permiso otorgado");

  console.log("  ✅ Todos los permisos configurados correctamente");
}

async function setContractAddresses(addresses: ContractAddresses) {
  console.log("  🔗 Configurando direcciones entre contratos...");

  // EventManager -> setDAOGovernance
  console.log("    EventManager -> setDAOGovernance");
  const eventManager = await ethers.getContractAt(
    "EventManager",
    addresses.eventManager
  );
  const tx1 = await eventManager.setDAOGovernance(addresses.daoGovernance);
  await tx1.wait();
  console.log("      ✅ DAOGovernance configurado");

  // EventManager -> setCompanyManager
  console.log("    EventManager -> setCompanyManager");
  const tx2 = await eventManager.setCompanyManager(addresses.companyManager);
  await tx2.wait();
  console.log("      ✅ CompanyManager configurado");

  // TokenAdministrator -> setAuxiliaryContracts
  console.log("    TokenAdministrator -> setAuxiliaryContracts");
  const tokenAdministrator = await ethers.getContractAt(
    "TokenAdministrator",
    addresses.tokenAdministrator
  );
  const tx3 = await tokenAdministrator.setAuxiliaryContracts(
    addresses.eventManager,
    addresses.userManager,
    addresses.daoGovernance
  );
  await tx3.wait();
  console.log("      ✅ Contratos auxiliares configurados");

  console.log("  ✅ Todas las direcciones configuradas correctamente");
}

async function registerSectorTokens(addresses: ContractAddresses) {
  console.log("  🪙 Registrando tokens de sector...");

  // Registrar UnitPointsTokens en TokenAdministrator
  console.log("    Registrando UnitPointsTokens en TokenAdministrator");
  const tokenAdministrator = await ethers.getContractAt(
    "TokenAdministrator",
    addresses.tokenAdministrator
  );
  const tx = await tokenAdministrator.registerSectorToken(
    addresses.unitpointsTokens
  );
  await tx.wait();

  // Obtener el ID del sector registrado
  const sectorId = await tokenAdministrator.getTotalSectors();
  console.log(`      ✅ Token registrado con ID de sector: ${sectorId}`);

  console.log("  ✅ Tokens de sector registrados correctamente");
}

async function verifyConfiguration(addresses: ContractAddresses) {
  console.log("  ✅ Verificando configuración...");

  const tokenAdministrator = await ethers.getContractAt(
    "TokenAdministrator",
    addresses.tokenAdministrator
  );

  // Verificar contratos auxiliares
  console.log("    Verificando contratos auxiliares en TokenAdministrator:");
  const auxiliaryContracts = await tokenAdministrator.getAuxiliaryContracts();
  console.log(`      EventManager: ${auxiliaryContracts[0]}`);
  console.log(`      UserManager: ${auxiliaryContracts[1]}`);
  console.log(`      DAOGovernance: ${auxiliaryContracts[2]}`);

  // Verificar que las direcciones coincidan
  const expectedAddresses = [
    addresses.eventManager,
    addresses.userManager,
    addresses.daoGovernance,
  ];
  const addressesMatch = auxiliaryContracts.every(
    (addr, index) =>
      addr.toLowerCase() === expectedAddresses[index].toLowerCase()
  );

  if (addressesMatch) {
    console.log("      ✅ Direcciones de contratos auxiliares correctas");
  } else {
    console.log(
      "      ❌ Error: Las direcciones de contratos auxiliares no coinciden"
    );
  }

  // Verificar total de sectores
  const totalSectors = await tokenAdministrator.getTotalSectors();
  console.log(`    Total sectores registrados: ${totalSectors}`);

  if (totalSectors > 0) {
    console.log("      ✅ Sectores registrados correctamente");

    // Verificar dirección del primer token de sector
    const sectorTokenAddress = await tokenAdministrator.getSectorToken(1);
    console.log(`      Token de sector 1: ${sectorTokenAddress}`);

    if (
      sectorTokenAddress.toLowerCase() ===
      addresses.unitpointsTokens.toLowerCase()
    ) {
      console.log("      ✅ Dirección del token de sector correcta");
    } else {
      console.log(
        "      ❌ Error: La dirección del token de sector no coincide"
      );
    }
  } else {
    console.log("      ❌ Error: No hay sectores registrados");
  }

  console.log("  ✅ Verificación completada");
}

// Función helper para verificar que una dirección es válida
function isValidAddress(address: string): boolean {
  return ethers.isAddress(address) && address !== "0x...";
}

// Verificar direcciones antes de ejecutar
function validateAddresses(addresses: ContractAddresses): void {
  const invalidAddresses = Object.entries(addresses)
    .filter(([_, address]) => !isValidAddress(address))
    .map(([name, _]) => name);

  if (invalidAddresses.length > 0) {
    console.error("❌ Error: Las siguientes direcciones no son válidas:");
    invalidAddresses.forEach((name) =>
      console.error(`  ${name}: ${addresses[name as keyof ContractAddresses]}`)
    );
    console.error(
      "\n💡 Por favor, actualiza las direcciones en CONTRACT_ADDRESSES"
    );
    process.exit(1);
  }
}

// Ejecutar el script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante la configuración:", error);
    process.exit(1);
  });
