import pptxgen from 'pptxgenjs';
let pres = new pptxgen();
let slide = pres.addSlide();
slide.addImage({ path: 'https://image.pollinations.ai/prompt/cute%20cat?width=400&height=300&nologo=true', x: 1, y: 1, w: 4, h: 3 });
pres.writeFile({ fileName: 'test_img.pptx' }).then(() => console.log('done')).catch(console.error);
