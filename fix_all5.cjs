const fs = require('fs');
function fixSeaPlm() {
  let content = fs.readFileSync('src/components/SeaPlmTestView.tsx', 'utf8');
  // I need to add one `}` before `catch (error) {`
  content = content.replace(/      \} catch \(error\) \{/g, '      }\n    } catch (error) {');
  fs.writeFileSync('src/components/SeaPlmTestView.tsx', content);
}
function fixPisa() {
  let content = fs.readFileSync('src/components/PisaTestView.tsx', 'utf8');
  // Pisa has } catch (err) {
  content = content.replace(/      \} catch \(err\) \{/g, '      }\n    } catch (err) {');
  fs.writeFileSync('src/components/PisaTestView.tsx', content);
}
function fixSlide() {
  let content = fs.readFileSync('src/components/SlideGeneratorModal.tsx', 'utf8');
  // Slide Generator had: 
  content = content.replace(/      \} catch \(error\) \{/g, '      }\n    } catch (error) {');
  // Also wait, maybe it didn't have catch? 
  // SlideGeneratorModal had `try {` ?
  // Let's just fix it later, I'll see what's wrong.
  fs.writeFileSync('src/components/SlideGeneratorModal.tsx', content);
}
function fixWorksheet() {
  let content = fs.readFileSync('src/components/WorksheetModal.tsx', 'utf8');
  content = content.replace(/      \} catch \(error\) \{/g, '      }\n    } catch (error) {');
  fs.writeFileSync('src/components/WorksheetModal.tsx', content);
}
function fixLessonPlanForm() {
  let content = fs.readFileSync('src/components/LessonPlanForm.tsx', 'utf8');
  // LessonPlanForm had:
  // }
  // }
  // try {
  // Let's ensure it has `} }` before `try { let cleanedText = ...`
  content = content.replace(/        \}[\s\n]*try \{[\s\n]*let cleanedText = text\.replace/g, '      }\n    }\n    try {\n        let cleanedText = text.replace');
  // And there are two of them (handleAnalyze, handleGenerateAI).
  fs.writeFileSync('src/components/LessonPlanForm.tsx', content);
}

fixSeaPlm();
fixPisa();
fixSlide();
fixWorksheet();
fixLessonPlanForm();
