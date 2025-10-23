import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Group, User } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const privacy = searchParams.get('privacy');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    console.log('📊 Fetching groups...');

    // Build query
    let query: any = { isActive: true };

    if (type) {
      query.type = type;
    }

    if (privacy) {
      query.privacy = privacy;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Role-based filtering
    if (token ?.user?.role === 'user') {
      // Users can only see public and private groups they're members of
      query.$or = [
        { privacy: 'public' },
        { 'members.user': session.user.id }
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort criteria
    let sortCriteria: any = {};
    if (sortBy === 'members') {
      sortCriteria = { 'analytics.totalMembers': -1 };
    } else if (sortBy === 'activity') {
      sortCriteria = { 'analytics.lastActivity': -1 };
    } else {
      sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Execute query with pagination
    const [groups, total] = await Promise.all([
      Group.find(query)
        .populate('createdBy', 'name avatar')
        .populate('members.user', 'name avatar')
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit)
        .lean(),
      Group.countDocuments(query)
    ]);

    console.log(`✅ Found ${groups.length} groups`);

    return NextResponse.json({
      success: true,
      groups,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching groups:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch groups',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!token?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const groupData = await request.json();
    
    console.log('📝 Creating group...');

    // Validate required fields
    if (!groupData.name || !groupData.description) {
      return NextResponse.json({
        success: false,
        error: 'Name and description are required'
      }, { status: 400 });
    }

    // Create group
    const newGroup = new Group({
      name: groupData.name,
      description: groupData.description,
      type: groupData.type || 'general',
      privacy: groupData.privacy || 'public',
      coverImage: groupData.coverImage,
      avatar: groupData.avatar,
      members: [{
        user: session.user.id,
        role: 'admin',
        joinedAt: new Date(),
        permissions: {
          canPost: true,
          canComment: true,
          canInvite: true,
          canModerate: true
        }
      }],
      posts: [],
      events: [],
      marketplace: [],
      rules: groupData.rules || [],
      settings: {
        allowMemberPosts: groupData.settings?.allowMemberPosts ?? true,
        requireApproval: groupData.settings?.requireApproval ?? false,
        allowMarketplace: groupData.settings?.allowMarketplace ?? true,
        allowEvents: groupData.settings?.allowEvents ?? true,
        maxMembers: groupData.settings?.maxMembers
      },
      analytics: {
        totalMembers: 1,
        totalPosts: 0,
        totalEvents: 0,
        totalMarketplaceItems: 0,
        engagementRate: 0,
        lastActivity: new Date()
      },
      createdBy: session.user.id,
      isActive: true
    });

    await newGroup.save();

    // Populate the response
    const populatedGroup = await Group.findById(newGroup._id)
      .populate('createdBy', 'name avatar')
      .populate('members.user', 'name avatar')
      .lean();

    console.log('✅ Group created successfully:', newGroup._id);

    return NextResponse.json({
      success: true,
      group: populatedGroup,
      message: 'Group created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating group:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create group',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
