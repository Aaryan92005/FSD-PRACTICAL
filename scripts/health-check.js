#!/usr/bin/env node

/**
 * Enhanced Health Check Script for Grocery ERP
 * Tests both backend API and database connectivity
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Configuration
const config = {
  backend: {
    url: process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000',
    healthPath: '/api/health',
    timeout: 10000
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
    timeout: 5000
  }
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function makeRequest(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'GET',
      timeout: timeout,
      headers: {
        'User-Agent': 'Grocery-ERP-Health-Check/1.0'
      }
    };

    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          url: url
        });
      });
    });

    req.on('error', (err) => {
      reject({
        error: err.message,
        url: url
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        error: 'Request timeout',
        url: url
      });
    });

    req.end();
  });
}

async function checkBackendHealth() {
  log('🔍 Checking backend health...', colors.blue);
  
  // Test both health endpoints
  const endpoints = [
    { path: '/health', name: 'Simple Health Check' },
    { path: '/api/health', name: 'Detailed Health Check' }
  ];
  
  let allPassed = true;
  
  for (const endpoint of endpoints) {
    try {
      const healthUrl = `${config.backend.url}${endpoint.path}`;
      log(`   Testing ${endpoint.name}: ${endpoint.path}`, colors.blue);
      
      const response = await makeRequest(healthUrl, config.backend.timeout);
      
      if (response.statusCode === 200) {
        log(`   ✅ ${endpoint.name} passed`, colors.green);
        
        try {
          const healthData = JSON.parse(response.data);
          log(`      Status: ${healthData.status}`, colors.green);
          if (healthData.database) {
            log(`      Database: ${healthData.database.status}`, colors.green);
          }
          if (healthData.uptime) {
            log(`      Uptime: ${Math.round(healthData.uptime)}s`, colors.green);
          }
        } catch (e) {
          log('      Response received but not JSON format', colors.yellow);
        }
      } else {
        log(`   ❌ ${endpoint.name} failed with status: ${response.statusCode}`, colors.red);
        allPassed = false;
      }
    } catch (error) {
      log(`   ❌ ${endpoint.name} failed: ${error.error}`, colors.red);
      allPassed = false;
    }
  }
  
  return allPassed;
}

async function checkFrontendHealth() {
  log('🔍 Checking frontend availability...', colors.blue);
  
  try {
    const response = await makeRequest(config.frontend.url, config.frontend.timeout);
    
    if (response.statusCode === 200) {
      log('✅ Frontend is accessible', colors.green);
      return true;
    } else {
      log(`❌ Frontend check failed with status: ${response.statusCode}`, colors.red);
      return false;
    }
  } catch (error) {
    log(`❌ Frontend check failed: ${error.error}`, colors.red);
    log(`   URL: ${error.url}`, colors.red);
    return false;
  }
}

async function runHealthChecks() {
  log('🏥 Starting Grocery ERP Health Checks...', colors.blue);
  log('=====================================', colors.blue);
  
  const results = {
    backend: false,
    frontend: false
  };
  
  // Check backend
  results.backend = await checkBackendHealth();
  
  // Check frontend (optional in some environments)
  if (process.env.SKIP_FRONTEND_CHECK !== 'true') {
    results.frontend = await checkFrontendHealth();
  } else {
    log('⏭️  Frontend check skipped', colors.yellow);
    results.frontend = true;
  }
  
  log('=====================================', colors.blue);
  
  // Summary
  const allPassed = results.backend && results.frontend;
  
  if (allPassed) {
    log('🎉 All health checks passed!', colors.green);
    process.exit(0);
  } else {
    log('💥 Some health checks failed!', colors.red);
    log(`   Backend: ${results.backend ? '✅' : '❌'}`, colors.reset);
    log(`   Frontend: ${results.frontend ? '✅' : '❌'}`, colors.reset);
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--backend-only')) {
  process.env.SKIP_FRONTEND_CHECK = 'true';
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Grocery ERP Health Check Script

Usage: node health-check.js [options]

Options:
  --backend-only    Only check backend health
  --help, -h        Show this help message

Environment Variables:
  BACKEND_URL       Backend URL (default: http://localhost:5000)
  FRONTEND_URL      Frontend URL (default: http://localhost:3000)
  SKIP_FRONTEND_CHECK  Set to 'true' to skip frontend check
  `);
  process.exit(0);
}

// Run the health checks
runHealthChecks().catch((error) => {
  log(`💥 Unexpected error: ${error.message}`, colors.red);
  process.exit(1);
});