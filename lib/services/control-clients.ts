import { clientsRepository } from "@/lib/repositories/control-clients"
import type { NewClient } from "@/lib/control-schema"

export const clientsService = {
  listAll: () => clientsRepository.listAll(),
  findById: (id: number) => clientsRepository.findById(id),
  create: (data: NewClient) => clientsRepository.create(data),
  update: (id: number, data: Partial<NewClient>) => clientsRepository.update(id, data),
  delete: (id: number) => clientsRepository.delete(id),
}
