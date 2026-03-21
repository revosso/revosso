import { projectsRepository } from "@/lib/repositories/control-projects"
import type { NewProject } from "@/lib/control-schema"

export const projectsService = {
  paginate: (page?: number) => projectsRepository.paginate(page),

  findById: async (id: number) => {
    const project = await projectsRepository.findById(id)
    if (!project) return null
    const totalIncome = await projectsRepository.totalIncomesForProject(id)
    const totalExpense = await projectsRepository.totalExpensesForProject(id)
    const updates = await projectsRepository.getUpdates(id)
    return { ...project, totalIncome, totalExpense, net: totalIncome - totalExpense, updates }
  },

  create: (data: NewProject) => projectsRepository.create(data),

  update: (id: number, data: Partial<NewProject>) => projectsRepository.update(id, data),

  delete: (id: number) => projectsRepository.delete(id),

  addUpdate: (projectId: number, note: string, createdBy?: string) =>
    projectsRepository.createUpdate({ projectId, note, createdBy }),

  getProjects: () =>
    projectsRepository.paginate(1, 1000).then((r) => r.data.map((p) => ({ id: p.id, name: p.name }))),
}
