import { incomesRepository } from "@/lib/repositories/control-incomes"
import type { NewIncome } from "@/lib/control-schema"

export const incomesService = {
  paginate: (page?: number) => incomesRepository.paginate(page),

  findById: (id: number) => incomesRepository.findById(id),

  create: (data: Omit<NewIncome, "projectId">) =>
    incomesRepository.create({ ...data, projectId: null } as NewIncome),

  /** Clears project link on every update — project is not used for incomes in the admin UI */
  update: (id: number, data: Partial<Omit<NewIncome, "projectId">>) =>
    incomesRepository.update(id, { ...data, projectId: null }),

  delete: (id: number) => incomesRepository.delete(id),
}
