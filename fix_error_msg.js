import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /errorMessage = "ប្រព័ន្ធ AI កំពុងមានអ្នកប្រើប្រាស់ច្រើន ឬអស់កូតា \(High Demand \/ Quota Exceeded\)។ សូមរង់ចាំបន្តិច រួចព្យាយាមម្ដងទៀត។";/g;
const newMsg = 'errorMessage = "ប្រព័ន្ធ AI អស់កូតាប្រើប្រាស់ (Quota Exceeded)។ សូមកំណត់ API Key ផ្ទាល់ខ្លួនរបស់អ្នកនៅក្នុង Settings ដើម្បីបន្តប្រើប្រាស់។";';

content = content.replace(regex, newMsg);
fs.writeFileSync('server.ts', content);
