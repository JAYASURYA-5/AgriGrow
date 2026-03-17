#!/usr/bin/env node

/**
 * Database Deployment Script
 * Executes all login database migrations in order
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Migration files in order
const migrations = [
  '001_create_users_table.sql',
  '002_create_sessions_table.sql',
  '003_create_password_reset_tokens_table.sql',
  '004_create_email_verification_tokens_table.sql',
  '005_create_login_attempts_table.sql',
  '006_create_user_profiles_table.sql',
  '007_create_user_roles_table.sql',
];

async function executeMigration(filename) {
  try {
    const filepath = path.join(import.meta.url.replace('file://', ''), '../../database/migrations', filename);
    const sql = fs.readFileSync(filepath.replace(/\\/g, '/').split('/').slice(0, -1).join('/') + '/' + filename, 'utf-8');

    console.log(`\n⏳ Executing: ${filename}`);

    // Note: Supabase JS client doesn't have direct SQL execution
    // This requires using the Postgres connection directly
    console.log(`✅ Migration prepared: ${filename}`);
    console.log(`📝 This migration needs to be executed via Supabase SQL Editor`);

    return true;
  } catch (error) {
    console.error(`❌ Error reading migration ${filename}:`, error.message);
    return false;
  }
}

async function deployDatabase() {
  console.log('🚀 Starting Database Deployment');
  console.log('━'.repeat(50));

  let successCount = 0;
  let failureCount = 0;

  for (const migration of migrations) {
    const success = await executeMigration(migration);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  console.log('\n' + '━'.repeat(50));
  console.log(`\n📊 Deployment Summary:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failureCount}`);

  if (failureCount === 0) {
    console.log(`\n✨ All migrations prepared successfully!`);
    console.log(`\n📋 Next steps:`);
    console.log(`   1. Go to Supabase Dashboard (https://app.supabase.com)`);
    console.log(`   2. Open SQL Editor`);
    console.log(`   3. Copy and execute each migration file in order`);
    console.log(`   4. Verify tables in Table Editor`);
  } else {
    console.log(`\n⚠️  Some migrations failed. Please check the errors above.`);
    process.exit(1);
  }
}

deployDatabase().catch(console.error);
