const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add view condition
content = content.replace(
  /\{view === 'score-analysis' && <ScoreAnalysisView onBack=\{onBack\} \/>\}/,
  "{view === 'score-analysis' && <ScoreAnalysisView onBack={onBack} />}\n              {view === 'question-bank' && <QuestionBankView />}"
);

// Add to the exclusion list for "ផ្នែកនេះកំពុងអភិវឌ្ឍ..."
content = content.replace(
  /'sea-plm-test', 'homework'\]/,
  "'sea-plm-test', 'homework', 'question-bank']"
);

fs.writeFileSync('src/App.tsx', content);
