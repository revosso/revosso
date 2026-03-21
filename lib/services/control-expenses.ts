import { expensesRepository } from "@/lib/repositories/control-expenses"
import type { NewExpense } from "@/lib/control-schema"

export const expensesService = {
  paginate: (page?: number) => expensesRepository.paginate(page),

  findById: (id: number) => expensesRepository.findById(id),

  create: (data: Omit<NewExpense, "projectId">) =>
    expensesRepository.create({ ...data, projectId: null } as NewExpense),

  /** Clears project link on every update — project is not used for expenses in the admin UI */
  update: (id: number, data: Partial<Omit<NewExpense, "projectId">>) =>
    expensesRepository.update(id, { ...data, projectId: null }),

  delete: (id: number) => expensesRepository.delete(id),
}
