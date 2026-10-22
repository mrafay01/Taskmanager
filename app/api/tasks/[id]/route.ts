import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";

const notFound = () => Response.json({ error: "Task not found" }, { status: 404 });

export async function PUT(req: Request, ctx: RouteContext<"/api/tasks/[id]">) {
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return notFound();

  const { title, completed } = await req.json();
  const update: { title?: string; completed?: boolean } = {};

  if (title !== undefined) {
    if (!title.trim()) {
      return Response.json({ error: "Title cannot be empty" }, { status: 400 });
    }
    update.title = title;
  }
  if (typeof completed === "boolean") update.completed = completed;

  await connectDB();
  const task = await Task.findByIdAndUpdate(id, update, {
    returnDocument: "after",
    runValidators: true,
  });

  return task ? Response.json(task) : notFound();
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/tasks/[id]">) {
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return notFound();

  await connectDB();
  const task = await Task.findByIdAndDelete(id);

  return task ? new Response(null, { status: 204 }) : notFound();
}
