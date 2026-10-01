const fs = require('fs');
const file = 'src/components/WorksheetModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'onClick={handleExportWord}\n                disabled={isLoading || !content || isDownloading}',
  'onClick={handleExportWord}\n                disabled={isLoading || !content}'
);

content = content.replace(
  'onClick={handleDownloadPDF}\n                disabled={isLoading || !content}',
  'onClick={handleDownloadPDF}\n                disabled={isLoading || !content || isDownloading}'
);

fs.writeFileSync(file, content);
