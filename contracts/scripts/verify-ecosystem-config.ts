import { ethers } from "hardhat";

/**
 * Script para verificar el estado de configuración del ecosistema UnitPoints
 * Este script verifica permisos, direcciones y tokens registrados sin hacer cambios
 *
 * Uso:
 * npx hardhat run scripts/verify-ecosystem-config.ts --network <network>
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
  userManager: "0x4FAB7A85e148E20357026853fB40c3988b1f06FB", // Reemplazar con la dirección real
  companyManager: "0x77BA22891A1847963A3417491819AeD1C6A1E391", // Reemplazar con la dirección real
  eventManager: "0x69E974fD8FE0016CCDB059f6e1De302Ff690A3A5", // Reemplazar con la dirección real
  daoGovernance: "0x665C7F3477B78C83E531c29746e58508a938afbe", // Reemplazar con la dirección real
  tokenAdministrator: "0xB8aEd07360FeBB97087eE47322B4457A83aD6D54", // Reemplazar con la dirección real
  unitpointsTokens: "0x6359B710A473f62A31f5aB74031FC3177e4a7B75",
};

interface VerificationResult {
  contract: string;
  check: string;
  status: "✅ PASS" | "❌ FAIL" | "⚠️  WARN";
  message: string;
}

async function main() {
  console.log("🔍 Verificando configuración del ecosistema UnitPoints...");

  // Obtener el deployer
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deployer:", deployer.address);

  console.log("📋 Direcciones de contratos:");
  Object.entries(CONTRACT_ADDRESSES).forEach(([name, address]) => {
    console.log(`  ${name}: ${address}`);
  });

  const results: VerificationResult[] = [];

  // ===== VERIFICAR PERMISOS =====
  console.log("\n🔐 Verificando permisos...");
  await verifyPermissions(CONTRACT_ADDRESSES, results);

  // ===== VERIFICAR DIRECCIONES =====
  console.log("\n🔗 Verificando direcciones entre contratos...");
  await verifyContractAddresses(CONTRACT_ADDRESSES, results);

  // ===== VERIFICAR TOKENS =====
  console.log("\n🪙 Verificando tokens de sector...");
  await verifySectorTokens(CONTRACT_ADDRESSES, results);

  // ===== MOSTRAR RESULTADOS =====
  console.log("\n📊 Resumen de verificación:");
  displayResults(results);

  // ===== ESTADÍSTICAS =====
  const passCount = results.filter((r) => r.status === "✅ PASS").length;
  const failCount = results.filter((r) => r.status === "❌ FAIL").length;
  const warnCount = results.filter((r) => r.status === "⚠️  WARN").length;

  console.log(`\n📈 Estadísticas:`);
  console.log(`  ✅ Exitosos: ${passCount}`);
  console.log(`  ❌ Fallidos: ${failCount}`);
  console.log(`  ⚠️  Advertencias: ${warnCount}`);

  if (failCount === 0) {
    console.log("\n🎉 ¡Configuración del ecosistema verificada exitosamente!");
  } else {
    console.log(
      "\n⚠️  Se encontraron problemas en la configuración. Revisar los resultados arriba."
    );
  }
}

async function verifyPermissions(
  addresses: ContractAddresses,
  results: VerificationResult[]
) {
  // Verificar que TokenAdministrator tenga permisos en UserManager
  try {
    const userManager = await ethers.getContractAt(
      "UserManager",
      addresses.userManager
    );
    const hasPermission = await userManager.admins(
      addresses.tokenAdministrator
    );
    results.push({
      contract: "UserManager",
      check: "TokenAdministrator admin permission",
      status: hasPermission ? "✅ PASS" : "❌ FAIL",
      message: hasPermission ? "Permiso otorgado" : "Permiso no otorgado",
    });
  } catch (error) {
    results.push({
      contract: "UserManager",
      check: "TokenAdministrator admin permission",
      status: "❌ FAIL",
      message: `Error verificando permiso: ${error}`,
    });
  }

  // Verificar que TokenAdministrator tenga permisos en EventManager
  try {
    const eventManager = await ethers.getContractAt(
      "EventManager",
      addresses.eventManager
    );
    const hasPermission = await eventManager.admins(
      addresses.tokenAdministrator
    );
    results.push({
      contract: "EventManager",
      check: "TokenAdministrator admin permission",
      status: hasPermission ? "✅ PASS" : "❌ FAIL",
      message: hasPermission ? "Permiso otorgado" : "Permiso no otorgado",
    });
  } catch (error) {
    results.push({
      contract: "EventManager",
      check: "TokenAdministrator admin permission",
      status: "❌ FAIL",
      message: `Error verificando permiso: ${error}`,
    });
  }

  // Verificar que EventManager tenga permisos en CompanyManager
  try {
    const companyManager = await ethers.getContractAt(
      "CompanyManager",
      addresses.companyManager
    );
    const hasPermission = await companyManager.admins(addresses.eventManager);
    results.push({
      contract: "CompanyManager",
      check: "EventManager admin permission",
      status: hasPermission ? "✅ PASS" : "❌ FAIL",
      message: hasPermission ? "Permiso otorgado" : "Permiso no otorgado",
    });
  } catch (error) {
    results.push({
      contract: "CompanyManager",
      check: "EventManager admin permission",
      status: "❌ FAIL",
      message: `Error verificando permiso: ${error}`,
    });
  }

  // Verificar que TokenAdministrator tenga permisos en CompanyManager
  try {
    const companyManager = await ethers.getContractAt(
      "CompanyManager",
      addresses.companyManager
    );
    const hasPermission = await companyManager.admins(
      addresses.tokenAdministrator
    );
    results.push({
      contract: "CompanyManager",
      check: "TokenAdministrator admin permission",
      status: hasPermission ? "✅ PASS" : "❌ FAIL",
      message: hasPermission ? "Permiso otorgado" : "Permiso no otorgado",
    });
  } catch (error) {
    results.push({
      contract: "CompanyManager",
      check: "TokenAdministrator admin permission",
      status: "❌ FAIL",
      message: `Error verificando permiso: ${error}`,
    });
  }

  // Verificar que EventManager tenga permisos en DAOGovernance
  try {
    const daoGovernance = await ethers.getContractAt(
      "DAOGovernance",
      addresses.daoGovernance
    );
    const hasPermission = await daoGovernance.admins(addresses.eventManager);
    results.push({
      contract: "DAOGovernance",
      check: "EventManager admin permission",
      status: hasPermission ? "✅ PASS" : "❌ FAIL",
      message: hasPermission ? "Permiso otorgado" : "Permiso no otorgado",
    });
  } catch (error) {
    results.push({
      contract: "DAOGovernance",
      check: "EventManager admin permission",
      status: "❌ FAIL",
      message: `Error verificando permiso: ${error}`,
    });
  }

  // Verificar que TokenAdministrator tenga permisos en DAOGovernance
  try {
    const daoGovernance = await ethers.getContractAt(
      "DAOGovernance",
      addresses.daoGovernance
    );
    const hasPermission = await daoGovernance.admins(
      addresses.tokenAdministrator
    );
    results.push({
      contract: "DAOGovernance",
      check: "TokenAdministrator admin permission",
      status: hasPermission ? "✅ PASS" : "❌ FAIL",
      message: hasPermission ? "Permiso otorgado" : "Permiso no otorgado",
    });
  } catch (error) {
    results.push({
      contract: "DAOGovernance",
      check: "TokenAdministrator admin permission",
      status: "❌ FAIL",
      message: `Error verificando permiso: ${error}`,
    });
  }

  // Verificar que TokenAdministrator tenga permisos en UnitPointsTokens
  try {
    const unitpointsTokens = await ethers.getContractAt(
      "UnitpointsTokens",
      addresses.unitpointsTokens
    );
    const hasPermission = await unitpointsTokens.admins(
      addresses.tokenAdministrator
    );
    results.push({
      contract: "UnitPointsTokens",
      check: "TokenAdministrator admin permission",
      status: hasPermission ? "✅ PASS" : "❌ FAIL",
      message: hasPermission ? "Permiso otorgado" : "Permiso no otorgado",
    });
  } catch (error) {
    results.push({
      contract: "UnitPointsTokens",
      check: "TokenAdministrator admin permission",
      status: "❌ FAIL",
      message: `Error verificando permiso: ${error}`,
    });
  }
}

async function verifyContractAddresses(
  addresses: ContractAddresses,
  results: VerificationResult[]
) {
  // Verificar direcciones en TokenAdministrator
  try {
    const tokenAdministrator = await ethers.getContractAt(
      "TokenAdministrator",
      addresses.tokenAdministrator
    );
    const auxiliaryContracts = await tokenAdministrator.getAuxiliaryContracts();

    // Verificar EventManager
    const eventManagerMatch =
      auxiliaryContracts[0].toLowerCase() ===
      addresses.eventManager.toLowerCase();
    results.push({
      contract: "TokenAdministrator",
      check: "EventManager address",
      status: eventManagerMatch ? "✅ PASS" : "❌ FAIL",
      message: eventManagerMatch
        ? "Dirección correcta"
        : `Esperado: ${addresses.eventManager}, Actual: ${auxiliaryContracts[0]}`,
    });

    // Verificar UserManager
    const userManagerMatch =
      auxiliaryContracts[1].toLowerCase() ===
      addresses.userManager.toLowerCase();
    results.push({
      contract: "TokenAdministrator",
      check: "UserManager address",
      status: userManagerMatch ? "✅ PASS" : "❌ FAIL",
      message: userManagerMatch
        ? "Dirección correcta"
        : `Esperado: ${addresses.userManager}, Actual: ${auxiliaryContracts[1]}`,
    });

    // Verificar DAOGovernance
    const daoGovernanceMatch =
      auxiliaryContracts[2].toLowerCase() ===
      addresses.daoGovernance.toLowerCase();
    results.push({
      contract: "TokenAdministrator",
      check: "DAOGovernance address",
      status: daoGovernanceMatch ? "✅ PASS" : "❌ FAIL",
      message: daoGovernanceMatch
        ? "Dirección correcta"
        : `Esperado: ${addresses.daoGovernance}, Actual: ${auxiliaryContracts[2]}`,
    });
  } catch (error) {
    results.push({
      contract: "TokenAdministrator",
      check: "Auxiliary contracts",
      status: "❌ FAIL",
      message: `Error verificando contratos auxiliares: ${error}`,
    });
  }

  // Verificar direcciones en EventManager
  try {
    const eventManager = await ethers.getContractAt(
      "EventManager",
      addresses.eventManager
    );

    // Verificar DAOGovernance
    const daoGovernance = await eventManager.daoGovernance();
    const daoMatch =
      daoGovernance.toLowerCase() === addresses.daoGovernance.toLowerCase();
    results.push({
      contract: "EventManager",
      check: "DAOGovernance address",
      status: daoMatch ? "✅ PASS" : "❌ FAIL",
      message: daoMatch
        ? "Dirección correcta"
        : `Esperado: ${addresses.daoGovernance}, Actual: ${daoGovernance}`,
    });

    // Verificar CompanyManager
    const companyManager = await eventManager.companyManager();
    const companyMatch =
      companyManager.toLowerCase() === addresses.companyManager.toLowerCase();
    results.push({
      contract: "EventManager",
      check: "CompanyManager address",
      status: companyMatch ? "✅ PASS" : "❌ FAIL",
      message: companyMatch
        ? "Dirección correcta"
        : `Esperado: ${addresses.companyManager}, Actual: ${companyManager}`,
    });
  } catch (error) {
    results.push({
      contract: "EventManager",
      check: "Contract addresses",
      status: "❌ FAIL",
      message: `Error verificando direcciones: ${error}`,
    });
  }
}

async function verifySectorTokens(
  addresses: ContractAddresses,
  results: VerificationResult[]
) {
  try {
    const tokenAdministrator = await ethers.getContractAt(
      "TokenAdministrator",
      addresses.tokenAdministrator
    );

    // Verificar total de sectores
    const totalSectors = await tokenAdministrator.getTotalSectors();
    results.push({
      contract: "TokenAdministrator",
      check: "Total sectors",
      status: totalSectors > 0 ? "✅ PASS" : "❌ FAIL",
      message:
        totalSectors > 0
          ? `${totalSectors} sectores registrados`
          : "No hay sectores registrados",
    });

    if (totalSectors > 0) {
      // Verificar primer token de sector
      const sectorTokenAddress = await tokenAdministrator.getSectorToken(1);
      const tokenMatch =
        sectorTokenAddress.toLowerCase() ===
        addresses.unitpointsTokens.toLowerCase();
      results.push({
        contract: "TokenAdministrator",
        check: "Sector token 1 address",
        status: tokenMatch ? "✅ PASS" : "❌ FAIL",
        message: tokenMatch
          ? "Dirección correcta"
          : `Esperado: ${addresses.unitpointsTokens}, Actual: ${sectorTokenAddress}`,
      });
    }
  } catch (error) {
    results.push({
      contract: "TokenAdministrator",
      check: "Sector tokens",
      status: "❌ FAIL",
      message: `Error verificando tokens de sector: ${error}`,
    });
  }
}

function displayResults(results: VerificationResult[]) {
  results.forEach((result) => {
    console.log(`  ${result.status} ${result.contract}: ${result.check}`);
    console.log(`    ${result.message}`);
  });
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
    console.error("❌ Error durante la verificación:", error);
    process.exit(1);
  });
