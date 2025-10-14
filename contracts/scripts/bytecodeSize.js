const fs = require("fs");
const path = require("path");

/**
 * Script para analizar el tamaño total del deployment
 * Identifica qué combinación de contratos causa el límite de initcode
 */

function bytesToKB(bytes) {
  return (bytes / 1024).toFixed(2);
}

function getInitcodeSize(bytecode) {
  if (!bytecode || bytecode === "0x") {
    return 0;
  }
  return (bytecode.length - 2) / 2;
}

function analyzeDeploymentSize() {
  console.log("🔍 ANÁLISIS DE TAMAÑO DE DEPLOYMENT\n");
  console.log("=".repeat(80));

  const artifactsDir = path.join(__dirname, "..", "artifacts", "contracts");
  const results = [];

  try {
    if (!fs.existsSync(artifactsDir)) {
      console.log("❌ No se encontró el directorio de artefactos");
      console.log("   Ejecuta: npx hardhat compile");
      return;
    }

    const contractDirs = fs.readdirSync(artifactsDir);
    const solDirs = contractDirs.filter((dir) => {
      const dirPath = path.join(artifactsDir, dir);
      return fs.statSync(dirPath).isDirectory() && dir.endsWith(".sol");
    });

    console.log("📊 ANÁLISIS DE CONTRATOS INDIVIDUALES\n");

    solDirs.forEach((dir, index) => {
      const contractName = dir.replace(".sol", "");
      const artifactPath = path.join(artifactsDir, dir, `${contractName}.json`);

      if (fs.existsSync(artifactPath)) {
        const artifactContent = fs.readFileSync(artifactPath, "utf8");
        const artifact = JSON.parse(artifactContent);

        const bytecode = artifact.bytecode || "";
        const initcodeSize = getInitcodeSize(bytecode);

        results.push({
          contractName,
          initcodeSize,
          initcodeSizeKB: parseFloat(bytesToKB(initcodeSize)),
        });

        console.log(
          `📄 ${index + 1}. ${contractName}: ${parseFloat(
            bytesToKB(initcodeSize)
          )} KB (${initcodeSize} bytes)`
        );
      }
    });

    // Ordenar por tamaño
    results.sort((a, b) => b.initcodeSize - a.initcodeSize);

    console.log("\n📈 RANKING POR TAMAÑO");
    console.log("=".repeat(80));

    results.forEach((contract, index) => {
      const status =
        contract.initcodeSize > 131072
          ? "🚨"
          : contract.initcodeSize > 65536
          ? "⚠️"
          : contract.initcodeSize > 24576
          ? "🟡"
          : "✅";

      console.log(
        `${index + 1}. ${status} ${contract.contractName}: ${
          contract.initcodeSizeKB
        } KB (${contract.initcodeSize} bytes)`
      );
    });

    // Análisis de combinaciones problemáticas
    console.log("\n🔍 ANÁLISIS DE COMBINACIONES PROBLEMÁTICAS");
    console.log("=".repeat(80));

    const targetSize = 118666; // Tamaño del error
    const limitSize = 131072; // Límite de red

    console.log(
      `🎯 Tamaño del error: ${parseFloat(
        bytesToKB(targetSize)
      )} KB (${targetSize} bytes)`
    );
    console.log(
      `🚨 Límite de red: ${parseFloat(
        bytesToKB(limitSize)
      )} KB (${limitSize} bytes)`
    );
    console.log(
      `📊 Diferencia: ${parseFloat(bytesToKB(limitSize - targetSize))} KB (${
        limitSize - targetSize
      } bytes)`
    );

    // Buscar combinaciones que se acerquen al límite
    console.log("\n🔍 COMBINACIONES QUE CAUSAN EL PROBLEMA:");

    let totalSize = 0;
    const problematicContracts = [];

    for (const contract of results) {
      totalSize += contract.initcodeSize;
      problematicContracts.push(contract);

      if (totalSize >= targetSize) {
        console.log(
          `\n📊 Combinación que alcanza ${parseFloat(bytesToKB(totalSize))} KB:`
        );
        problematicContracts.forEach((c, i) => {
          console.log(`   ${i + 1}. ${c.contractName}: ${c.initcodeSizeKB} KB`);
        });
        console.log(
          `   📏 Total: ${parseFloat(
            bytesToKB(totalSize)
          )} KB (${totalSize} bytes)`
        );
        break;
      }
    }

    // Identificar el contrato más problemático
    const largestContract = results[0];
    console.log("\n🎯 CONTRATO MÁS PROBLEMÁTICO:");
    console.log(
      `❌ ${largestContract.contractName}: ${largestContract.initcodeSizeKB} KB`
    );
    console.log(
      `   Este contrato solo ya representa el ${(
        (largestContract.initcodeSize / targetSize) *
        100
      ).toFixed(1)}% del límite`
    );

    // Recomendaciones
    console.log("\n💡 RECOMENDACIONES:");
    console.log("=".repeat(80));

    if (largestContract.initcodeSize > 50000) {
      console.log(
        `1. 🚨 ${largestContract.contractName} es demasiado grande (${largestContract.initcodeSizeKB} KB)`
      );
      console.log("   - Dividir en contratos más pequeños");
      console.log("   - Usar librerías para código reutilizable");
      console.log("   - Optimizar el constructor");
    }

    const contractsOver24KB = results.filter((r) => r.initcodeSize > 24576);
    if (contractsOver24KB.length > 0) {
      console.log(
        `2. ⚠️  ${contractsOver24KB.length} contratos exceden el límite de Ethereum (24KB):`
      );
      contractsOver24KB.forEach((contract) => {
        console.log(
          `   - ${contract.contractName}: ${contract.initcodeSizeKB} KB`
        );
      });
    }

    console.log("3. 🔧 SOLUCIONES INMEDIATAS:");
    console.log("   - Desplegar contratos grandes por separado");
    console.log("   - Usar deployment granular");
    console.log("   - Optimizar contratos con initcode > 50KB");

    console.log("\n✅ Análisis completado!");
  } catch (error) {
    console.error("❌ Error al procesar los archivos:", error.message);
  }
}

// Ejecutar el análisis
analyzeDeploymentSize();
