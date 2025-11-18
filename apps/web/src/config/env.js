/**
 * Environment Variable Validation
 * 
 * This module validates that all required environment variables are set
 * before the application starts. This prevents runtime errors and provides
 * clear error messages during development and deployment.
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'AUTH_SECRET',
];

const optionalEnvVars = [
  'UPLOADCARE_PUBLIC_KEY',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
];

/**
 * Validates that all required environment variables are set
 * @throws {Error} If any required environment variable is missing
 */
export function validateEnv() {
  const missing = [];
  const warnings = [];

  // Check required variables
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Check optional variables (just warn)
  optionalEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  });

  // Throw error if required variables are missing
  if (missing.length > 0) {
    const errorMessage = `
╔════════════════════════════════════════════════════════════════╗
║                  MISSING ENVIRONMENT VARIABLES                 ║
╚════════════════════════════════════════════════════════════════╝

The following required environment variables are not set:

${missing.map(v => `  ❌ ${v}`).join('\n')}

Please create a .env file in the apps/web directory with these variables.
See .env.example for reference.

Required variables:
${requiredEnvVars.map(v => `  - ${v}`).join('\n')}
`;
    throw new Error(errorMessage);
  }

  // Log warnings for optional variables
  if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn('\n⚠️  Optional environment variables not set:');
    warnings.forEach(v => console.warn(`   - ${v}`));
    console.warn('   Some features may not work correctly.\n');
  }

  // Validate AUTH_SECRET length
  if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.length < 32) {
    console.warn('\n⚠️  WARNING: AUTH_SECRET should be at least 32 characters long for security.\n');
  }

  // Success message in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ Environment variables validated successfully');
  }
}

// Auto-validate on import
validateEnv();

