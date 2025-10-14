"use client"

import { useState } from "react"
import { Address } from "viem"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// CompanyManager reads
import { isActiveCompany, getCompany, getCompanyEvents } from "@/hooks/contracts-frontend/scripts/companyManager"
// EventManager reads
import { useGetEventInfo, useGetActivityInfo, useGetEventActivities, useGetNextEventId } from "@/hooks/contracts-frontend/scripts/eventManager"
// UnitPointsTokens reads
import { balanceOf } from "@/hooks/contracts-frontend/scripts/unitPointsTokens"
// UserManager reads
import { isUserRegistered, isUserSubscribed, getUserSubscribedEvents, getUser } from "@/hooks/contracts-frontend/scripts/userManager"
import { useReadContract } from "wagmi"
import UnitPointsTokensABI from "@/hooks/contracts-frontend/abis/UnitPointsTokens.json"
import { CONTRACT_ADDRESSES } from "@/hooks/contracts-frontend/addresses"

// Helper para serializar objetos que contienen BigInt
function stringifySafe(value: any) {
  try {
    return JSON.stringify(
      value,
      (_, v) => (typeof v === "bigint" ? v.toString() : v),
      2
    )
  } catch (e) {
    return String(value)
  }
}

function Field({ label, value, loading }: { label: string; value: string; loading?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2 items-center">
      <Label>{label}</Label>
      <div className="text-sm">{loading ? "Cargando..." : value}</div>
    </div>
  )
}

// Helpers de formateo para EventManager
function formatTimestamp(v?: unknown) {
  if (v === undefined || v === null) return "-"
  const n = typeof v === "bigint" ? Number(v) : Number(v)
  if (!Number.isFinite(n)) return String(v)
  try {
    return new Date(n * 1000).toLocaleString()
  } catch {
    return String(v)
  }
}

function RenderEventInfo({ data }: { data: any }) {
  if (!data) return <div className="text-sm">-</div>
  const [eventId, company, name, description, sectorId, startDate, endDate, isActive] = data as [
    bigint,
    string,
    string,
    string,
    bigint,
    bigint,
    bigint,
    boolean
  ]
  return (
    <div className="text-sm space-y-1">
      <div><span className="font-medium">ID:</span> {String(eventId)}</div>
      <div><span className="font-medium">Empresa:</span> {company}</div>
      <div><span className="font-medium">Nombre:</span> {name}</div>
      <div><span className="font-medium">Descripción:</span> {description}</div>
      <div><span className="font-medium">Sector ID:</span> {String(sectorId)}</div>
      <div><span className="font-medium">Inicio:</span> {formatTimestamp(startDate)} ({String(startDate)})</div>
      <div><span className="font-medium">Fin:</span> {formatTimestamp(endDate)} ({String(endDate)})</div>
      <div><span className="font-medium">Activo:</span> {String(isActive)}</div>
    </div>
  )
}

function RenderUserInfo({ data }: { data: any }) {
  if (!data) return <div className="text-sm">-</div>
  const [address, registered, events] = data as [
    string,
    boolean,
    Array<bigint | string | number>
  ]
  return (
    <div className="text-sm space-y-1">
      <div><span className="font-medium">Dirección:</span> {address}</div>
      <div><span className="font-medium">Registrado:</span> {String(registered)}</div>
      <div>
        <span className="font-medium">Eventos suscritos:</span>
        {Array.isArray(events) && events.length > 0 ? (
          <ul className="list-disc pl-5 mt-1">
            {events.map((e, idx) => (
              <li key={`${String(e)}-${idx}`}>{String(e)}</li>
            ))}
          </ul>
        ) : (
          <span> -</span>
        )}
      </div>
    </div>
  )
}

const ACTIVITY_TYPE_LABEL: Record<number, string> = {
  0: "REDEEM",
  1: "EARN",
  2: "VOTE",
}

