import  db  from '../db/drizzle.js';
import { achievements } from '../db/schema.js';
import { defaultAchievements } from '../lib/achievements.js';

async function setupAI() {
  console.log('🚀 Setting up AI features for Lingo...');
  
  try {
    // Initialize default achievements
    console.log('📊 Initializing achievements...');
    for (const achievement of defaultAchievements) {
      await db
        .insert(achievements)
        .values(achievement)
        .onConflictDoNothing();
    }
    console.log('✅ Achievements initialized');
    
    // Verify Hugging Face API key
    console.log('🔑 Checking Hugging Face API key...');
    if (!process.env.HUGGINGFACE_API_KEY) {
      console.warn('⚠️  HUGGINGFACE_API_KEY not found in environment variables');
      console.log('   Please add it to your .env.local file');
    } else {
      console.log('✅ Hugging Face API key found');
    }
    
    console.log('🎉 AI setup complete!');
    console.log('   You can now use:');
    console.log('   - AI Course Generator at /ai-generator');
    console.log('   - Enhanced Achievements at /achievements');
    console.log('   - Dynamic Leaderboards at /leaderboard');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupAI();