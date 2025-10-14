# UnitPoints System — Un solo sistema, infinitas recompensas

Demo en producción: https://unitpoints.vercel.app/

Este repositorio reúne el ecosistema completo de UnitPoints, compuesto por:
- Un conjunto de smart contracts (Solidity + Hardhat Ignition) que modelan usuarios, empresas, eventos, gobernanza (DAO), tokens por sector y swaps.
- Un frontend (Next.js) que permite a usuarios y empresas interactuar con el sistema: registro, escaneo de QRs, visualización y redención de puntos, votaciones y más.

## Visión general

UnitPoints es una plataforma universal de eventos y recompensas que unifica la experiencia Web2 (registro con email) y Web3 (wallets y transacciones), creando wallets de forma transparente cuando es necesario. Las comunidades pueden gestionar eventos con múltiples métodos de participación (suscripciones digitales, códigos QR presenciales y actividades virtuales) que generan puntos tokenizados (UPT), redimibles por beneficios o intercambiables con tokens de otras organizaciones. La gobernanza se integra con propuestas y votaciones on-chain.

## Arquitectura del sistema

- Smart Contracts (Solidity 0.8.28, Hardhat + Ignition)
  - Gestión de usuarios, empresas y eventos
  - Tokens por sector (ERC20) con mint/burn
  - Gobernanza DAO (propuestas y votos)
  - Orquestación de actividades y registro de tokens
  - AMM simplificado para swaps de tokens de sector ↔ tokens de empresa
- Frontend (Next.js, React)
  - Conexión de wallet y autenticación (Privy/Wagmi/Polkadot)
  - Escaneo/lectura de QRs para otorgar/redeem puntos
  - Página de pruebas de contratos y flujos
  - Paneles de información, navegación y utilidades
- Integración QR
  - Payload único con metadatos (empresa, puntos, id, validez, firma opcional)
  - Verificación y envío de transacciones al contrato correspondiente

## Estructura del repositorio

- contracts/ → Ecosistema de smart contracts y configuración de Ignition
- unit-points-frontend/ → Aplicación Next.js con páginas, componentes y hooks

## Funcionalidades clave

- Registro y administración de usuarios y empresas
- Creación y gestión de eventos (EARN, REDEEM, VOTE)
- Tokens de sector (UPT y otros) con mint/burn controlado
- Gobernanza con propuestas y votaciones on-chain
- Orquestación de actividades: participación y ejecución de propuestas
- Swaps entre tokens de sector y tokens de empresas (AMM simplificado)
- Flujo completo con QRs: emisión de puntos, escaneo y registro on-chain

---

# Smart Contracts

Ubicación: `contracts/contracts/*.sol`

### Contratos y propósito

- UnitpointsTokens.sol: Token ERC20 por sector (con burn). Solo cuentas admin pueden mintear/quemar.
- UserManager.sol: Registra usuarios y gestiona suscripciones a eventos.
- CompanyManager.sol: Registra empresas, gestiona su estado y asocia IDs de eventos a cada empresa.
- EventManager.sol: Crea y administra eventos y actividades (EARN, REDEEM, VOTE); integra la DAO para votaciones.
- DAOGovernance.sol: Propuestas y votaciones; poder de voto vinculado a tenencia de tokens de sector.
- TokenAdministrator.sol: Orquestador; coordina UserManager, EventManager y DAOGovernance. Suscribe usuarios, maneja actividades y registra tokens de sector.
- TokenSwap.sol: AMM simplificado para intercambiar tokens del sector por tokens de empresas y viceversa.

### Mapa de permisos (resumen)

- UserManager: admin concedido a TokenAdministrator.
- CompanyManager: admin concedido a EventManager y TokenAdministrator.
- EventManager: admin concedido a TokenAdministrator.
- DAOGovernance: admin concedido a EventManager (crear propuestas desde actividades) y TokenAdministrator (vote/execute).
- UnitpointsTokens: admin concedido a TokenAdministrator (mint/burn).
- TokenAdministrator: configura contratos auxiliares, registra tokens de sector y ejecuta propuestas DAO.
- TokenSwap: gestiona pares, parámetros y tokens registrados (integración planificada en TokenAdministrator).

### Flujo de trabajo (alto nivel)

1) Registro de usuarios → UserManager
2) Registro de empresas → CompanyManager
3) Creación de eventos → EventManager
4) Participación en actividades → TokenAdministrator
5) Votaciones DAO (VOTE) → DAOGovernance
6) Intercambio de tokens → TokenSwap

### Optimización de gas y seguridad

- Custom errors, structs empaquetados, unchecked math cuando aplica
- Reentrancy guards y control de acceso basado en roles
- Validación de parámetros y fechas

### Compilación y tests

- Compilar: `npm run compile`
- Tests: `npm run test`
- Cobertura: `npm run coverage`

### Redes soportadas y configuración

Desarrollo:
- Hardhat local, nodo localhost (`npm run node`)

Testnet:
- PassetHub Testnet (Polkadot, EVM compatible)

Ejemplo de configuración (hardhat.config.ts):

```ts
networks: {
  hardhat: {
    allowUnlimitedContractSize: true
  },
  localhost: {
    url: "http://127.0.0.1:8545/"
  },
  passetHubTestnet: {
    polkavm: true,
    url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
    accounts: [privateKey]
  }
}
solidity: {
  version: "0.8.28",
  settings: {
    optimizer: { enabled: true, runs: 200 },
    viaIR: true
  }
}
```

### Despliegue con Hardhat Ignition

