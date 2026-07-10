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
import { emprestarLivro } from "@/actions/livro"
import { toast } from "sonner"

import { useState } from "react"

const formSchema = z.object({
  pessoa: z.string().min(2, "Informe o nome da pessoa."),
})

export function ButtonEmprestar({ bookId }: { bookId: string }) {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { pessoa: "" },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await emprestarLivro(bookId, data.pessoa)
      toast.success("Empréstimo registrado!")
      setOpen(false)
      form.reset()
    } catch (err: any) {
      toast.error(err.message || "Erro ao registrar empréstimo.")
    }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Emprestar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Registrar Empréstimo</DialogTitle>

          <form id="form-emprestar" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="pessoa"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Nome de quem vai levar o livro</FieldLabel>
                    <Input {...field} placeholder="Ex: João da Silva" autoComplete="off" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="form-emprestar">
              Confirmar empréstimo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}