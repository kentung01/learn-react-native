import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const logFile = 'debug.log';
function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
}

// Clear log file
if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

log('DEBUG: Starting script');
log('DEBUG: DATABASE_URL is ' + (process.env.DATABASE_URL ? 'DEFINED' : 'UNDEFINED'));

try {
    log('DEBUG: Initializing PrismaClient (no args)...');
    const prisma = new PrismaClient();
    log('DEBUG: PrismaClient initialized');

    log('DEBUG: Connecting to database...');
    await prisma.$connect();
    log('DEBUG: Connected successfully!');

    await prisma.$disconnect();
    log('DEBUG: Disconnected');
} catch (error) {
    log('DEBUG: ERROR CAUGHT: ' + error.stack);
}
