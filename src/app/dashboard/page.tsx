import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

import { ButtonAddLivro } from "./_components/button-add-livro"
import { ButtonEditLivro } from "./_components/button-edit-livro"
import { ButtonDeleteLivro } from "./_components/button-delete-livro"
import { ButtonEmprestar } from "./_components/button-emprestar"
import { ButtonDevolver } from "./_components/button-devolver"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    return redirect("/login")
  }

  const livros = await prisma.book.findMany({
    where: { userId },
    include: {
      emprestimos: {
        where: { dataDevolucao: null },
        orderBy: { dataEmprestimo: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const disponiveis = livros.filter((l) => l.status === "DISPONIVEL")
  const emprestados = livros.filter((l) => l.status === "EMPRESTADO")

  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col gap-10 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meus Livros</h1>
        <ButtonAddLivro />
      </div>

      {/* ---------- DISPONÍVEIS ---------- */}
      <div>
        <h2 className="font-semibold mb-2 text-slate-700">
          Disponíveis ({disponiveis.length})
        </h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {disponiveis.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-500 py-6">
                  Nenhum livro disponível.
                </TableCell>
              </TableRow>
            )}

            {disponiveis.map((livro) => (
              <TableRow key={livro.id}>
                <TableCell>{livro.titulo}</TableCell>
                <TableCell>{livro.autor}</TableCell>
                <TableCell>{livro.categoria}</TableCell>
                <TableCell>{livro.ano}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <ButtonEmprestar bookId={livro.id} />
                    <ButtonEditLivro livro={livro} />
                    <ButtonDeleteLivro bookId={livro.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ---------- EMPRESTADOS ---------- */}
      <div>
        <h2 className="font-semibold mb-2 text-slate-700">
          Emprestados ({emprestados.length})
        </h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Com quem está</TableHead>
              <TableHead>Data do empréstimo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {emprestados.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-slate-500 py-6">
                  Nenhum livro emprestado.
                </TableCell>
              </TableRow>
            )}

            {emprestados.map((livro) => (
              <TableRow key={livro.id}>
                <TableCell>{livro.titulo}</TableCell>
                <TableCell>{livro.emprestimos[0]?.pessoa ?? "-"}</TableCell>
                <TableCell>
                  {livro.emprestimos[0]
                    ? new Date(livro.emprestimos[0].dataEmprestimo).toLocaleDateString("pt-BR")
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <ButtonDevolver bookId={livro.id} />
                    <ButtonDeleteLivro bookId={livro.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}