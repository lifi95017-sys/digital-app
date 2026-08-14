import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes("import SeaPlmTestView")) {
  content = content.replace(
    "import PisaTestView from './components/PisaTestView';",
    "import PisaTestView from './components/PisaTestView';\nimport SeaPlmTestView from './components/SeaPlmTestView';"
  );
}

const oldBlock = `              {view === 'sea-plm-test' && (
                <GenericPDFArchiveView 
                  title="SEA-PLM TEST"
                  description="បណ្តុំវិញ្ញាសារតេស្ត SEA-PLM សម្រាប់កម្រិតបឋមសិក្សា"
                  onBack={onBack} 
                  pdfs={seaPlmFiles}
                  onSavePDF={(pdf) => setSeaPlmFiles([...seaPlmFiles, pdf as LibraryFile])}
                  onDeletePDF={(id) => setSeaPlmFiles(seaPlmFiles.filter(p => p.id !== id))}
                />
              )}`;

const newBlock = `              {view === 'sea-plm-test' && (
                <SeaPlmTestView 
                  onBack={onBack} 
                  files={seaPlmFiles}
                  onSaveFile={(pdf) => setSeaPlmFiles([...seaPlmFiles, pdf as LibraryFile])}
                  onDeleteFile={(id) => setSeaPlmFiles(seaPlmFiles.filter(p => p.id !== id))}
                />
              )}`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync('src/App.tsx', content);
