const fs = require('fs');

const files = [
  'src/components/WorksheetModal.tsx',
  'src/components/PisaTestView.tsx',
  'src/components/SeaPlmTestView.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Add imports
  if (!content.includes('remarkMath')) {
    content = content.replace(
      "import Markdown from 'react-markdown';",
      "import Markdown from 'react-markdown';\nimport remarkMath from 'remark-math';\nimport rehypeKatex from 'rehype-katex';\nimport remarkGfm from 'remark-gfm';"
    );
  }
  
  // Update <Markdown> tags
  content = content.replace(
    /<Markdown\s*\n\s*components=/g,
    "<Markdown\n                      remarkPlugins={[remarkMath, remarkGfm]}\n                      rehypePlugins={[rehypeKatex]}\n                      components="
  );
  
  // If it's all on one line or different format:
  content = content.replace(
    /<Markdown([^>]*)>/g,
    (match, props) => {
      if (props.includes('remarkPlugins')) return match;
      return `<Markdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]} ${props}>`;
    }
  );

  fs.writeFileSync(file, content);
}
