import { controlDb } from "@/lib/control-db"
import {
  projects,
  projectUpdates,
  incomes,
  expenses,
  type Project,
  type NewProject,
  type ProjectUpdate,
} from "@/lib/control-schema"
import { eq, ne, or, isNull, lte, and, desc, sql } from "drizzle-orm"

export class ProjectsRepository {
  /** All projects ordered by updatedAt desc, paginated 15 — mirrors ProjectController::index() */
  async paginate(page = 1, perPage = 15) {
    const offset = (page - 1) * perPage
    const rows = await controlDb.select().from(projects).orderBy(desc(projects.updatedAt)).limit(perPage).offset(offset)
    const [{ count }] = await controlDb.select({ count: sql<number>`count(*)` }).from(projects)
    return { data: rows, total: Number(count), page, perPage, lastPage: Math.ceil(Number(count) / perPage) }
  }

  async findById(id: number): Promise<Project | undefined> {
    const [row] = await controlDb.select().from(projects).where(eq(projects.id, id))
    return row
  }

  async create(data: NewProject): Promise<Project> {
    const result = await controlDb.insert(projects).values(data).returning()
    return result[0]
  }

  /** Sets lastUpdateAt = now on update — mirrors ProjectController::update() */
  async update(id: number, data: Partial<NewProject>): Promise<Project> {
    const result = await controlDb
      .update(projects)
      .set({ ...data, lastUpdateAt: new Date(), updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning()
    return result[0]
  }

  async delete(id: number): Promise<void> {
    await controlDb.delete(projects).where(eq(projects.id, id))
  }

  /**
   * At-risk: not completed AND (delayed OR lastUpdateAt IS NULL OR lastUpdateAt <= 14 days ago)
   * Mirrors Project::scopeAtRisk()
   */
  async findAtRisk(limit = 5): Promise<Project[]> {
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    return controlDb
      .select()
      .from(projects)
      .where(
        and(
          ne(projects.status, "completed"),
          or(
            eq(projects.status, "delayed"),
            isNull(projects.lastUpdateAt),
            lte(projects.lastUpdateAt, fourteenDaysAgo)
          )
        )
      )
      .orderBy(desc(projects.lastUpdateAt))
      .limit(limit)
  }

  async countByStatus(): Promise<Record<string, number>> {
    const rows = await controlDb
      .select({ status: projects.status, count: sql<number>`count(*)` })
      .from(projects)
      .groupBy(projects.status)
    return Object.fromEntries(rows.map((r) => [r.status, Number(r.count)]))
  }

  async totalIncomesForProject(projectId: number): Promise<number> {
    const [{ total }] = await controlDb
      .select({ total: sql<number>`coalesce(sum(amount), 0)` })
      .from(incomes)
      .where(eq(incomes.projectId, projectId))
    return Number(total)
  }

  async totalExpensesForProject(projectId: number): Promise<number> {
    const [{ total }] = await controlDb
      .select({ total: sql<number>`coalesce(sum(amount), 0)` })
      .from(expenses)
      .where(eq(expenses.projectId, projectId))
    return Number(total)
  }

  async getUpdates(projectId: number): Promise<ProjectUpdate[]> {
    return controlDb
      .select()
      .from(projectUpdates)
      .where(eq(projectUpdates.projectId, projectId))
      .orderBy(desc(projectUpdates.createdAt))
  }

  async createUpdate(data: { projectId: number; note: string; createdBy?: string }): Promise<ProjectUpdate> {
    const result = await controlDb.insert(projectUpdates).values(data).returning()
    return result[0]
  }

  async getLatestUpdates(limit = 10): Promise<(ProjectUpdate & { projectName: string })[]> {
    const rows = await controlDb
      .select({
        id: projectUpdates.id,
        projectId: projectUpdates.projectId,
        note: projectUpdates.note,
        createdBy: projectUpdates.createdBy,
        createdAt: projectUpdates.createdAt,
        updatedAt: projectUpdates.updatedAt,
        projectName: projects.name,
      })
      .from(projectUpdates)
      .leftJoin(projects, eq(projectUpdates.projectId, projects.id))
      .orderBy(desc(projectUpdates.createdAt))
      .limit(limit)
    return rows.map((r) => ({ ...r, projectName: r.projectName ?? "" }))
  }
}

export const projectsRepository = new ProjectsRepository()
