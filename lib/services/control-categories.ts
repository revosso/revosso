import { categoriesRepository } from "@/lib/repositories/control-categories"
import type { NewCategory } from "@/lib/control-schema"

export const categoriesService = {
  listAll: () => categoriesRepository.listAll(),
  findById: (id: number) => categoriesRepository.findById(id),
  create: (data: NewCategory) => categoriesRepository.create(data),
  update: (id: number, data: Partial<NewCategory>) => categoriesRepository.update(id, data),
  delete: (id: number) => categoriesRepository.delete(id),
}
