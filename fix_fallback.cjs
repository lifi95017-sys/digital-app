const fs = require('fs');

function fixErrors(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Make sure the 404 error triggers a fallback instead of immediate failure
  content = content.replace(
    /if \(\(errorMessage\.includes\("UNAVAILABLE"\) \|\| errorMessage\.includes\("high demand"\) \|\| errorMessage\.includes\("503"\) \|\| errorMessage\.includes\("429"\) \|\| errorMessage\.includes\("Quota"\) \|\| errorMessage\.includes\("404"\) \|\| errorMessage\.includes\("not found"\) \|\| errorMessage\.includes\("available"\)\) && retries > 0\) \{/g,
    'if ((errorMessage.includes("UNAVAILABLE") || errorMessage.includes("high demand") || errorMessage.includes("503") || errorMessage.includes("429") || errorMessage.includes("Quota") || errorMessage.includes("404") || errorMessage.includes("not found") || errorMessage.includes("available")) && currentModelIndex < modelsToTry.length - 1) {'
  );
  
  fs.writeFileSync(file, content);
}

fixErrors('server.ts');
fixErrors('api/index.ts');
