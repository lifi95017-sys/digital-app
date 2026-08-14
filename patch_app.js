import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes("import PisaTestView")) {
  content = content.replace(
    "import GenericPDFArchiveView from './components/GenericPDFArchiveView';",
    "import GenericPDFArchiveView from './components/GenericPDFArchiveView';\nimport PisaTestView from './components/PisaTestView';"
  );
}

const oldPisaBlock = `              {view === 'pisa-test' && (
                <GenericPDFArchiveView 
                  title="PISA TEST"
                  description="បណ្តុំវិញ្ញាសារតេស្ត PISA សម្រាប់វាស់ស្ទង់សមត្ថភាពសិស្ស"
                  onBack={onBack} 
                  pdfs={pisaFiles}
                  onSavePDF={(pdf) => setPisaFiles([...pisaFiles, pdf as LibraryFile])}
                  onDeletePDF={(id) => setPisaFiles(pisaFiles.filter(p => p.id !== id))}
                />
              )}`;

const newPisaBlock = `              {view === 'pisa-test' && (
                <PisaTestView 
                  onBack={onBack} 
                  files={pisaFiles}
                  onSaveFile={(pdf) => setPisaFiles([...pisaFiles, pdf as LibraryFile])}
                  onDeleteFile={(id) => setPisaFiles(pisaFiles.filter(p => p.id !== id))}
                />
              )}`;

content = content.replace(oldPisaBlock, newPisaBlock);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx");
