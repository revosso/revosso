import { suppliersRepository } from "@/lib/repositories/control-suppliers"
import type { NewSupplier } from "@/lib/control-schema"

export const suppliersService = {
  listAll: () => suppliersRepository.listAll(),
  findById: (id: number) => suppliersRepository.findById(id),
  create: (data: NewSupplier) => suppliersRepository.create(data),
  update: (id: number, data: Partial<NewSupplier>) => suppliersRepository.update(id, data),
  delete: (id: number) => suppliersRepository.delete(id),
}
