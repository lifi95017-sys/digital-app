import pptxgen from 'pptxgenjs';
let pres = new pptxgen();
let slide = pres.addSlide();
slide.background = { color: 'FF0000' };
slide.addText('Hello World', { x: 1, y: 1, color: 'FFFFFF' });
pres.writeFile({ fileName: 'test.pptx' }).then(() => console.log('done')).catch(console.error);
