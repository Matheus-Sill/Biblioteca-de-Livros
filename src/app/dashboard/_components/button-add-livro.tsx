"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

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
import { addLivro } from "@/actions/livro"
import { toast } from "sonner"

import { useState } from "react"

const formSchema = z.object({
  titulo: z.string().min(2, "Informe o título."),
  autor: z.string().min(2, "Informe o autor."),
  categoria: z.string().min(2, "Informe a categoria."),
  ano: z.coerce.number().min(1000, "Ano inválido.").max(new Date().getFullYear(), "Ano inválido."),
})

export function ButtonAddLivro() {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      autor: "",
      categoria: "",
      ano: undefined,
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await addLivro(data)
      toast.success("Livro cadastrado com sucesso!")
      setOpen(false)
      form.reset()
    } catch (err: any) {
      toast.error(err.message || "Erro ao cadastrar livro.")
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Adicionar Livro
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Cadastrar Livro</DialogTitle>

          <form id="form-add-livro" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="titulo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Título</FieldLabel>
                    <Input {...field} placeholder="Ex: Dom Casmurro" autoComplete="off" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="autor"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Autor</FieldLabel>
                    <Input {...field} placeholder="Ex: Machado de Assis" autoComplete="off" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="categoria"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Categoria</FieldLabel>
                    <Input {...field} placeholder="Ex: Romance" autoComplete="off" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="ano"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Ano de publicação</FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Ex: 1899"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" form="form-add-livro">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}