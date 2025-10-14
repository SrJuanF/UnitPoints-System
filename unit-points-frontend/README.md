# UnitPoints — Un solo sistema, infinitas recompensas

Demo en producción: https://unitpoints.vercel.app/

## Contenido

- Resumen del proyecto
- Problema a resolver
- Idea y cómo funciona UnitPoints
- MVP: alcance, flujo y casos de uso
- Funcionalidades técnicas (smart contracts, frontend, QR)
- Modelo de ingresos (rediseñado)
- Escalabilidad y roadmap
- Recursos y referencias
- Inicio rápido, UI de pruebas y despliegue
- Contribución y licencia

---

## Resumen del proyecto

UnitPoints es una plataforma universal de eventos y recompensas que hace accesible la transparencia y seguridad de la blockchain a cualquier persona, sin fricción ni jerga técnica. Unifica la experiencia Web2 (registro con email) con capacidades Web3 (wallets y transacciones) mediante la creación automática de wallets como puente invisible. Las comunidades pueden gestionar eventos con múltiples métodos de participación (suscripciones digitales, códigos QR presenciales y actividades virtuales) que generan puntos tokenizados (UPT), redimibles por beneficios o intercambiables con tokens de otras organizaciones. La gobernanza puede integrarse mediante estructuras tipo DAO donde propuestas y actividades se votan colectivamente según la participación.

## 🛑 Problema a Resolver

En Latinoamérica los sistemas de fidelización actuales (puntos bancarios, retail, aerolíneas, Puntos Colombia, etc.) tienen varios problemas:

- Fragmentación: cada marca tiene su propio sistema → el usuario acumula puntos en silos.
- Poca transparencia: el usuario nunca sabe exactamente cuándo expiran, cómo se calculan o si hay manipulación en las reglas.
- Fricción: los puntos suelen ser difíciles de redimir y con reglas poco claras.
- Centralización: la empresa emisora controla todo, lo que reduce confianza y limita el uso en múltiples sectores.

## 💡 Idea — Cómo funciona UnitPoints

UnitPoints es un sistema de fidelización transversal basado en blockchain, donde cualquier empresa puede otorgar puntos a sus clientes mediante QRs únicos y los usuarios pueden acumularlos y redimirlos de forma transparente.

- Empresas → definen reglas de otorgamiento de puntos.
- Usuarios → acumulan puntos en una wallet y los canjean por recompensas.
- Blockchain → garantiza transparencia, interoperabilidad y trazabilidad.

### ✅ Beneficios principales

- Unificación entre múltiples emisores.
- Flexibilidad en reglas por empresa.
- Transparencia on-chain de puntos y redenciones.
- Gamificación transversal para distintos contextos.

---

## ⚡ MVP — Sistema de Puntos con QRs

El MVP valida el flujo extremo a extremo: emisión de puntos por empresas, escaneo QR por usuarios y asignación en blockchain.

### Actores

- Empresa afiliada: genera QRs para asignar puntos según su propia lógica.
- Usuario: escanea QRs y acumula puntos en su wallet.
- UnitPoints: smart contract que gestiona puntos y redenciones.

### Flujo básico

1. La empresa crea un evento o compra.
2. Genera un QR único con valor en puntos y metadatos.
3. Usuario escanea QR → el frontend procesa el payload y envía transacción al smart contract.
4. El contrato suma los puntos en la wallet del usuario.
5. Usuario consulta puntos y los redime por recompensas disponibles.

### Casos de uso (MVP)

- Retail: café universitario da 10 puntos por compra.
- Universidad: asistencia a eventos del campus, canje por talleres.
- Eventos masivos: stands con QR que suman puntos acumulativos.

### Funcionalidades MVP (técnicas)

Smart Contract (testnet sugerido: Paseo de Polkadot o una testnet EVM):

- addPoints(address user, uint amount)
- getPoints(address user)
- redeemPoints(address user, uint rewardId)
- Eventos emitidos: PointsAdded, PointsRedeemed, RewardCreated, etc.

Frontend (Next.js, React, Wagmi / Polkadot.js API):

- Página `/test` para pruebas: conectar wallet, escanear QR, ver y redimir puntos.
- Integración de QR scanner o lector de payloads.

Sistema QR:

- Cada QR contiene payload único (empresa, puntos, id, validez, firma opcional).
- Frontend verifica y envía la transacción que invoca al smart contract para asignar puntos.

---

## 💸 Modelo de Ingresos (rediseñado)

1. Venta de Puntos (Core B2B)

- Empresas compran packs de puntos; UnitPoints aplica un markup (3–7%).

2. Tarifa por Redención (fee de operación)

- Comisión pequeña (0.5–1%) sobre la transacción de canje entre comercios y usuarios.

3. Planes Empresariales (SaaS opcional)

- Free/Básico: dashboard simple y un canal de distribución.
- Pro ($99/mes): múltiples canales, API, integraciones POS, roles.
- Enterprise: analítica, white-label, soporte.

4. Publicidad en la App

- Sponsored rewards y opciones de destaque en catálogo.

5. Servicios de Data & Analítica Premium

- Reportes anonimizados y paneles de insights para instituciones.

6. Tokenización futura

- Representación de puntos como token estable: interoperabilidad, conversión y fees por intercambio.

### Ejemplo ilustrativo de ingresos

- Universidad compra 100k puntos por $1,000 → UnitPoints gana $50 (markup).
- Estudiantes canjean 20k puntos → fee de redención $20.
- Universidad en plan Pro → $99/mes.
- Librería paga $50 por destaque.

---

## 🌍 Escalabilidad y roadmap

- Fase 1: Universidades y eventos culturales.
- Fase 2: Comercios privados (cafeterías, librerías, coworkings).
- Fase 3: Ecosistema interoperable regional (tokenización y mercado secundario).

---

## Recursos y referencias

- Video pitch: https://drive.google.com/file/d/15xu5gkk264PrusN7qU5ixsh-5oSoaUmi/view
- Documento de referencia: https://docs.google.com/document/d/1-Xd_WUdUN4qzpjXqweqTdUJVXniwDmBRlQ10W3Xsw2c/edit?usp=sharing

---

## Inicio rápido (desarrollo local)

1. Clona el repositorio:

```bash
git clone https://github.com/SrJuanF/UnitPoints-System/unit-points-frontend
cd UnitPoints
```

2. Instala dependencias:

```bash
npm install
```

3. Configura variables de entorno (ejemplo `.env.local`):

```bash
NEXT_PUBLIC_PRIVY_APP_ID=tu_app_id_de_privy
NEXT_PUBLIC_PRIVY_AUTH_URL=https://api.privy.io
# Añade RPC, direcciones de contratos y otras variables necesarias
```

4. Inicia el entorno de desarrollo:

```bash
npm run dev
```

5. Abre `http://localhost:3000` y navega a `/test` para la UI de pruebas de contratos.

---

## UI de pruebas de contratos (detalles)

- Lectura: `components/test/read-contracts.tsx`.
- Escritura: `components/test/write-contracts.tsx`.
- Scripts y direcciones/ABIs: `hooks/contracts-frontend/scripts/`, `hooks/contracts-frontend/addresses/`, `hooks/contracts-frontend/abis/`.

---

## Despliegue

- Vercel detecta automáticamente proyectos Next.js. Configura variables de entorno en Vercel (Production y Preview).
- Demo público: https://unitpoints.vercel.app/

---

