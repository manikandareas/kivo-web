#!/usr/bin/env npx tsx
/**
 * Environment validation script for production builds
 * Run this before building to ensure all required environment variables are set
 *
 * Requirements: 5.1
 */

import {
  validateEnv,
  requiredServerEnvVars,
  requiredPublicEnvVars,
} from '../lib/env';

function main(): void {
  console.log('🔍 Validating environment variables...\n');

  const result = validateEnv(process.env);

  if (result.isValid) {
    console.log('✅ All required environment variables are set!\n');
    console.log('Server variables:');
    requiredServerEnvVars.forEach((v) => console.log(`  ✓ ${v}`));
    console.log('\nPublic variables:');
    requiredPublicEnvVars.forEach((v) => console.log(`  ✓ ${v}`));
    console.log('\n🚀 Ready to build for production!\n');
    process.exit(0);
  } else {
    console.error('❌ Environment validation failed!\n');
    console.error('Missing variables:');
    result.missingVars.forEach((v) => console.error(`  ✗ ${v}`));
    console.error('\nPlease set all required environment variables.');
    console.error('See .env.example for the required variables.\n');
    process.exit(1);
  }
}

main();
