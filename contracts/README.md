UnitPoints - Ecosistema de Smart Contracts 

Resumen

Este repo contiene un ecosistema de smart contracts para gestionar usuarios, empresas, eventos, tokens por sector, gobernanza y swaps de tokens. A continuación tienes una explicación sencilla de cada contrato y una guía clara para desplegar cada uno con Hardhat Ignition usando los módulos de la carpeta ignition/modules.

Contratos y propósito

- UnitpointsTokens.sol: Token ERC20 por sector (con burn). Se usa para representar puntos del sector. Solo cuentas admin pueden mintear/quemar.
- UserManager.sol: Registra usuarios y gestiona suscripciones a eventos (alta/baja, listado de eventos suscritos).
- CompanyManager.sol: Registra empresas, gestiona su estado y asocia IDs de eventos a cada empresa.
- EventManager.sol: Crea y administra eventos y sus actividades (EARN, REDEEM y VOTE), integra DAO para votaciones.
- DAOGovernance.sol: Crea propuestas y permite votar con poder de voto basado en tenencia de tokens de sector, y ejecutar propuestas aprobadas.
- TokenAdministrator.sol: Orquestador; coordina UserManager, EventManager y DAOGovernance. Suscribe usuarios, maneja actividades y registra tokens de sector.
- TokenSwap.sol: Permite intercambiar tokens del sector por tokens de empresas y viceversa, con tasas, límites, comisiones y manejo de liquidez.

Requisitos previos

- Node.js 16+
- npm o yarn
- Cuenta y clave privada configurada para la red passetHubTestnet

Compilación y tests

- Compilar: npm run compile
- Tests: npm run test, cobertura: npm run coverage

Guía de despliegue con Hardhat Ignition

Los despliegues están organizados por pasos en ignition/modules. Para facilitar, en package.json tienes scripts por contrato del tipo deploy:NombreContrato que llaman al módulo (step) correspondiente. La red objetivo por defecto es passetHubTestnet.

Mapa contrato -> módulo de despliegue

- UserManager -> ignition/modules/UnitPointsEcosystemStep1.ts
- CompanyManager -> ignition/modules/UnitPointsEcosystemStep1.ts
- EventManager -> ignition/modules/UnitPointsEcosystemStep2.ts
- TokenSwap -> ignition/modules/UnitPointsEcosystemStep3.ts
- DAOGovernance -> ignition/modules/UnitPointsEcosystemStep4.ts
- TokenAdministrator -> ignition/modules/UnitPointsEcosystemStep5.ts
- UnitpointsTokens -> ignition/modules/UnitPointsEcosystemStep6.ts

Cómo desplegar

- Desplegar UserManager: npm run deploy:UserManager
- Desplegar CompanyManager: npm run deploy:CompanyManager
- Desplegar EventManager: npm run deploy:EventManager
- Desplegar TokenSwap: npm run deploy:TokenSwap
- Desplegar DAOGovernance: npm run deploy:DAOGovernance
- Desplegar TokenAdministrator: npm run deploy:TokenAdministrator
- Desplegar UnitpointsTokens: npm run deploy:UnitpointsTokens

Direcciones desplegadas (passetHubTestnet - chain 420420422)

- UserManager: 0x4FAB7A85e148E20357026853fB40c3988b1f06FB
- CompanyManager: 0x77BA22891A1847963A3417491819AeD1C6A1E391
- EventManager: 0x69E974fD8FE0016CCDB059f6e1De302Ff690A3A5
- DAOGovernance: 0x665C7F3477B78C83E531c29746e58508a938afbe
- TokenAdministrator: 0xB8aEd07360FeBB97087eE47322B4457A83aD6D54
- UnitpointsTokens: 0x6359B710A473f62A31f5aB74031FC3177e4a7B75
- TokenSwap: no desplegado aún en esta red

Notas importantes

- Step 1 despliega en un mismo módulo dos contratos: UserManager y CompanyManager. Por lo tanto, ejecutar cualquiera de los dos scripts (deploy:UserManager o deploy:CompanyManager) ejecutará el mismo módulo y desplegará ambos si aún no existen. Ignition es idempotente y reutiliza despliegues previos cuando es posible.
- UnitpointsTokens (step 6) requiere parámetros de constructor y el módulo ya los provee: "UnitPoints", "UPT" y la descripción del sector.
- Si necesitas verificar contratos, existe un script de ejemplo para UnitpointsTokens: npm run verify:UnitPoints, que usa el módulo del step 6.

Configuración de red y llaves

- La red passetHubTestnet debe estar configurada en Hardhat/ Ignition. Asegúrate de tener la clave privada de despliegue configurada (por ejemplo, vía variables de entorno) y el RPC correcto.

Estructura relevante

