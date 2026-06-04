import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checklist | ORIUM',
}

export default function ChecklistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