function RenderActivityInfo({ data }: { data: any }) {
  if (!data) return <div className="text-sm">-</div>
  const [isActive, activityType, pointsReward, pointsCost, maxParticipants, currentParticipants, proposalId] = data as [
    boolean,
    number,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint
  ]
  return (
    <div className="text-sm space-y-1">
      <div><span className="font-medium">Activa:</span> {String(isActive)}</div>
      <div><span className="font-medium">Tipo:</span> {ACTIVITY_TYPE_LABEL[activityType] ?? String(activityType)}</div>
      <div><span className="font-medium">Puntos recompensa:</span> {String(pointsReward)}</div>
      <div><span className="font-medium">Puntos costo:</span> {String(pointsCost)}</div>
      <div><span className="font-medium">Máx. participantes:</span> {String(maxParticipants)}</div>
      <div><span className="font-medium">Participantes actuales:</span> {String(currentParticipants)}</div>
      <div><span className="font-medium">ID de propuesta:</span> {String(proposalId)}</div>
    </div>
  )
}

// CompanyManager formatting
function RenderCompanyInfo({ data }: { data: any }) {
  if (!data) return <div className="text-sm">-</div>
  const company = data as {
    companyAddress?: string
    name?: string
    description?: string
    isActive?: boolean
    eventIds?: Array<bigint | string | number>
  }
  return (
    <div className="text-sm space-y-1">
      <div><span className="font-medium">Dirección:</span> {company.companyAddress ?? "-"}</div>
      <div><span className="font-medium">Nombre:</span> {company.name ?? "-"}</div>
      <div><span className="font-medium">Descripción:</span> {company.description ?? "-"}</div>
      <div><span className="font-medium">Activa:</span> {company.isActive === undefined ? "-" : String(company.isActive)}</div>
      <div>
        <span className="font-medium">Eventos (IDs):</span>
        {Array.isArray(company.eventIds) && company.eventIds.length > 0 ? (
          <ul className="list-disc pl-5 mt-1">
            {company.eventIds.map((id, idx) => (
              <li key={`${String(id)}-${idx}`}>{String(id)}</li>
            ))}
          </ul>
        ) : (
          <span> -</span>
        )}
      </div>
    </div>
  )
}

