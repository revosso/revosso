import { incomesRepository } from "@/lib/repositories/control-incomes"
import { expensesRepository } from "@/lib/repositories/control-expenses"
import { projectsRepository } from "@/lib/repositories/control-projects"
import { debtsRepository } from "@/lib/repositories/control-debts"
import { servicesRepository } from "@/lib/repositories/control-services"
import { serviceMonthlyCost, type BillingCycle, type Service } from "@/lib/control-schema"

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
}

async function getFinancialSummary() {
  const [totalIncome, totalExpense] = await Promise.all([
    incomesRepository.sumAll(),
    expensesRepository.sumAll(),
  ])
  return { total_income: totalIncome, total_expense: totalExpense, balance: totalIncome - totalExpense }
}

async function getMonthlyTotals() {
  const now = new Date()
  const start = startOfMonth(now)
  const end = endOfMonth(now)
  const [income, expense] = await Promise.all([
    incomesRepository.sumBetween(start, end),
    expensesRepository.sumBetween(start, end),
  ])
  return { month_income: income, month_expense: expense, month_net: income - expense, period_start: start, period_end: end }
}

async function getLastMonthTotals() {
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const start = startOfMonth(lastMonth)
  const end = endOfMonth(lastMonth)
  const [income, expense] = await Promise.all([
    incomesRepository.sumBetween(start, end),
    expensesRepository.sumBetween(start, end),
  ])
  return { last_month_income: income, last_month_expense: expense, last_month_net: income - expense }
}

async function getProjectSummary() {
  const [byStatus, atRiskProjects] = await Promise.all([
    projectsRepository.countByStatus(),
    projectsRepository.findAtRisk(5),
  ])
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0)
  return {
    total,
    by_status: {
      stopped: byStatus["stopped"] ?? 0,
      in_progress: byStatus["in_progress"] ?? 0,
      delayed: byStatus["delayed"] ?? 0,
      completed: byStatus["completed"] ?? 0,
    },
    at_risk_projects: atRiskProjects,
  }
}

async function getDebtsSummary() {
  const [totalOwed, overdueCount, overdueTotal, topOverdue] = await Promise.all([
    debtsRepository.totalOwed(),
    debtsRepository.overdueCount(),
    debtsRepository.overdueTotal(),
    debtsRepository.findOverdue(5),
  ])
  return {
    total_owed: Math.round(totalOwed * 100) / 100,
    overdue_count: overdueCount,
    overdue_total: Math.round(overdueTotal * 100) / 100,
    top_overdue: topOverdue,
  }
}

/**
 * Next payment date for a service — mirrors DashboardService::nextPaymentDate()
 */
function nextPaymentDate(service: Service): Date | null {
  if (service.billingCycle === "one_time") return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (service.billingDay) {
    const day = Math.max(1, Math.min(28, service.billingDay))
    const candidate = new Date(today.getFullYear(), today.getMonth(), day)
    if (candidate < today) candidate.setMonth(candidate.getMonth() + 1)
    if (service.endDate && candidate > service.endDate) return null
    if (service.startDate && candidate < service.startDate) return new Date(service.startDate)
    return candidate
  }

  if (service.renewalDate) {
    const r = new Date(service.renewalDate)
    while (r < today) {
      switch (service.billingCycle) {
        case "weekly": r.setDate(r.getDate() + 7); break
        case "monthly": r.setMonth(r.getMonth() + 1); break
        case "quarterly": r.setMonth(r.getMonth() + 3); break
        case "yearly": r.setFullYear(r.getFullYear() + 1); break
        default: r.setMonth(r.getMonth() + 1)
      }
    }
    if (service.endDate && r > service.endDate) return null
    return r
  }

  return null
}

async function getServicesSummary() {
  const active = await servicesRepository.findActive()
  const monthlyRecurringTotal = active.reduce(
    (sum, s) => sum + serviceMonthlyCost(s.cost, s.billingCycle as BillingCycle),
    0
  )

  const nextPayments = active
    .filter((s) => s.billingCycle !== "one_time")
    .map((s) => ({ service: s, next_date: nextPaymentDate(s), amount: s.cost }))
    .filter((p) => p.next_date !== null)
    .sort((a, b) => a.next_date!.getTime() - b.next_date!.getTime())
    .slice(0, 10)

  return {
    monthly_recurring_total: Math.round(monthlyRecurringTotal * 100) / 100,
    next_payments: nextPayments,
  }
}

/**
 * Latest 10 transactions: incomes + expenses merged by date desc.
 * Mirrors DashboardService::getLatestTransactions()
 */
async function getLatestTransactions(limit = 10) {
  const [latestIncomes, latestExpenses] = await Promise.all([
    incomesRepository.latest(limit * 2),
    expensesRepository.latest(limit * 2),
  ])
  const merged = [
    ...latestIncomes.map((i) => ({ type: "income" as const, date: i.date, description: i.description, amount: i.amount, id: i.id })),
    ...latestExpenses.map((e) => ({ type: "expense" as const, date: e.date, description: e.description, amount: e.amount, id: e.id })),
  ]
  return merged
    .sort((a, b) => {
      const da = a.date instanceof Date ? a.date.getTime() : new Date(a.date).getTime()
      const db_ = b.date instanceof Date ? b.date.getTime() : new Date(b.date).getTime()
      return db_ - da
    })
    .slice(0, limit)
}

export const dashboardService = {
  /** Full admin dashboard — mirrors DashboardService::getDashboardData() */
  async getDashboardData() {
    const [financial, monthly, lastMonth, projects, debts, services, latestTransactions, latestUpdates] =
      await Promise.all([
        getFinancialSummary(),
        getMonthlyTotals(),
        getLastMonthTotals(),
        getProjectSummary(),
        getDebtsSummary(),
        getServicesSummary(),
        getLatestTransactions(10),
        projectsRepository.getLatestUpdates(10),
      ])
    return {
      balance: financial.balance,
      total_income: financial.total_income,
      total_expense: financial.total_expense,
      month_income: monthly.month_income,
      month_expense: monthly.month_expense,
      month_net: monthly.month_net,
      last_month_income: lastMonth.last_month_income,
      last_month_expense: lastMonth.last_month_expense,
      last_month_net: lastMonth.last_month_net,
      projects,
      debts,
      services,
      latest_transactions: latestTransactions,
      latest_project_updates: latestUpdates,
    }
  },
}
