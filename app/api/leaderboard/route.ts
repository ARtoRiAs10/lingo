import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import  db  from '@/db/drizzle';
import { 
  leaderboardEntries, 
  userProgress, 
  challengeProgress,
  
} from '@/db/schema';
import { eq, desc, sql, and, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'weekly';
    const limit = parseInt(searchParams.get('limit') || '20');

    let timeFilter;
    const now = new Date();
    
    switch (type) {
      case 'weekly':
        timeFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        timeFilter = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'allTime':
        timeFilter = new Date(0); // Beginning of time
        break;
      default:
        timeFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get leaderboard entries
    const entries = await db
      .select({
        userId: userProgress.userId,
        userName: userProgress.userName,
        userImageSrc: userProgress.userImageSrc,
        points: userProgress.points,
        hearts: userProgress.hearts,
      })
      .from(userProgress)
      .orderBy(desc(userProgress.points))
      .limit(limit);

    // Calculate ranks and format response
    const leaderboard = entries.map((entry: { userId: any; userName: any; userImageSrc: any; points: any; }, index: number) => ({
      rank: index + 1,
      userId: entry.userId,
      userName: entry.userName,
      userImageSrc: entry.userImageSrc,
      weeklyPoints: type === 'weekly' ? entry.points : 0,
      monthlyPoints: type === 'monthly' ? entry.points : 0,
      allTimePoints: entry.points,
      streak: 0, // Calculate streak separately if needed
    }));

    // Find current user's position
    const currentUserRank = leaderboard.findIndex((entry: { userId: any; }) => entry.userId === user.id) + 1;

    return NextResponse.json({
      success: true,
      leaderboard,
      currentUserRank,
      type,
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, points } = await request.json();

    if (action === 'updatePoints' && typeof points === 'number') {
      // Update leaderboard entry
      await db
        .insert(leaderboardEntries)
        .values({
          userId: user.id,
          weeklyPoints: points,
          monthlyPoints: points,
          allTimePoints: points,
          lastActivity: new Date(),
        })
        .onConflictDoUpdate({
          target: [leaderboardEntries.userId],
          set: {
            weeklyPoints: sql`${leaderboardEntries.weeklyPoints} + ${points}`,
            monthlyPoints: sql`${leaderboardEntries.monthlyPoints} + ${points}`,
            allTimePoints: sql`${leaderboardEntries.allTimePoints} + ${points}`,
            lastActivity: new Date(),
          },
        });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Leaderboard update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}