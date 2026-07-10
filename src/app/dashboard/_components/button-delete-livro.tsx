"use client"

import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"
import { deleteLivro } from "@/actions/livro"
import { toast } from "sonner"
import { useState } from "react"

export function ButtonDeleteLivro({ bookId }: { bookId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    const confirmado = confirm("Tem certeza que deseja excluir este livro?")
    if (!confirmado) return

    setLoading(true)
    try {
      await deleteLivro(bookId)
      toast.success("Livro excluído com sucesso!")
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir livro.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="destructive" size="icon" onClick={handleClick} disabled={loading}>
      <TrashIcon />
    </Button>
  )
}