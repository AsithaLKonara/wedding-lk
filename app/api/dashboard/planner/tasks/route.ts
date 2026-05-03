import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { Task } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user || user.role !== 'wedding_planner') {
      return NextResponse.json({ error: "Planner access required" }, { status: 403 });
    }

    await connectDB();
    const tasks = await Task.find({ createdBy: user.id }).sort({ dueDate: 1 });

    return NextResponse.json({
      success: true,
      tasks: tasks.map(t => ({
        id: t._id,
        title: t.title,
        category: t.category,
        priority: t.priority,
        status: t.status,
        dueDate: t.dueDate,
        description: t.description
      }))
    });
  } catch (error) {
    console.error('Error fetching planner tasks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const data = await request.json();
    await connectDB();
    
    const task = new Task({
      ...data,
      createdBy: user.id
    });
    await task.save();

    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { id, ...updateData } = await request.json();
    await connectDB();
    
    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: user.id },
      updateData,
      { new: true }
    );

    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { id } = await request.json();
    await connectDB();
    
    await Task.findOneAndDelete({ _id: id, createdBy: user.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
