const fs = require('fs');

let serverContent = fs.readFileSync('server.ts', 'utf8');

const startIndex = serverContent.indexOf('const app = express();');
const endIndex = serverContent.indexOf('if (process.env.NODE_ENV !== "production") {');

let routesContent = serverContent.substring(startIndex, endIndex);

let apiIndexContent = `import express from "express";
import { GoogleGenAI } from "@google/genai";

` + routesContent + `

export default app;
`;

fs.writeFileSync('api/index.ts', apiIndexContent);

let vercelJson = {
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.ts"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelJson, null, 2));

console.log("Created api/index.ts and vercel.json");
