import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

// The issue might be that it's returning a 500 error, and the prompt text is too long or models are unavailable
// Let's add more logs
content = content.replace(/catch \(error: any\) \{\s*console\.error\("Error in generateLessonPlan:", error\);/g, 'catch (error: any) { console.error("Error in generateLessonPlan:", error.message || error);');

fs.writeFileSync('server.ts', content);
