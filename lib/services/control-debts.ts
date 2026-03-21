import { debtsRepository } from "@/lib/repositories/control-debts"
import type { NewDebt } from "@/lib/control-schema"

export const debtsService = {
  paginate: (page?: number, search?: string, status?: string) =>
    debtsRepository.paginate(page, 15, search, status),

  findById: (id: number) => debtsRepository.findById(id),

  create: (data: NewDebt) => debtsRepository.create(data),

  update: (id: number, data: Partial<NewDebt>) => debtsRepository.update(id, data),

  delete: (id: number) => debtsRepository.delete(id),
}