export function ReadContracts() {
  // INFO BÁSICA DEL TOKEN con estados (usando useReadContract directamente)
  const nameHook = useReadContract({
    address: CONTRACT_ADDRESSES.unitPointsTokens,
    abi: UnitPointsTokensABI,
    functionName: "name",
  })
  const symbolHook = useReadContract({
    address: CONTRACT_ADDRESSES.unitPointsTokens,
    abi: UnitPointsTokensABI,
    functionName: "symbol",
  })
  const decimalsHook = useReadContract({
    address: CONTRACT_ADDRESSES.unitPointsTokens,
    abi: UnitPointsTokensABI,
    functionName: "decimals",
  })
  const totalSupplyHook = useReadContract({
    address: CONTRACT_ADDRESSES.unitPointsTokens,
    abi: UnitPointsTokensABI,
    functionName: "totalSupply",
  })
  const sectorDescHook = useReadContract({
    address: CONTRACT_ADDRESSES.unitPointsTokens,
    abi: UnitPointsTokensABI,
    functionName: "sectorDescription",
  })

  // balanceOf & allowance inputs
  const [balanceAddress, setBalanceAddress] = useState<string>("")
  const balanceHook = balanceOf(balanceAddress as Address)

  const [ownerAddress, setOwnerAddress] = useState<string>("")
  const [spenderAddress, setSpenderAddress] = useState<string>("")
  const allowanceHook = useReadContract({
    address: CONTRACT_ADDRESSES.unitPointsTokens,
    abi: UnitPointsTokensABI,
    functionName: "allowance",
    args: [ownerAddress as Address, spenderAddress as Address],
    query: { enabled: !!ownerAddress && !!spenderAddress },
  })

  // CompanyManager inputs
  const [companyAddr, setCompanyAddr] = useState<string>("")
  const isActiveCompanyHook = isActiveCompany(companyAddr as Address)
  const companyInfoHook = getCompany(companyAddr as Address)
  const companyEventsHook = getCompanyEvents(companyAddr as Address)

  // EventManager inputs
  const [eventIdStr, setEventIdStr] = useState<string>("")
  const eventId = eventIdStr ? BigInt(eventIdStr) : undefined
  const eventInfoHook = useGetEventInfo(eventId)
  const eventActivitiesHook = useGetEventActivities(eventId)
  const nextEventIdHook = useGetNextEventId()

  const [activityName, setActivityName] = useState<string>("")
  const activityInfoHook = useGetActivityInfo(eventId, activityName)

  // UserManager inputs
  const [userAddr, setUserAddr] = useState<string>("")
  const userRegisteredHook = isUserRegistered(userAddr as Address)
  const userInfoHook = getUser(userAddr as Address)

  const [subEventIdStr, setSubEventIdStr] = useState<string>("")
  const subEventId = subEventIdStr ? BigInt(subEventIdStr) : (undefined as unknown as bigint)
  const userSubscribedHook = isUserSubscribed(userAddr as Address, subEventId as bigint)
  const userSubscribedEventsHook = getUserSubscribedEvents(userAddr as Address)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* UnitPointsTokens basic info con estados */}
      <Card>
        <CardHeader>
          <CardTitle>UnitPointsTokens - Información básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Field label="Nombre" value={(nameHook.data as string) ?? "-"} loading={nameHook.isLoading} />
          <Field label="Símbolo" value={(symbolHook.data as string) ?? "-"} loading={symbolHook.isLoading} />
          <Field label="Decimales" value={decimalsHook.data !== undefined ? String(decimalsHook.data) : "-"} loading={decimalsHook.isLoading} />
          <Field label="Suministro total" value={totalSupplyHook.data ? String(totalSupplyHook.data) : "-"} loading={totalSupplyHook.isLoading} />
          <Field label="Sector" value={(sectorDescHook.data as string) ?? "-"} loading={sectorDescHook.isLoading} />
          <div className="pt-2">
            <Button variant="secondary" onClick={() => { nameHook.refetch?.(); symbolHook.refetch?.(); decimalsHook.refetch?.(); totalSupplyHook.refetch?.(); sectorDescHook.refetch?.(); }}>Refrescar</Button>
          </div>
        </CardContent>
      </Card>

      {/* balanceOf & allowance con estados */}
      <Card>
        <CardHeader>
          <CardTitle>UnitPointsTokens - balanceOf y allowance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div>Dirección (balanceOf - try 0xc060DbB08Cd8980479bFfe829236Bcb9a1D9bD06)</div>
            <Input placeholder="0x..." value={balanceAddress} onChange={(e) => setBalanceAddress(e.target.value)} />
            <div className="text-sm">{balanceHook?.isLoading ? "Consultando..." : `Balance: ${balanceHook?.data ? String(balanceHook.data) : "-"}`}</div>
            <Button variant="secondary" onClick={() => balanceHook?.refetch?.()}>Consultar balance</Button>
          </div>
          <div className="space-y-2">
            <Label>Owner (allowance)</Label>
            <Input placeholder="0x..." value={ownerAddress} onChange={(e) => setOwnerAddress(e.target.value)} />
            <Label>Spender (allowance)</Label>
            <Input placeholder="0x..." value={spenderAddress} onChange={(e) => setSpenderAddress(e.target.value)} />
            <div className="text-sm">{allowanceHook?.isLoading ? "Consultando..." : `Allowance: ${allowanceHook?.data ? String(allowanceHook.data) : "-"}`}</div>
            <Button variant="secondary" disabled={!ownerAddress || !spenderAddress} onClick={() => allowanceHook?.refetch?.()}>Consultar allowance</Button>
          </div>
        </CardContent>
      </Card>

      {/* CompanyManager */}
      <Card>
        <CardHeader>
          <CardTitle>CompanyManager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label>Dirección de la empresa</Label>
          <Input placeholder="0x..." value={companyAddr} onChange={(e) => setCompanyAddr(e.target.value)} />
          <div className="text-sm">{isActiveCompanyHook?.isLoading ? "Consultando..." : `¿Activa?: ${isActiveCompanyHook?.data === undefined ? "-" : String(isActiveCompanyHook.data)}`}</div>
          <div className="space-y-1">
            <div className="text-sm font-medium">Info:</div>
            {companyInfoHook?.isLoading ? (
              <div className="text-sm">Consultando...</div>
            ) : companyInfoHook?.data ? (
              <RenderCompanyInfo data={companyInfoHook.data} />
            ) : (
              <div className="text-sm">-</div>
            )}
          </div>
          <div className="text-sm">Eventos: <pre className="whitespace-pre-wrap break-words">{companyEventsHook?.isLoading ? "Consultando..." : companyEventsHook?.data ? stringifySafe(companyEventsHook.data) : "-"}</pre></div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => isActiveCompanyHook?.refetch?.()}>Consultar estado</Button>
          <Button className="ml-2" onClick={() => companyInfoHook?.refetch?.()}>Consultar info</Button>
          <Button className="ml-2" onClick={() => companyEventsHook?.refetch?.()}>Consultar eventos</Button>
        </CardFooter>
      </Card>

      {/* EventManager */}
      <Card>
        <CardHeader>
          <CardTitle>EventManager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>ID de evento</Label>
            <Input type="number" placeholder="ej. 1" value={eventIdStr} onChange={(e) => setEventIdStr(e.target.value)} />
            <Button variant="secondary" onClick={() => eventInfoHook?.refetch?.()}>Consultar evento</Button>
            <div className="space-y-1">
              <div className="text-sm font-medium">Evento:</div>
              {eventInfoHook?.isLoading ? (
                <div className="text-sm">Consultando...</div>
              ) : eventInfoHook?.data ? (
                <RenderEventInfo data={eventInfoHook.data} />
              ) : (
                <div className="text-sm">-</div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Nombre de actividad</Label>
            <Input placeholder="ej. vote-proposal" value={activityName} onChange={(e) => setActivityName(e.target.value)} />
            <Button variant="secondary" onClick={() => activityInfoHook?.refetch?.()}>Consultar actividad</Button>
            <div className="space-y-1">
              <div className="text-sm font-medium">Actividad:</div>
              {activityInfoHook?.isLoading ? (
                <div className="text-sm">Consultando...</div>
              ) : activityInfoHook?.data ? (
                <RenderActivityInfo data={activityInfoHook.data} />
              ) : (
                <div className="text-sm">-</div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Button variant="secondary" onClick={() => eventActivitiesHook?.refetch?.()}>Consultar actividades del evento</Button>
            <div className="space-y-1">
              <div className="text-sm font-medium">Actividades:</div>
              {eventActivitiesHook?.isLoading ? (
                <div className="text-sm">Consultando...</div>
              ) : Array.isArray(eventActivitiesHook?.data) && eventActivitiesHook.data.length > 0 ? (
                <ul className="list-disc pl-5 text-sm">
                  {eventActivitiesHook.data.map((a, idx) => (
                    <li key={`${a}-${idx}`}>{a}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm">-</div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Próximo ID de evento</Label>
            <div className="text-sm">{nextEventIdHook?.isLoading ? "Consultando..." : nextEventIdHook?.data ? String(nextEventIdHook.data) : "-"}</div>
          </div>
        </CardContent>
      </Card>

      {/* UserManager */}
      <Card>
        <CardHeader>
          <CardTitle>UserManager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label>Dirección de usuario</Label>
          <Input placeholder="0x..." value={userAddr} onChange={(e) => setUserAddr(e.target.value)} />
          <div className="text-sm">{userRegisteredHook?.isLoading ? "Consultando..." : `¿Registrado?: ${userRegisteredHook?.data === undefined ? "-" : String(userRegisteredHook.data)}`}</div>
          <div className="space-y-1">
            <div className="text-sm font-medium">Info:</div>
            {userInfoHook?.isLoading ? (
              <div className="text-sm">Consultando...</div>
            ) : userInfoHook?.data ? (
              <RenderUserInfo data={userInfoHook.data} />
            ) : (
              <div className="text-sm">-</div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Event ID (suscripción)</Label>
            <Input type="number" value={subEventIdStr} onChange={(e) => setSubEventIdStr(e.target.value)} />
            <div className="text-sm">{userSubscribedHook?.isLoading ? "Consultando..." : `¿Suscrito al evento?: ${userSubscribedHook?.data === undefined ? "-" : String(userSubscribedHook.data)}`}</div>
          </div>
          <div className="text-sm">Eventos suscritos: <pre className="whitespace-pre-wrap break-words">{userSubscribedEventsHook?.isLoading ? "Consultando..." : userSubscribedEventsHook?.data ? stringifySafe(userSubscribedEventsHook.data) : "-"}</pre></div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => userRegisteredHook?.refetch?.()}>Consultar registro</Button>
          <Button className="ml-2" onClick={() => userInfoHook?.refetch?.()}>Consultar usuario</Button>
          <Button className="ml-2" onClick={() => userSubscribedHook?.refetch?.()}>Consultar suscripción</Button>
          <Button className="ml-2" onClick={() => userSubscribedEventsHook?.refetch?.()}>Consultar eventos</Button>
        </CardFooter>
      </Card>
    </div>
  )
}