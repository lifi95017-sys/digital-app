const fs = require('fs');

function fixSlide() {
  let content = fs.readFileSync('src/components/SlideGeneratorModal.tsx', 'utf8');
  // It has: 
  //        }
  //      }
  //      }
  //      text = text.replace
  // Let's remove the extra `}`! Wait, the loop has 3 `}`! 
  // 1: `}` for `if`
  // 2: `}` for `for`
  // 3: `}` for `while`
  // So there should be 3 `}`. But my regex in fix_all.cjs left one `}`.
  // Wait, I see two `}` in the cat output!
  //      }
  //      }
  //      text = text.replace
  // And it complains `catch or finally expected`.
  // Let's just fix the missing try!
  // Wait, is there a `try`? 
  //       const parsedSlides = JSON.parse(text);
  //       setSlides(parsedSlides);
  //     } catch (error) {
  // It has `} catch (error) {` at the end! 
  // Where is the `try {` ?
  // It was at the beginning of `handleGenerate`!
  // I need to make sure there are NO extra `}` that prematurely close the `try {`.
  // Let's replace `      }\n      }\n      text = text.replace` with `      }\n      text = text.replace` if it's an extra `}`.
  content = content.replace(/      \}\n      \}\n      text = text\.replace/g, '      text = text.replace');
  // Wait, `try { JSON.parse(text); ... } catch (error) {`
  fs.writeFileSync('src/components/SlideGeneratorModal.tsx', content);
}

function fixWorksheet() {
  let content = fs.readFileSync('src/components/WorksheetModal.tsx', 'utf8');
  content = content.replace(/      \}\n      \}\n      text = text\.replace/g, '      text = text.replace');
  fs.writeFileSync('src/components/WorksheetModal.tsx', content);
}

fixSlide();
fixWorksheet();
