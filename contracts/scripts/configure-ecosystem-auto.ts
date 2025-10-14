import { ethers } from "hardhat";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Script automático para configurar el ecosistema UnitPoints después del despliegue
 * Este script lee las direcciones de los contratos desplegados automáticamente
 * y configura permisos, direcciones entre contratos y registra tokens
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

interface DeploymentResult {
  [contractName: string]: {
    address: string;
    transactionHash: string;
  };
}

async function main() {
  console.log(
    "🚀 Iniciando configuración automática del ecosistema UnitPoints..."
  );

  // Obtener el deployer (debe tener permisos de admin)
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deployer:", deployer.address);

  // ===== LEER DIRECCIONES DE CONTRATOS DESPLEGADOS =====
  const contractAddresses = await getDeployedAddresses();

  console.log("📋 Direcciones de contratos desplegados:");
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

// Función para obtener direcciones de contratos desplegados
async function getDeployedAddresses(): Promise<ContractAddresses> {
  try {
    // Intentar leer desde archivos de deployment de Hardhat Ignition
    const network = await ethers.provider.getNetwork();
    const networkName = network.name === "unknown" ? "localhost" : network.name;

    console.log(`🔍 Buscando contratos desplegados en red: ${networkName}`);

    // Buscar archivos de deployment en diferentes ubicaciones
    const possiblePaths = [
      join(
        process.cwd(),
        "ignition",
        "deployments",
        "chain-31337",
        "deployed_addresses.json"
      ), // localhost
      join(
        process.cwd(),
        "ignition",
        "deployments",
        `chain-${network.chainId}`,
        "deployed_addresses.json"
      ), // otras redes
      join(
        process.cwd(),
        "deployments",
        networkName,
        "deployed_addresses.json"
      ), // deployments personalizados
    ];

    let deploymentData: any = null;
    for (const path of possiblePaths) {
      try {
        const data = readFileSync(path, "utf8");
        deploymentData = JSON.parse(data);
        console.log(`📁 Encontrado archivo de deployment: ${path}`);
        break;
      } catch (error) {
        // Continuar con el siguiente path
      }
    }

    if (!deploymentData) {
      throw new Error("No se encontraron archivos de deployment");
    }

    // Extraer direcciones de los diferentes steps
    const addresses: ContractAddresses = {
      userManager: "",
      companyManager: "",
      eventManager: "",
      daoGovernance: "",
      tokenAdministrator: "",
      unitpointsTokens: "",
    };

    // Buscar en los diferentes módulos de deployment
    const modules = [
      "UnitPointsEcosystemStep1",
      "UnitPointsEcosystemStep2",
      "UnitPointsEcosystemStep3",
      "UnitPointsEcosystemStep4",
      "UnitPointsEcosystemStep5",
      "UnitPointsEcosystemStep6",
    ];

    for (const module of modules) {
      if (deploymentData[module]) {
        const moduleData = deploymentData[module];

        if (moduleData.userManager)
          addresses.userManager = moduleData.userManager.address;
        if (moduleData.companyManager)
          addresses.companyManager = moduleData.companyManager.address;
        if (moduleData.eventManager)
          addresses.eventManager = moduleData.eventManager.address;
        if (moduleData.daoGovernance)
          addresses.daoGovernance = moduleData.daoGovernance.address;
        if (moduleData.TokenAdministrator)
          addresses.tokenAdministrator = moduleData.TokenAdministrator.address;
        if (moduleData.unitpointsTokens)
          addresses.unitpointsTokens = moduleData.unitpointsTokens.address;
      }
    }

    // Verificar que todas las direcciones estén presentes
    const missingAddresses = Object.entries(addresses)
      .filter(([_, address]) => !address)
      .map(([name, _]) => name);

    if (missingAddresses.length > 0) {
      throw new Error(
        `Faltan direcciones para: ${missingAddresses.join(", ")}`
      );
    }

    return addresses;
  } catch (error) {
    console.error("❌ Error al leer direcciones de contratos:", error);
    console.log("\n💡 Alternativas:");
    console.log(
      "1. Usar el script configure-ecosystem.ts y actualizar las direcciones manualmente"
    );
    console.log(
      "2. Verificar que los contratos estén desplegados correctamente"
    );
    console.log("3. Verificar la estructura de archivos de deployment");
    throw error;
  }
}

// Ejecutar el script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante la configuración:", error);
    process.exit(1);
  });

  /*
git add . && \
rm -rf contracts/.git && \
git rm --cached -rf contracts && \
rm -rf unit-points-frontend/.git && \
git rm --cached -rf unit-points-frontend && \
git add contracts && \
git add unit-points-frontend 
git commit -m "deploy UnitPoints System"
git push -u origin main

git remote set-url origin https://github.com/SrJuanF/UnitPoints-System.git
git push -u origin main
*/