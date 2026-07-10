"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { editLivro } from "@/actions/livro"
import { toast } from "sonner"

import { useState } from "react"

const formSchema = z.object({
  titulo: z.string().min(2, "Informe o título."),
  autor: z.string().min(2, "Informe o autor."),
  categoria: z.string().min(2, "Informe a categoria."),
  ano: z.coerce.number().min(1000, "Ano inválido.").max(new Date().getFullYear(), "Ano inválido."),
})

type Livro = {
  id: string
  titulo: string
  autor: string
  categoria: string
  ano: number
}

export function ButtonEditLivro({ livro }: { livro: Livro }) {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: livro.titulo,
      autor: livro.autor,
      categoria: livro.categoria,
      ano: livro.ano,
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await editLivro(livro.id, data)
      toast.success("Livro atualizado com sucesso!")
      setOpen(false)
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar livro.")
    }
  }

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
        <PencilIcon />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Editar Livro</DialogTitle>

          <form id="form-edit-livro" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="titulo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field