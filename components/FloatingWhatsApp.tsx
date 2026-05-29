'use client'

import Image from "next/image"
import { usePathname } from "next/navigation"

export default function FloatingWhatsApp() {
  const pathname = usePathname()
  if (pathname?.startsWith('/briefing') || pathname?.startsWith('/raio-x') || pathname?.startsWith('/proposta') || pathname?.startsWith('/contrato') || pathname?.startsWith('/hub')) return null
  return (
    <a href="https://wa.me/5531999352065" target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp" className="fixed bottom-4 right-4 z-50 transition duration-300 hover:-translate-y-1 hover:scale-105 md:bottom-8 md:right-8">
      <Image src="/wpp.png" alt="WhatsApp" width={56} height={56} className="h-12 w-12 object-contain drop-shadow-2xl md:h-14 md:w-14" priority />
    </a>
  )
}