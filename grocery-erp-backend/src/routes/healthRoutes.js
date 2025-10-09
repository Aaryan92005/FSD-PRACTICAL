const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/**
 * Health Check Endpoint
 * GET /api/health
 * Returns application health status including database connectivity
 */
router.get('/health', async (req, res) => {
  try {
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: 'disconnected',
        responseTime: null
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
        external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100
      }
    };

    // Check database connectivity
    const dbStart = Date.now();
    try {
      await mongoose.connection.db.admin().ping();
      healthCheck.database.status = 'connected';
      healthCheck.database.responseTime = Date.now() - dbStart;
    } catch (dbError) {
      healthCheck.database.status = 'error';
      healthCheck.database.error = dbError.message;
      healthCheck.status = 'DEGRADED';
    }

    // Set appropriate HTTP status code
    const statusCode = healthCheck.status === 'OK' ? 200 : 503;
    
    res.status(statusCode).json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message,
      uptime: process.uptime()
    });
  }
});

/**
 * Readiness Check Endpoint
 * GET /api/ready
 * Returns 200 when application is ready to serve requests
 */
router.get('/ready', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: 'NOT_READY',
        message: 'Database not connected',
        timestamp: new Date().toISOString()
      });
    }

    // Additional readiness checks can be added here
    // e.g., external service dependencies, cache connectivity, etc.

    res.status(200).json({
      status: 'READY',
      timestamp: new Date().toISOString(),
      message: 'Application is ready to serve requests'
    });
  } catch (error) {
    res.status(503).json({
      status: 'NOT_READY',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Liveness Check Endpoint
 * GET /api/live
 * Returns 200 if application is running (basic liveness check)
 */
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'ALIVE',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    pid: process.pid
  });
});

module.exports = router;