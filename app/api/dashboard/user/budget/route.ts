import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { BudgetItem, User } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const items = await BudgetItem.find({ userId: user.id });
    const userProfile = await User.findById(user.id).select('weddingDetails');

    return NextResponse.json({
      success: true,
      items,
      totalBudget: userProfile?.weddingDetails?.budget || 1000000
    });
  } catch (error) {
    console.error('Error fetching budget:', error);
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
    
    const item = new BudgetItem({
      ...data,
      userId: user.id
    });
    await item.save();

    return NextResponse.json({ success: true, item });
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
    
    const item = await BudgetItem.findOneAndUpdate(
      { _id: id, userId: user.id },
      updateData,
      { new: true }
    );

    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    return NextResponse.json({ success: true, item });
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
    
    await BudgetItem.findOneAndDelete({ _id: id, userId: user.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
