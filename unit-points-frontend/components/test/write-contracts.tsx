"use client"

import { useEffect, useState } from "react"
import { Address } from "viem"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useWaitForTransactionReceipt } from "wagmi"
import { useAuth } from "@/hooks/core/use-auth"

// Hooks de escritura
import { useRegisterUser, isUserRegistered, isUserSubscribed } from "@/hooks/contracts-frontend/scripts/userManager"
import { useRegisterCompany, isActiveCompany } from "@/hooks/contracts-frontend/scripts/companyManager"
import { useSubscribeToEvent, useParticipateInActivity } from "@/hooks/contracts-frontend/scripts/tokenAdministrator"
import { useApprove, useTransfer } from "@/hooks/contracts-frontend/scripts/unitPointsTokens"
import { CONTRACT_ADDRESSES } from "@/hooks/contracts-frontend/addresses"

function TxStatus({ hash }: { hash?: `0x${string}` }) {
  const { data: receipt, isLoading, isSuccess, error } = useWaitForTransactionReceipt({ hash })
  if (!hash) return null
  return (
    <div className="mt-2 text-xs">
      <div>Hash: {hash}</div>
      {isLoading && <div>Confirmando transacción...</div>}
      {error && <div className="text-red-500">Error esperando confirmación: {String(error.message)}</div>}
      {isSuccess && (
        <div className="text-green-600">Confirmada en bloque {receipt?.blockNumber?.toString()}</div>
      )}
    </div>
  )
}

