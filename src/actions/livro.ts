"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error("Não autenticado.")
  return userId
}

type LivroInput = {
  titulo: string
  autor: string
  categoria: string
  ano: number
}

export async function addLivro(data: LivroInput) {
  const userId = await getUserId()
  await prisma.book.create({ data: { ...data, userId } })
  revalidatePath("/dashboard")
}

export async function editLivro(id: string, data: LivroInput) {
  const userId = await getUserId()

  const livro = await prisma.book.findFirst({ where: { id, userId } })
  if (!livro) throw new Error("Livro não encontrado.")

  await prisma.book.update({ where: { id }, data })
  revalidatePath("/dashboard")
}

export async function deleteLivro(id: string) {
  const userId = await getUserId()

  const livro = await prisma.book.findFirst({ where: { id, userId } })
  if (!livro) throw new Error("Livro não encontrado.")

  await prisma.book.delete({ where: { id } })
  revalidatePath("/dashboard")
}

export async function emprestarLivro(bookId: string, pessoa: string) {
  const userId = await getUserId()

  const livro = await prisma.book.findFirst({ where: { id: bookId, userId } })
  if (!livro) throw new Error("Livro não encontrado.")
  if (livro.status === "EMPRESTADO") throw new Error("Livro já está emprestado.")

  await prisma.$transaction([
    prisma.loan.create({ data: { bookId, pessoa, userId } }),
    prisma.book.update({ where: { id: bookId }, data: { status: "EMPRESTADO" } }),
  ])

  revalidatePath("/dashboard")
}

export async function devolverLivro(bookId: string) {
  const userId = await getUserId()

  const livro = await prisma.book.findFirst({ where: { id: bookId, userId } })
  if (!livro) throw new Error("Livro não encontrado.")
  if (livro.status !== "EMPRESTADO") throw new Error("Livro não está emprestado.")

  const emprestimoAberto = await prisma.loan.findFirst({
    where: { bookId, dataDevolucao: null },
    orderBy: { dataEmprestimo: "desc" },
  })
  if (!emprestimoAberto) throw new Error("Empréstimo em aberto não encontrado.")

  await prisma.$transaction([
    prisma.loan.update({
      where: { id: emprestimoAberto.id },
      data: { dataDevolucao: new Date() },
    }),
    prisma.book.update({ where: { id: bookId }, data: { status: "DISPONIVEL" } }),
  ])

  revalidatePath("/dashboard")
}