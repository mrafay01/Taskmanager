import { connection } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";

export async function GET() {
  await connection();
  await connectDB();
  const tasks = await Task.find().sort({ createdAt: -1 });
  return Response.json(tasks);
}

export async function POST(req: Request) {
  const { title } = await req.json();

  if (!title?.trim()) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }

  await connectDB();
  const task = await Task.create({ title });
  return Response.json(task, { status: 201 });
}
