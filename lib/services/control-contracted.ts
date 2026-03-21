import { servicesRepository } from "@/lib/repositories/control-services"
import type { NewService } from "@/lib/control-schema"

export const contractedService = {
  paginate: (page?: number, search?: string, status?: string) =>
    servicesRepository.paginate(page, 15, search, status),

  findById: (id: number) => servicesRepository.findById(id),

  create: (data: NewService) => servicesRepository.create(data),

  update: (id: number, data: Partial<NewService>) => servicesRepository.update(id, data),

  delete: (id: number) => servicesRepository.delete(id),
}