- Contratos: contracts/*.sol
- Módulos de Ignition: ignition/modules/UnitPointsEcosystemStep{1..6}.ts
- Scripts de despliegue (npm): package.json -> scripts deploy:*

Soporte y mantenimiento

- Limpiar cachés: npm run clean
- Nodo local para pruebas: npm run node

1. **Lote 1**: UserManager (10.81 KB)
2. **Lote 2**: TokenAdministrator (26.52 KB)
3. **Lote 3**: EventManager (69.36 KB)
4. **Lote 4**: DAOGovernance (57.94 KB)
5. **Lote 5**: CompanyManager
6. **Lote 6**: TokenSwap (89.03 KB)

### 2. Configuración Automática

Después del deployment, el sistema:

- Configura las referencias entre contratos
- Asigna permisos de administración
- Registra tokens de sector
- Establece las relaciones necesarias

### 3. Tokens Predefinidos

El sistema crea automáticamente:

- **UnitPoints (UPT)**: Token principal de la plataforma
- **Academic Points (ACP)**: Para eventos académicos
- **Music Points (MCP)**: Para eventos musicales

## 🔄 Flujo de Trabajo del Sistema

### 1. Registro de Usuarios

```
Usuario → UserManager.registerUser() → Usuario registrado
```

### 2. Registro de Empresas

```
Empresa → CompanyManager.registerCompany() → Empresa registrada
```

### 3. Creación de Eventos

```
Empresa → EventManager.createEvent() → Evento creado
```

### 4. Participación en Actividades

```
Usuario → TokenAdministrator.participateInActivity() → Puntos otorgados/canjeados
```

### 5. Votaciones DAO

```
Usuario → TokenAdministrator.participateInActivity(VOTE) → DAOGovernance.vote()
```

### 6. Intercambio de Tokens

```
Usuario → TokenSwap.swapSectorTokenToCompanyToken() → Tokens intercambiados
```

## 🔐 Sistema de Permisos

### Roles de Administración

- **Admin**: Control total sobre el contrato
- **EventManager**: Puede crear eventos y actividades
- **TokenAdministrator**: Puede mintear tokens y gestionar participación
- **DAOGovernance**: Puede crear propuestas y ejecutar votaciones

### Seguridad

- Reentrancy guards en funciones críticas
- Validación de parámetros de entrada
- Control de acceso basado en roles
- Custom errors para optimización de gas

### Mapa de permisos concretos

Resumen de qué contratos tienen adminRole sobre otros, qué funciones requieren admin y para qué se usan. Referencia: scripts/scripts de configuración y verificación.

- UserManager
  - Funciones con admin: deactivateUser, reactivateUser, grantAdmin.
  - Admin concedido a: TokenAdministrator.
  - Propósito: permitir al orquestador desactivar/reactivar usuarios si es necesario (gobernanza/abuso) y delegar administración.

- CompanyManager
  - Funciones con admin: addEventToCompany, deactivateCompany, reactivateCompany, grantAdmin.
  - Admin concedido a: EventManager y TokenAdministrator.
  - Propósito: EventManager necesita addEventToCompany al crear eventos; TokenAdministrator puede apoyar administración si se automatiza flujo.

- EventManager
  - Funciones con admin: registerSectorToken, setDAOGovernance, setCompanyManager, incrementActivityParticipants, grantAdmin.
  - Admin concedido a: TokenAdministrator.
  - Propósito: TokenAdministrator registra tokens de sector en EventManager cuando registra un token en el sistema y aumenta participantes al finalizar actividades; la configuración de DAO/CompanyManager se realiza post-deploy por el admin (deployer) vía scripts.

- DAOGovernance
  - Funciones con admin: createProposal, vote, executeProposal, registerSectorToken, grantAdmin.
  - Admin concedido a: EventManager (createProposal desde actividades VOTE) y TokenAdministrator (vote/execute durante participateInActivity/executeDAOProposal).
  - Propósito: EventManager crea propuestas DAO ligadas a actividades; TokenAdministrator emite votos en nombre del usuario suscrito y ejecuta propuestas una vez aprobadas.

- UnitpointsTokens (ERC20 por sector)
  - Funciones con admin: mint, burn, burnFrom, grantAdmin.
  - Admin concedido a: TokenAdministrator.
  - Propósito: orquestador mintea puntos en actividades EARN y quema en REDEEM.

- TokenAdministrator (orquestador)
  - Funciones con admin: setAuxiliaryContracts, registerSectorToken, executeDAOProposal, grantAdmin.
  - Admin: deployer por defecto; puede delegarse según la operación.
  - Propósito: configurar direcciones auxiliares, registrar tokens de sector (propaga registro a EventManager y DAOGovernance) y ejecutar propuestas DAO creadas desde eventos.

- TokenSwap
  - Funciones con admin: registerSwapPair, updateSwapPair, registerSectorToken, updateParameters, grantAdmin.
  - Admin concedido en scripts: no (integración planificada; líneas de integración están comentadas en TokenAdministrator).
  - Propósito: administración de pares de swap y parámetros del AMM simplificado.

Quién llama a qué (resumen)
- EventManager → CompanyManager.addEventToCompany (al crear eventos). Requiere admin en CompanyManager (otorgado a EventManager).
- TokenAdministrator → EventManager.registerSectorToken (al registrar token de sector). Requiere admin en EventManager.
- EventManager → DAOGovernance.createProposal (al crear actividad VOTE). Requiere admin en DAOGovernance.
- TokenAdministrator → DAOGovernance.vote / executeProposal (durante participación y ejecución). Requiere admin en DAOGovernance.
- TokenAdministrator → UnitpointsTokens.mint / burn / burnFrom (EARN/REDEEM). Requiere admin en UnitpointsTokens.

## 📊 Optimizaciones de Gas

### Técnicas Implementadas

- **Custom Errors**: Reducen el tamaño del bytecode
- **Packed Structs**: Optimización de almacenamiento
- **Unchecked Math**: Para operaciones seguras
- **Eventos Optimizados**: Solo datos esenciales
- **Reentrancy Guards**: Protección eficiente

### Tamaños de Contratos

- UserManager: ~10.81 KB
- TokenAdministrator: ~26.52 KB
- EventManager: ~69.36 KB
- DAOGovernance: ~57.94 KB
- TokenSwap: ~89.03 KB

## 🧪 Testing

### Estructura de Tests

```
test/
├── unit/           # Tests unitarios
├── staging/        # Tests de integración
└── MyToken.ts      # Tests de ejemplo
```

### Cobertura de Tests

- Tests unitarios para cada contrato
- Tests de integración del ecosistema
- Tests de casos edge
- Tests de seguridad

## 🌐 Redes Soportadas

### Desarrollo

- **Hardhat Local**: Para desarrollo y testing
- **Localhost**: Para pruebas locales

### Testnet

- **PassetHub Testnet**: Red de prueba de Polkadot

### Configuración de Redes

```typescript
// hardhat.config.ts
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
```

## 📚 Interfaces

### Interfaces Principales

- **IUserManager**: Gestión de usuarios
- **ICompanyManager**: Gestión de empresas
- **IEventManager**: Gestión de eventos
- **IDAOGovernance**: Sistema de gobernanza
- **ITokenSwap**: Intercambio de tokens
- **IUnitpointsTokens**: Tokens de sector

### Beneficios de las Interfaces

- Reducción de dependencias circulares
- Mejor modularidad
- Facilita testing
- Permite actualizaciones sin breaking changes

## 🔧 Configuración Avanzada

### Optimizaciones del Compilador

```typescript
solidity: {
  version: "0.8.28",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    },
    viaIR: true
  }
}
```

### Configuración de Gas

- Límite de gas: 8,000,000
- Precio de gas: Auto
- Timeout: 120,000ms (testnet)

## 🚨 Consideraciones de Seguridad

### Mejores Prácticas Implementadas

- Validación de entrada en todas las funciones
- Protección contra reentrancy
- Control de acceso basado en roles
- Manejo seguro de tokens ERC20
- Validación de fechas y períodos

### Auditoría Recomendada

Antes del deployment en mainnet, se recomienda:

- Auditoría de seguridad completa
- Testing de penetración
- Revisión de código por terceros
- Análisis de gas y optimizaciones

## 📈 Roadmap

### Funcionalidades Futuras

- [ ] Integración con oráculos para datos externos
- [ ] Sistema de staking para tokens
- [ ] Marketplace de NFTs
- [ ] Integración con DeFi protocols
- [ ] Mobile SDK para aplicaciones

### Mejoras Técnicas

- [ ] Implementación de proxy patterns
- [ ] Sistema de upgradeability
- [ ] Optimizaciones adicionales de gas
- [ ] Integración con Layer 2 solutions

## 🤝 Contribución

### Cómo Contribuir

1. Fork del repositorio
2. Crear branch para feature
3. Implementar cambios
4. Ejecutar tests
5. Crear Pull Request

### Estándares de Código

- Solidity 0.8.28
- OpenZeppelin contracts
- Hardhat framework
- TypeScript para scripts

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo LICENSE para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:

- Crear issue en GitHub
- Contactar al equipo de desarrollo
- Revisar documentación técnica

## 🎯 Casos de Uso

### Eventos Académicos

- Conferencias y seminarios
- Cursos y talleres
- Certificaciones
- Networking events

### Eventos Musicales

- Conciertos y festivales
- Talleres de música
- Eventos culturales
- Competencias musicales

### Eventos Corporativos

- Convenciones empresariales
- Team building
- Lanzamientos de productos
- Conferencias de industria

---

**UnitPoints** - Construyendo el futuro de la participación en eventos con tecnología blockchain.