Los despliegues están organizados por pasos en `contracts/ignition/modules/UnitPointsEcosystemStep{1..6}.ts`. En `package.json` existen scripts por contrato (`deploy:*`) que invocan el módulo correspondiente.

Mapa contrato → módulo
- Step 1: UserManager y CompanyManager → `UnitPointsEcosystemStep1.ts`
- Step 2: EventManager → `UnitPointsEcosystemStep2.ts`
- Step 3: TokenSwap → `UnitPointsEcosystemStep3.ts`
- Step 4: DAOGovernance → `UnitPointsEcosystemStep4.ts`
- Step 5: TokenAdministrator → `UnitPointsEcosystemStep5.ts`
- Step 6: UnitpointsTokens → `UnitPointsEcosystemStep6.ts`

Comandos de despliegue (ejemplos):
- `npm run deploy:UserManager`
- `npm run deploy:CompanyManager`
- `npm run deploy:EventManager`
- `npm run deploy:TokenSwap`
- `npm run deploy:DAOGovernance`
- `npm run deploy:TokenAdministrator`
- `npm run deploy:UnitpointsTokens`

Notas:
- Step 1 despliega UserManager y CompanyManager juntos; Ignition es idempotente.
- UnitpointsTokens (step 6) provee constructor: "UnitPoints", "UPT" y descripción del sector.
- Verificación de contratos: ejemplo `npm run verify:UnitPoints` para UnitpointsTokens.

### Direcciones desplegadas (PassetHub Testnet — chain 420420422)

- UserManager: `0x4FAB7A85e148E20357026853fB40c3988b1f06FB`
- CompanyManager: `0x77BA22891A1847963A3417491819AeD1C6A1E391`
- EventManager: `0x69E974fD8FE0016CCDB059f6e1De302Ff690A3A5`
- DAOGovernance: `0x665C7F3477B78C83E531c29746e58508a938afbe`
- TokenAdministrator: `0xB8aEd07360FeBB97087eE47322B4457A83aD6D54`
- UnitpointsTokens: `0x6359B710A473f62A31f5aB74031FC3177e4a7B75`
- TokenSwap: (pendiente en esta red)

---

# Frontend (Next.js)

Ubicación: `unit-points-frontend/`

### Resumen

Interfaz para usuarios y empresas que:
- Conecta wallets y gestiona autenticación (por ejemplo, Privy)
- Escanea/lee QRs y procesa payloads para otorgar o redimir puntos
- Expone páginas de pruebas de lectura/escritura de contratos
- Integra navegación, componentes UI y hooks Web3

### Inicio rápido (desarrollo local)

1) Clonar e instalar dependencias:
```bash
npm install
```

2) Variables de entorno (ejemplo `.env.local`):
```env
NEXT_PUBLIC_PRIVY_APP_ID=tu_app_id_de_privy
NEXT_PUBLIC_PRIVY_AUTH_URL=https://api.privy.io
# Añade RPC, direcciones de contratos y otras variables necesarias
```

3) Ejecutar entorno de desarrollo:
```bash
npm run dev
```

4) Abrir `http://localhost:3000` y navegar a `/test` para la UI de pruebas de contratos.

### Páginas y componentes relevantes

- Páginas: `app/` (home, dashboard, events, swap, test, auth, about, glossary)
- Componentes: `components/` (Qr, landing, navbar, wallet, ui, etc.)
- Hooks y contratos: `hooks/contracts-frontend/` (scripts, abis, addresses) y `hooks/contracts/`
- Configuración de red y utilidades: `lib/`

### Flujo QR (MVP)

1) Empresa crea evento o compra
2) Genera QR con payload único (empresa, puntos, id, validez, firma opcional)
3) Usuario escanea el QR → el frontend verifica y envía transacción
4) El contrato suma puntos a la wallet del usuario
5) El usuario consulta puntos y los redime por recompensas

---

# Modelo de ingresos (resumen)

1) Venta de puntos (packs para empresas, con markup)
2) Tarifa por redención (fee pequeño por transacción)
3) Planes empresariales (SaaS)
4) Publicidad en la app (recompensas patrocinadas)
5) Servicios de data & analítica premium
6) Tokenización futura (interoperabilidad y fees por intercambio)

---

# Escalabilidad y roadmap

- Fase 1: Universidades y eventos culturales
- Fase 2: Comercios privados (cafeterías, librerías, coworkings)
- Fase 3: Ecosistema interoperable regional (tokenización y mercado secundario)

Mejoras técnicas previstas:
- Integración con oráculos
- Sistema de staking
- Marketplace de NFTs
- Integración con protocolos DeFi
- Mobile SDK
- Proxy patterns y upgradeability
- Optimizaciones adicionales de gas
- Integración con soluciones L2

---

# Testing y calidad

- Tests unitarios y de integración para contratos (`contracts/test/`)
- UI de pruebas en el frontend (`/test`)
- Cobertura y herramientas de verificación

---

# Recursos y referencias

- Demo pública: https://unitpoints.vercel.app/
- Documentación y guías en `contracts/README.md` y `unit-points-frontend/README.md`
- Video pitch y documentación adicional (ver README del frontend)

---

# Contribución

1) Haz fork del repositorio
2) Crea un branch por funcionalidad
3) Implementa cambios y ejecuta tests
4) Abre un Pull Request

Estándares:
- Solidity 0.8.28, OpenZeppelin, Hardhat
- TypeScript para scripts y frontend
- Buenas prácticas de seguridad y optimización de gas

---

# Licencia

Proyecto bajo licencia MIT. Consulta `LICENSE` para más detalles.