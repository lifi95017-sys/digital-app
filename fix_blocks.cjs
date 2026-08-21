const fs = require('fs');

function fixPisaAndSeaPlm(file) {
  let content = fs.readFileSync(file, 'utf8');
  // In PisaTestView and SeaPlmTestView, we have:
  //              if (parsed.text) {
  //                fullText += parsed.text;
  //                setGeneratedText(fullText);
  //              } catch (e: any) {
  content = content.replace(/\}\s*catch\s*\(e:\s*any\)\s*\{/g, '}\n            } catch (e: any) {');
  // It added an extra } for the try block. But let's check if the if block is closed properly.
  // Wait, if it was `if (parsed.text) { fullText += parsed.text; setGeneratedText(fullText); }`
  // Then my replace made it `if (...) { ... } catch (e: any) {`. So it's missing the `}` to close the `try` block.
  fs.writeFileSync(file, content);
}

function fixLessonPlan(file) {
  let content = fs.readFileSync(file, 'utf8');
  // In LessonPlanForm.tsx, we have:
  //              if (parsed.text) text += parsed.text;
  //            } 
  //            } catch (e: any) {
  // Wait, earlier I replaced `} } catch` with `} catch` in fix_syntax.cjs
  // So it became:
  //              if (parsed.text) text += parsed.text;
  //            } catch (e: any) {
  // Which actually closes the try block correctly! But then there is an extra `}` at the end of the while loop.
  // Let's see the while loop in LessonPlanForm.
  fs.writeFileSync(file, content);
}

fixPisaAndSeaPlm('src/components/PisaTestView.tsx');
fixPisaAndSeaPlm('src/components/SeaPlmTestView.tsx');
fixPisaAndSeaPlm('src/components/WorksheetModal.tsx');
fixPisaAndSeaPlm('src/components/SlideGeneratorModal.tsx');
// Now let's just write a regex to clean up LessonPlanForm.tsx
