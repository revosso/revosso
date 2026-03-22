import { platformsRepository } from "@/lib/repositories/control-platforms"
import type { NewPlatform } from "@/lib/control-schema"

export const enterprisePlatformsService = {
  paginate: (page?: number, search?: string, category?: string) =>
    platformsRepository.paginate(page, 15, search, category),

  findById: (id: number) => platformsRepository.findById(id),

  create: (data: NewPlatform) => platformsRepository.create(data),

  update: (id: number, data: Partial<NewPlatform>) => platformsRepository.update(id, data),

  delete: (id: number) => platformsRepository.delete(id),
}
