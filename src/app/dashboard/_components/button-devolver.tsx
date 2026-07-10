"use client"

import { Button } from "@/components/ui/button"
import { CheckIcon } from "lucide-react"
import { devolverLivro } from "@/actions/livro"
import { toast } from "sonner"
import { useState } from "react"

export function ButtonDevolver({ bookId }: { bookId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      await devolverLivro(bookId)
      toast.success("Devolução registrada!")
    } catch (err: any) {
      toast.error(err.message || "Erro ao registrar devolução.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={handleClick} disabled={loading}>
      <CheckIcon />
    </Button>
  )
}