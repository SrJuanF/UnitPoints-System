"use client";
import { TestHeader } from "@/components/test/test-header"
import { PrivyTest } from "@/components/test/privy-test"
import { WriteContracts } from "@/components/test/write-contracts"
import { ReadContracts } from "@/components/test/read-contracts"



export default function TestPage() {

  return (
    <main className="min-h-screen bg-background">
      <TestHeader />
      <PrivyTest />
      {/* Título para las secciones de pruebas de contratos */}
      <section className="px-4 md:px-8 mt-8 mb-4">
        <h2 className="text-2xl font-semibold">Pruebas de contratos</h2>
        <p className="text-sm text-muted-foreground">Interacción de escritura</p>
      </section>
      <WriteContracts />
      {/* Título para las secciones de pruebas de contratos */}
      <section className="px-4 md:px-8 mt-8 mb-4">
        <h2 className="text-2xl font-semibold">Pruebas de contratos</h2>
        <p className="text-sm text-muted-foreground">Interacción de lectura</p>
      </section>
      <ReadContracts />
    </main>
  )
}
