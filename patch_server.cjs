const fs = require('fs');
const file = 'server.ts';
let content = fs.readFileSync(file, 'utf8');

const targetContent = `          if ((errorMessage.includes("UNAVAILABLE") || errorMessage.includes("high demand") || errorMessage.includes("503") || errorMessage.includes("429") || errorMessage.includes("Quota") || errorMessage.includes("404") || errorMessage.includes("not found")) && currentModelIndex < modelsToTry.length - 1) {
            console.log(\`Retrying... (\${retries} retries left)\`);
            currentModelIndex = (currentModelIndex + 1) % modelsToTry.length;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 1.25; 
          } else {
            throw error;
          }`;

const replacementContent = `          if (errorMessage.includes("UNAVAILABLE") || errorMessage.includes("high demand") || errorMessage.includes("503") || errorMessage.includes("429") || errorMessage.includes("Quota") || errorMessage.includes("404") || errorMessage.includes("not found") || errorMessage.includes("500")) {
            console.log(\`Retrying... (\${retries} retries left)\`);
            currentModelIndex = (currentModelIndex + 1) % modelsToTry.length;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 1.5; // Backoff a bit more
          } else {
            throw error;
          }`;

content = content.replace(targetContent, replacementContent);
fs.writeFileSync(file, content);