export function WriteContracts() {
  // Autenticación: requerir wallet conectada antes de enviar transacciones
  const { authenticated, userAddress, login, isLoading } = useAuth()
  const isConnected = authenticated && !!userAddress
  // Validación: verificar si el usuario está registrado on-chain
  const userRegisteredHook = isUserRegistered(userAddress as Address)
  // Estado de compañía activa (para el botón de registrar empresa)
  const activeCompanyHook = isActiveCompany(userAddress as Address)

  // Estados locales para formularios
  const [companyName, setCompanyName] = useState("")
  const [companyDesc, setCompanyDesc] = useState("")
  const [eventIdStr, setEventIdStr] = useState("")
  const eventId = eventIdStr ? BigInt(eventIdStr) : (undefined as unknown as bigint)
  // Validación: verificar si el usuario está suscrito al evento seleccionado (depende de eventId)
  const userSubscribedHook = isUserSubscribed(userAddress as Address, eventId as bigint)
  const [activityName, setActivityName] = useState("")
  const [support, setSupport] = useState<boolean>(true)
  // Spender fijo: TokenAdministrator
  const [spender] = useState<string>(CONTRACT_ADDRESSES.tokenAdministrator)
  const [approveAmountStr, setApproveAmountStr] = useState("")
  const approveAmount = approveAmountStr ? BigInt(approveAmountStr) : (undefined as unknown as bigint)
  const [transferTo, setTransferTo] = useState<string>("")
  const [transferAmountStr, setTransferAmountStr] = useState("")
  const transferAmount = transferAmountStr ? BigInt(transferAmountStr) : (undefined as unknown as bigint)

  // Hooks de escritura
  const { registerUser, isPending: isRegUserPending, error: regUserError } = useRegisterUser()
  const { registerCompany, isPending: isRegCompanyPending, error: regCompanyError } = useRegisterCompany()
  const { subscribeToEvent, isPending: isSubscribePending, error: subscribeError } = useSubscribeToEvent()
  const { participateInActivity, isPending: isParticipatePending, error: participateError } = useParticipateInActivity()
  const { approve, isPending: isApprovePending, error: approveError } = useApprove()
  const { transfer, isPending: isTransferPending, error: transferError } = useTransfer()

  // Hashes de transacciones para seguimiento
  const [txRegisterUser, setTxRegisterUser] = useState<`0x${string}` | undefined>()
  const [txRegisterCompany, setTxRegisterCompany] = useState<`0x${string}` | undefined>()
  const [txSubscribe, setTxSubscribe] = useState<`0x${string}` | undefined>()
  const [txParticipate, setTxParticipate] = useState<`0x${string}` | undefined>()
  const [txApprove, setTxApprove] = useState<`0x${string}` | undefined>()
  const [txTransfer, setTxTransfer] = useState<`0x${string}` | undefined>()
  // Mensajes de validación
  const [subscribeMsg, setSubscribeMsg] = useState<string | null>(null)
  const [participateMsg, setParticipateMsg] = useState<string | null>(null)

  // Estados de verificación para deshabilitar botones mientras se consulta
  const isCheckingRegistration = Boolean(userRegisteredHook?.isLoading || userRegisteredHook?.isFetching)
  const isCheckingSubscription = Boolean(userSubscribedHook?.isLoading || userSubscribedHook?.isFetching)
  const isCheckingCompany = Boolean(activeCompanyHook?.isLoading || activeCompanyHook?.isFetching)


  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Aviso de autenticación */}
      {!isConnected && (
        <Card className="md:col-span-2 border-yellow-400">
          <CardHeader>
            <CardTitle>Conecta tu wallet</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-sm">Verificando estado de autenticación...</div>
            ) : (
              <div className="text-sm">
                Para enviar transacciones necesitas estar autenticado y tener una wallet conectada.
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => login()}>Conectar / Login</Button>
          </CardFooter>
        </Card>
      )}
      {/* Registrar usuario */}
      <Card>
        <CardHeader>
          <CardTitle>Registrar usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={async () => { if (!isConnected) return; const hash = await registerUser(); setTxRegisterUser(hash as `0x${string}`) }} disabled={isRegUserPending || !isConnected || isCheckingRegistration || userRegisteredHook?.data === true}>
            {isRegUserPending ? "Enviando..." : "Registrar"}
          </Button>
          {isCheckingRegistration && (
            <div className="text-xs mt-2 text-muted-foreground">Verificando registro...</div>
          )}
          {userRegisteredHook?.data === true && (
            <div className="text-green-600 text-xs mt-2">Ya estás registrado como usuario.</div>
          )}
          {regUserError && <div className="text-red-500 text-xs mt-2">Error: {String(regUserError.message)}</div>}
          <TxStatus hash={txRegisterUser} />
        </CardContent>
      </Card>

      {/* Registrar empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Registrar empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Nombre</Label>
          <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Inc." />
          <Label>Descripción</Label>
          <Input value={companyDesc} onChange={(e) => setCompanyDesc(e.target.value)} placeholder="Empresa demo" />
        </CardContent>
        <CardFooter>
          <Button onClick={async () => {
            if (!isConnected) return
            const hash = await registerCompany(companyName, companyDesc)
            setTxRegisterCompany(hash as `0x${string}`)
          }} disabled={
            isRegCompanyPending ||
            !companyName?.trim() ||
            !isConnected ||
            isCheckingCompany ||
            activeCompanyHook?.data === true
          }>
            {isRegCompanyPending ? "Enviando..." : "Registrar empresa"}
          </Button>
          {isCheckingCompany && (
            <div className="text-xs ml-2 text-muted-foreground">Verificando estado de compañía...</div>
          )}
          {activeCompanyHook?.data === true && (
            <div className="text-amber-600 text-xs ml-2">Ya eres una empresa activa.</div>
          )}
          {regCompanyError && <div className="text-red-500 text-xs ml-2">Error: {String(regCompanyError.message)}</div>}
          <TxStatus hash={txRegisterCompany} />
        </CardFooter>
      </Card>

      {/* Suscribirse a evento */}
      <Card>
        <CardHeader>
          <CardTitle>Suscribirse a evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Event ID</Label>
          <Input type="number" value={eventIdStr} onChange={(e) => setEventIdStr(e.target.value)} placeholder="ej. 1" />
        </CardContent>
        <CardFooter>
          <Button onClick={async () => {
            setSubscribeMsg(null)
            if (!isConnected || !eventId) return
            // Verificar registro del usuario antes de enviar la transacción
            const regCheck = await userRegisteredHook?.refetch?.()
            if (regCheck?.data !== true) {
              setSubscribeMsg("Debes estar registrado para suscribirte a eventos.")
              return
            }
            const hash = await subscribeToEvent(eventId)
            setTxSubscribe(hash as `0x${string}`)
          }} disabled={isSubscribePending || !eventIdStr || !isConnected || isCheckingRegistration}>
            {isSubscribePending ? "Enviando..." : "Suscribirse"}
          </Button>
          {subscribeError && <div className="text-red-500 text-xs ml-2">Error: {String(subscribeError.message)}</div>}
          {isCheckingRegistration && <div className="text-xs ml-2 text-muted-foreground">Verificando registro...</div>}
          {subscribeMsg && <div className="text-red-500 text-xs ml-2">{subscribeMsg}</div>}
          <TxStatus hash={txSubscribe} />
        </CardFooter>
      </Card>

      {/* Participar en actividad (ej. voto) */}
      <Card>
        <CardHeader>
          <CardTitle>Participar en actividad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Event ID</Label>
          <Input type="number" value={eventIdStr} onChange={(e) => setEventIdStr(e.target.value)} placeholder="ej. 1" />
          <Label>Nombre de actividad</Label>
          <Input value={activityName} onChange={(e) => setActivityName(e.target.value)} placeholder="vote-proposal" />
          <div className="flex items-center gap-2">
            <Label>Support</Label>
            <Button variant="secondary" onClick={() => setSupport((s) => !s)}>{support ? "true" : "false"}</Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={async () => {
            setParticipateMsg(null)
            if (!isConnected || !eventId || !activityName) return
            // Verificar registro del usuario antes de enviar la transacción
            const regCheck2 = await userRegisteredHook?.refetch?.()
            if (regCheck2?.data !== true) {
              setParticipateMsg("Debes estar registrado para participar en actividades.")
              return
            }
            // Verificar suscripción del usuario al evento antes de participar
            const subCheck = await userSubscribedHook?.refetch?.()
            if (subCheck?.data !== true) {
              setParticipateMsg("Debes estar suscrito al evento para participar en actividades.")
              return
            }
            const hash = await participateInActivity(eventId, activityName, support)
            setTxParticipate(hash as `0x${string}`)
          }} disabled={isParticipatePending || !eventIdStr || !activityName || !isConnected || isCheckingRegistration || isCheckingSubscription}>
            {isParticipatePending ? "Enviando..." : "Participar"}
          </Button>
          {participateError && <div className="text-red-500 text-xs ml-2">Error: {String(participateError.message)}</div>}
          {(isCheckingRegistration || isCheckingSubscription) && (
            <div className="text-xs ml-2 text-muted-foreground">
              {isCheckingRegistration ? "Verificando registro... " : ""}
              {isCheckingSubscription ? "Verificando suscripción..." : ""}
            </div>
          )}
          {participateMsg && <div className="text-red-500 text-xs ml-2">{participateMsg}</div>}
          <TxStatus hash={txParticipate} />
        </CardFooter>
      </Card>

      {/* Aprobar gasto de tokens */}
      <Card>
        <CardHeader>
          <CardTitle>Aprobar tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Spender (TokenAdministrator - fijo)</Label>
          <Input placeholder="0x..." value={spender} readOnly disabled />
          <Label>Monto (entero)</Label>
          <Input type="number" placeholder="100" value={approveAmountStr} onChange={(e) => setApproveAmountStr(e.target.value)} />
        </CardContent>
        <CardFooter>
          <Button onClick={async () => { if (!isConnected || !approveAmount) return; const hash = await approve(spender as Address, approveAmount as bigint); setTxApprove(hash as `0x${string}`) }} disabled={isApprovePending || !approveAmountStr || !isConnected}>
            {isApprovePending ? "Enviando..." : "Aprobar"}
          </Button>
          {approveError && <div className="text-red-500 text-xs ml-2">Error: {String(approveError.message)}</div>}
          <TxStatus hash={txApprove} />
        </CardFooter>
      </Card>

      {/* Transferir tokens */}
      <Card>
        <CardHeader>
          <CardTitle>Transferir tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>To</Label>
          <Input placeholder="0x..." value={transferTo} onChange={(e) => setTransferTo(e.target.value)} />
          <Label>Monto (entero)</Label>
          <Input type="number" placeholder="50" value={transferAmountStr} onChange={(e) => setTransferAmountStr(e.target.value)} />
        </CardContent>
        <CardFooter>
          <Button onClick={async () => { if (!isConnected || !transferTo || !transferAmount) return; const hash = await transfer(transferTo as Address, transferAmount as bigint); setTxTransfer(hash as `0x${string}`) }} disabled={isTransferPending || !transferTo || !transferAmountStr || !isConnected}>
            {isTransferPending ? "Enviando..." : "Transferir"}
          </Button>
          {transferError && <div className="text-red-500 text-xs ml-2">Error: {String(transferError.message)}</div>}
          <TxStatus hash={txTransfer} />
        </CardFooter>
      </Card>
    </div>
  )
}