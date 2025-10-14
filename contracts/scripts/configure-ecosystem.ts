import { ethers } from "hardhat";

/**
 * Script para configurar el ecosistema UnitPoints después del despliegue
 * Este script configura permisos, direcciones entre contratos y registra tokens
 *
 * IMPORTANTE: Ejecutar este script DESPUÉS de desplegar todos los contratos
 * El deployer debe tener permisos de admin en todos los contratos
 */

interface ContractAddresses {
  userManager: string;
  companyManager: string;
  eventManager: string;
  daoGovernance: string;
  tokenAdministrator: string;
  unitpointsTokens: string;
}

async function main() {
  console.log("🚀 Iniciando configuración del ecosistema UnitPoints...");

  // Obtener el deployer (debe tener permisos de admin)
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deployer:", deployer.address);

  // ===== CONFIGURAR DIRECCIONES DE CONTRATOS =====
  // IMPORTANTE: Reemplazar estas direcciones con las reales de tu despliegue
  const contractAddresses: ContractAddresses = {
    userManager: "0x4FAB7A85e148E20357026853fB40c3988b1f06FB", // Reemplazar con la dirección real
    companyManager: "0x77BA22891A1847963A3417491819AeD1C6A1E391", // Reemplazar con la dirección real
    eventManager: "0x69E974fD8FE0016CCDB059f6e1De302Ff690A3A5", // Reemplazar con la dirección real
    daoGovernance: "0x665C7F3477B78C83E531c29746e58508a938afbe", // Reemplazar con la dirección real
    tokenAdministrator: "0xB8aEd07360FeBB97087eE47322B4457A83aD6D54", // Reemplazar con la dirección real
    unitpointsTokens: "0x6359B710A473f62A31f5aB74031FC3177e4a7B75", // Reemplazar con la dirección real
  };

  console.log("📋 Direcciones de contratos:");
  Object.entries(contractAddresses).forEach(([name, address]) => {
    console.log(`  ${name}: ${address}`);
  });

  // ===== 1. CONFIGURAR PERMISOS (grantAdmin) =====
  console.log("\n🔐 Configurando permisos...");

  // UserManager -> TokenAdministrator
  console.log("  UserManager -> TokenAdministrator");
  const userManager = await ethers.getContractAt(
    "UserManager",
    contractAddresses.userManager
  );
  await userManager.grantAdmin(contractAddresses.tokenAdministrator);
  console.log("    ✅ Permiso otorgado");

  // EventManager -> TokenAdministrator
  console.log("  EventManager -> TokenAdministrator");
  const eventManager = await ethers.getContractAt(
    "EventManager",
    contractAddresses.eventManager
  );
  await eventManager.grantAdmin(contractAddresses.tokenAdministrator);
  console.log("    ✅ Permiso otorgado");

  // CompanyManager -> EventManager
  console.log("  CompanyManager -> EventManager");
  const companyManager = await ethers.getContractAt(
    "CompanyManager",
    contractAddresses.companyManager
  );
  await companyManager.grantAdmin(contractAddresses.eventManager);
  console.log("    ✅ Permiso otorgado");

  // CompanyManager -> TokenAdministrator
  console.log("  CompanyManager -> TokenAdministrator");
  await companyManager.grantAdmin(contractAddresses.tokenAdministrator);
  console.log("    ✅ Permiso otorgado");

  // DAOGovernance -> EventManager
  console.log("  DAOGovernance -> EventManager");
  const daoGovernance = await ethers.getContractAt(
    "DAOGovernance",
    contractAddresses.daoGovernance
  );
  await daoGovernance.grantAdmin(contractAddresses.eventManager);
  console.log("    ✅ Permiso otorgado");

  // DAOGovernance -> TokenAdministrator
  console.log("  DAOGovernance -> TokenAdministrator");
  await daoGovernance.grantAdmin(contractAddresses.tokenAdministrator);
  console.log("    ✅ Permiso otorgado");

  // UnitPointsTokens -> TokenAdministrator
  console.log("  UnitPointsTokens -> TokenAdministrator");
  const unitpointsTokens = await ethers.getContractAt(
    "UnitpointsTokens",
    contractAddresses.unitpointsTokens
  );
  await unitpointsTokens.grantAdmin(contractAddresses.tokenAdministrator);
  console.log("    ✅ Permiso otorgado");

  // ===== 2. CONFIGURAR DIRECCIONES ENTRE CONTRATOS =====
  console.log("\n🔗 Configurando direcciones entre contratos...");

  // EventManager -> setDAOGovernance y setCompanyManager
  console.log("  EventManager -> setDAOGovernance");
  await eventManager.setDAOGovernance(contractAddresses.daoGovernance);
  console.log("    ✅ DAOGovernance configurado");

  console.log("  EventManager -> setCompanyManager");
  await eventManager.setCompanyManager(contractAddresses.companyManager);
  console.log("    ✅ CompanyManager configurado");

  // TokenAdministrator -> setAuxiliaryContracts
  console.log("  TokenAdministrator -> setAuxiliaryContracts");
  const tokenAdministrator = await ethers.getContractAt(
    "TokenAdministrator",
    contractAddresses.tokenAdministrator
  );
  await tokenAdministrator.setAuxiliaryContracts(
    contractAddresses.eventManager,
    contractAddresses.userManager,
    contractAddresses.daoGovernance
  );
  console.log("    ✅ Contratos auxiliares configurados");

  // ===== 3. REGISTRAR TOKENS DE SECTOR =====
  console.log("\n🪙 Registrando tokens de sector...");

  // Registrar UnitPointsTokens en TokenAdministrator
  // Esto automáticamente lo registra en EventManager y DAOGovernance
  console.log("  Registrando UnitPointsTokens en TokenAdministrator");
  const sectorId = await tokenAdministrator.registerSectorToken(
    contractAddresses.unitpointsTokens
  );
  console.log(`    ✅ Token registrado con ID de sector: ${sectorId}`);

  // ===== 4. VERIFICAR CONFIGURACIÓN =====
  console.log("\n✅ Verificando configuración...");

  // Verificar contratos auxiliares en TokenAdministrator
  const auxiliaryContracts = await tokenAdministrator.getAuxiliaryContracts();
  console.log("  Contratos auxiliares en TokenAdministrator:");
  console.log(`    EventManager: ${auxiliaryContracts[0]}`);
  console.log(`    UserManager: ${auxiliaryContracts[1]}`);
  console.log(`    DAOGovernance: ${auxiliaryContracts[2]}`);

  // Verificar total de sectores
  const totalSectors = await tokenAdministrator.getTotalSectors();
  console.log(`  Total sectores registrados: ${totalSectors}`);

  // Verificar dirección del token de sector
  const sectorTokenAddress = await tokenAdministrator.getSectorToken(1);
  console.log(`  Token de sector 1: ${sectorTokenAddress}`);

  console.log("\n🎉 ¡Configuración del ecosistema completada exitosamente!");
  console.log("\n📋 Resumen de configuración:");
  console.log("  ✅ Permisos configurados entre contratos");
  console.log("  ✅ Direcciones configuradas entre contratos");
  console.log("  ✅ Tokens de sector registrados");
  console.log("  ✅ Ecosistema listo para usar");
}

// Función helper para obtener direcciones de contratos desplegados
async function getDeployedAddresses(): Promise<ContractAddresses> {
  // Esta función puede ser extendida para leer direcciones de archivos de deployment
  // o de variables de entorno
  throw new Error(
    "Por favor, actualiza las direcciones de contratos en el script"
  );
}

// Ejecutar el script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante la configuración:", error);
    process.exit(1);
  });
