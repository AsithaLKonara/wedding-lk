import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { TimelineEvent } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user || user.role !== 'wedding_planner') {
      return NextResponse.json({ error: "Planner access required" }, { status: 403 });
    }

    await connectDB();
    const events = await TimelineEvent.find({ plannerId: user.id }).sort({ date: 1, time: 1 });

    return NextResponse.json({
      success: true,
      events: events.map(e => ({
        id: e._id,
        title: e.title,
        description: e.description,
        date: e.date,
        time: e.time,
        duration: e.duration,
        category: e.category,
        status: e.status,
        priority: e.priority,
        assignedTo: e.assignedTo || '',
        location: e.location || '',
        notes: e.notes || ''
      }))
    });
  } catch (error) {
    console.error('Error fetching timeline:', error);
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
    
    const event = new TimelineEvent({
      ...data,
      plannerId: user.id
    });
    await event.save();

    return NextResponse.json({ success: true, event });
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
    
    const event = await TimelineEvent.findOneAndUpdate(
      { _id: id, plannerId: user.id },
      updateData,
      { new: true }
    );

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json({ success: true, event });
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
    
    await TimelineEvent.findOneAndDelete({ _id: id, plannerId: user.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
