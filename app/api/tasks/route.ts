import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'tasks.json');

export async function GET() {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  const tasks = JSON.parse(data);
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const newTask = { ...data, id: Date.now() };

  const tasksData = fs.readFileSync(dataFilePath, 'utf8');
  const tasks = JSON.parse(tasksData);
  tasks.push(newTask);

  fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2));
  return NextResponse.json(newTask);
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const data = await req.json();

  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }

  const tasksData = fs.readFileSync(dataFilePath, 'utf8');
  const tasks = JSON.parse(tasksData);

  const taskIndex = tasks.findIndex((task: any) => task.id == id);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...data };
    fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2));
    return NextResponse.json(tasks[taskIndex]);
  } else {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }

  const tasksData = fs.readFileSync(dataFilePath, 'utf8');
  const tasks = JSON.parse(tasksData);

  const updatedTasks = tasks.filter((task: any) => task.id != id);
  fs.writeFileSync(dataFilePath, JSON.stringify(updatedTasks, null, 2));

  return NextResponse.json({ message: 'Task deleted successfully' });
}
