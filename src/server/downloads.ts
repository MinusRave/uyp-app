import { HttpError } from 'wasp/server';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to configure middleware (e.g. CORS) - REMOVED (Handled Globally)


export const downloadPdf = async (req: any, res: any, context: any) => {
    // 1. Authentication / Authorization Check
    let isAuthorized = false;

    // A. Check via User Context (Logged in)
    if (context.user) {
        const paidSession = await context.entities.TestSession.findFirst({
            where: {
                userId: context.user.id,
                isPaid: true,
            },
        });
        if (paidSession) isAuthorized = true;
    }

    // B. Check via Session ID Query Param (Guest / Magic Link)
    if (!isAuthorized && req.query.sessionId) {
        const session = await context.entities.TestSession.findUnique({
            where: { id: req.query.sessionId },
        });
        if (session && session.isPaid) {
            isAuthorized = true;
        }
    }

    if (!isAuthorized) {
        throw new HttpError(403, 'Forbidden: Active paid session required.');
    }

    // 3. File Retrieval
    const filename = req.params.filename;

    // Security: Prevent directory traversal
    const safeFilename = path.basename(filename);

    // Robust Path Resolution
    // In Wasp dev, __dirname is inside .wasp/out/server/... 
    // We need to find the 'app/private/pdfs' folder which might not be copied to build.
    // We check relative path, then project root relative, then absolute fallback.
    const possiblePaths = [
        path.join(__dirname, '../../private/pdfs'), // Original relative
        path.join(process.cwd(), 'private/pdfs'),   // Server root relative
        path.join(process.cwd(), '../private/pdfs'), // One up from server root
        '/home/minusrave/projects/understandyourpartner/uyp-app/app/private/pdfs' // Absolute Fallback (WSL Specific)
    ];

    let filePath = '';
    let found = false;

    for (const dir of possiblePaths) {
        const testPath = path.join(dir, safeFilename);
        if (fs.existsSync(testPath)) {
            filePath = testPath;
            found = true;
            break;
        }
    }

    if (!found) {
        console.error(`PDF not found. Checked paths: ${possiblePaths.join(', ')}`);
        throw new HttpError(404, 'File not found');
    }

    // 4. Stream File
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
};
