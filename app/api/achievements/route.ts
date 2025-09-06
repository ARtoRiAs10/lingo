// import { NextRequest, NextResponse } from 'next/server';
// import { currentUser } from '@clerk/nextjs/server';
// import { checkAndUnlockAchievements, getUserAchievements } from '@/lib/achievements';

// export async function GET(request: NextRequest) {
//   try {
//     const user = await currentUser();
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const userAchievements = await getUserAchievements(user.id);

//     return NextResponse.json({
//       success: true,
//       achievements: userAchievements,
//     });

//   } catch (error) {
//     console.error('Achievements API error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const user = await currentUser();
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { action } = await request.json();

//     if (action === 'check') {
//       const newAchievements = await checkAndUnlockAchievements(user.id);
      
//       return NextResponse.json({
//         success: true,
//         newAchievements,
//         count: newAchievements.length,
//       });
//     }

//     return NextResponse.json(
//       { error: 'Invalid action' },
//       { status: 400 }
//     );

//   } catch (error) {
//     console.error('Achievement check error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// app/api/achievements/route.ts
import { getUserAchievements } from "@/lib/achievements";
import { NextRequest, NextResponse } from "next/server";
// import { getUserAchievements } from "@/db/achievements";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  try {
    const achievements = await getUserAchievements(userId);
    return NextResponse.json(achievements);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}
