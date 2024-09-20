import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  { id: 1, title: "Groceries", amount: 59.99 },
  { id: 2, title: "Dinner at restaurant", amount: 33.99 },
  { id: 3, title: "Rent", amount: 1425.0 },
  { id: 4, title: "Gym membership", amount: 49.99 },
];

export const expensesRoute = new Hono()
  .get("/", (c) =>
    c.json({
      expenses: fakeExpenses,
    })
  )
  .get("/total-spent", (c) => {
    const totalSpent = fakeExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    return c.json({ totalSpent: totalSpent });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const data = c.req.valid("json");
    const expense = createPostSchema.parse(data);
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    c.status(201);
    return c.json({
      expense: expense,
    });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((e) => e.id === id);
    if (!expense) {
      return c.notFound();
    }
    return c.json({
      expense: expense,
    });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = fakeExpenses.findIndex((e) => e.id === id);
    if (index === -1) {
      return c.notFound();
    }
    const deletedExpense = fakeExpenses.splice(index, 1)[0];
    c.status(204);
    return c.json({ expense: deletedExpense });
  });
