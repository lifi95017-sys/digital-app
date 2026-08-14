import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

// Replace modelsToTry in generateLessonPlan
content = content.replace(/let modelsToTry = \["gemini-2\.5-flash", "gemini-3\.1-pro-preview"\];/g, 'let modelsToTry = ["gemini-1.5-flash", "gemini-2.5-flash", "gemini-1.5-pro", "gemini-3.1-pro-preview"];');

// Update the errorMessage catch
content = content.replace(/if \(errorMessage\.includes\("UNAVAILABLE"\) \|\| errorMessage\.includes\("high demand"\) \|\| errorMessage\.includes\("503"\)\) \{/g, 'if (errorMessage.includes("UNAVAILABLE") || errorMessage.includes("high demand") || errorMessage.includes("503") || errorMessage.includes("429") || errorMessage.includes("Quota")) {');

// Update the friendly message
content = content.replace(/errorMessage = "ប្រព័ន្ធ AI កំពុងមានអ្នកប្រើប្រាស់ច្រើន \(High Demand\)។ សូមរង់ចាំបន្តិច រួចព្យាយាមម្ដងទៀត។";/g, 'errorMessage = "ប្រព័ន្ធ AI កំពុងមានអ្នកប្រើប្រាស់ច្រើន ឬអស់កូតា (High Demand / Quota Exceeded)។ សូមរង់ចាំបន្តិច រួចព្យាយាមម្ដងទៀត។";');

fs.writeFileSync('server.ts', content);
