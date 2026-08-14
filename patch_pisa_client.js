import fs from 'fs';

let content = fs.readFileSync('src/components/PisaTestView.tsx', 'utf8');

const oldFetch = `      const response = await fetch('/api/generatePisaTest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lesson: selectedLesson,
          grade: activeGrade,
          subject: 'វិទ្យាសាស្ត្រ'
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setGeneratedText(data.text);
      } else {
        setGeneratedText('សូមអភ័យទោស មានបញ្ហាក្នុងការបង្កើតតេស្ត PISA៖ ' + (data.error || ''));
      }`;

const newFetch = `      const response = await fetch('/api/generatePisaTest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lesson: selectedLesson,
          grade: activeGrade,
          subject: 'វិទ្យាសាស្ត្រ'
        }),
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setGeneratedText('សូមអភ័យទោស មានបញ្ហាក្នុងការបង្កើតតេស្ត PISA៖ ' + (data.error || 'Server error'));
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No reader');
      
      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                fullText += parsed.text;
                setGeneratedText(fullText);
              }
            } catch (e) {}
          }
        }
      }`;

if (content.includes("const data = await response.json();")) {
  content = content.replace(oldFetch, newFetch);
  fs.writeFileSync('src/components/PisaTestView.tsx', content);
  console.log("Patched PisaTestView.tsx");
} else {
  console.log("Could not find fetch call in PisaTestView.tsx");
}
