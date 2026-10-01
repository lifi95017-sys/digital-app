import { Grade } from '../types';
import { analyzeAndRecommendGame, EducationalGame } from '../data/educationalGames';

export interface LessonPedagogyResult {
  teachingMethod: string;
  strategies: string[];
  strategyText: string;
  objectives: {
    knowledge: string;
    skills: string;
    attitude: string;
  };
  educationalGame: EducationalGame;
  bloomsLevel: string;
  rationale: string;
}

/**
 * Intelligent Pedagogical Analyzer for Primary (Grades 1-6) and Secondary Lessons
 * Combines Bloom's Taxonomy, MoEYS Curriculum Standards, and 21st-century active learning.
 */
export function analyzeLessonPedagogy(
  grade: Grade | number = 4,
  subject: string = 'ភាសាខ្មែរ',
  lessonTitle: string = '',
  chapterTitle: string = '',
  lessonContentText: string = ''
): LessonPedagogyResult {
  const sTitle = (lessonTitle || '').trim();
  const cTitle = (chapterTitle || '').trim();
  const combinedText = `${sTitle} ${cTitle} ${lessonContentText}`.toLowerCase();
  const subj = (subject || '').trim();
  const numGrade = Number(grade) || 4;

  let teachingMethod = 'ម៉ូដែលបង្រៀនបែប 5E (5E Instructional Model)';
  let strategies: string[] = ['ការអនុវត្តផ្ទាល់ (Hands-on Activity)', 'ការគិត-ចាប់គូ-ចែករំលែក (Think-Pair-Share)'];
  let bloomsLevel = 'កម្រិតយល់ដឹង (Understanding) និងការអនុវត្ត (Applying)';

  // Determine Methodology and Strategies based on Subject and Grade
  if (subj.includes('វិទ្យាសាស្ត្រ') || combinedText.includes('ពិសោធ') || combinedText.includes('សត្វ') || combinedText.includes('រុក្ខជាតិ')) {
    teachingMethod = 'ម៉ូដែលបង្រៀនបែប 5E (5E Instructional Model)';
    strategies = [
      'ការអនុវត្តផ្ទាល់ (Hands-on Activity)',
      'វិធីសាស្ត្ររៀនតាមបែបរិះរក (Inquiry-Based Learning - IBL)',
      'ការគិត-ចាប់គូ-ចែករំលែក (Think-Pair-Share)'
    ];
    bloomsLevel = numGrade <= 3 
      ? 'កម្រិតសង្កេត និងពណ៌នា (Observing & Explaining)' 
      : 'កម្រិតវិភាគ និងការស៊ើបអង្កេត (Analyzing & Investigating)';
  } else if (subj.includes('គណិត') || combinedText.includes('បូក') || combinedText.includes('ដក') || combinedText.includes('គុណ') || combinedText.includes('ចែក') || combinedText.includes('ប្រភាគ') || combinedText.includes('ធរណីមាត្រ')) {
    teachingMethod = 'វិធីសាស្ត្ររៀនតាមបែបដោះស្រាយបញ្ហា (Problem-Based Learning - PBL)';
    strategies = [
      'ការអនុវត្តផ្ទាល់ (Hands-on Activity)',
      'ការឆ្លើយតបជាបុគ្គល និងជាក្រុម (Individual & Group Practice)',
      'ការគិត-ចាប់គូ-ចែករំលែក (Think-Pair-Share)'
    ];
    bloomsLevel = numGrade <= 2 
      ? 'កម្រិតចងចាំ និងយល់ដឹងពីចំនួន (Remembering & Number Sense)' 
      : 'កម្រិតអនុវត្ត និងដោះស្រាយបញ្ហា (Applying & Problem Solving)';
  } else if (subj.includes('សិក្សាសង្គម') || combinedText.includes('ប្រវត្តិ') || combinedText.includes('ភូមិវិទ្យា') || combinedText.includes('សីលធម៌')) {
    teachingMethod = 'វិធីសាស្ត្ររៀនតាមបែបរិះរក (Inquiry-Based Learning - IBL)';
    strategies = [
      'ការពិភាក្សាជាក្រុម និងពិព័រណ៍វិចិត្រសាល (Gallery Walk)',
      'សំណួរគន្លឹះដាស់ការគិត (Critical Questioning)',
      'ការគិត-ចាប់គូ-ចែករំលែក (Think-Pair-Share)'
    ];
    bloomsLevel = 'កម្រិតយល់ដឹង បកស្រាយ និងការឆ្លុះបញ្ចាំង (Understanding & Reflecting)';
  } else {
    // ភាសាខ្មែរ (Khmer)
    if (combinedText.includes('អំណាន') || combinedText.includes('អាន') || combinedText.includes('កំណាព្យ')) {
      teachingMethod = 'វិធីសាស្ត្រសិស្សមជ្ឈមណ្ឌល (Student-Centered Approach)';
      strategies = [
        'ការអានឆ្លាស់គ្នា និងឆ្លើយសំណួរគន្លឹះ',
        'ការគិត-ចាប់គូ-ចែករំលែក (Think-Pair-Share)',
        'បច្ចេកទេស K-W-L (អ្វីដែលដឹង-ចង់ដឹង-បានរៀន)'
      ];
      bloomsLevel = 'កម្រិតយល់ន័យអត្ថបទ និងបកស្រាយ (Reading Comprehension & Interpreting)';
    } else if (combinedText.includes('សរសេរ') || combinedText.includes('តែងសេចក្ដី') || combinedText.includes('វេយ្យាករណ៍')) {
      teachingMethod = 'វិធីសាស្ត្ររៀនតាមបែបរិះរក (Inquiry-Based Learning - IBL)';
      strategies = [
        'ការអនុវត្តផ្ទាល់ (Hands-on Activity)',
        'ការត្រួតពិនិត្យ និងកែលម្អជាដៃគូ (Peer Editing)',
        'ល្បែងប្រណាំងសរសេរពាក្យលើក្តារខៀន'
      ];
      bloomsLevel = 'កម្រិតអនុវត្ត និងការបង្កើតថ្មី (Applying & Creating)';
    } else {
      teachingMethod = 'ម៉ូដែលបង្រៀនបែប 5E (5E Instructional Model)';
      strategies = [
        'ការអនុវត្តផ្ទាល់ (Hands-on Activity)',
        'ការគិត-ចាប់គូ-ចែករំលែក (Think-Pair-Share)',
        'ការលើកទឹកចិត្តសិស្សស្ងៀមស្ងាត់'
      ];
      bloomsLevel = 'កម្រិតយល់ដឹង និងការអនុវត្ត (Understanding & Applying)';
    }
  }

  // Construct 3 high-quality objectives aligned with MoEYS standard
  const topicName = sTitle || (cTitle ? `ជំពូក «${cTitle}»` : `មេរៀន ${subj}`);
  
  let knowledgeObj = '';
  let skillsObj = '';
  let attitudeObj = '';

  if (subj.includes('គណិត')) {
    knowledgeObj = `• ប្រាប់ពីគោលការណ៍ រូបមន្ត ឬវិធីសាស្ត្រគណនាក្នុង «${topicName}» បានត្រឹមត្រូវតាមរយៈការសង្កេត និងការពន្យល់របស់គ្រូ។`;
    skillsObj = `• អនុវត្តគណនា ឬដោះស្រាយលំហាត់ និងបញ្ហាក្នុង «${topicName}» បានច្បាស់លាស់ និងរហ័សរហួនតាមលំហាត់គំរូ និងល្បែងសិក្សា។`;
    attitudeObj = `• បណ្តុះស្មារតីស្រឡាញ់មុខវិជ្ជាគណិតវិទ្យា មានភាពហ្មត់ចត់ ច្បាស់លាស់ និងចេះជួយមិត្តភក្តិពេលធ្វើការជាក្រុម។`;
  } else if (subj.includes('វិទ្យាសាស្ត្រ')) {
    knowledgeObj = `• រៀបរាប់ និងពន្យល់ពីលក្ខណៈ ឬបាតុភូតពាក់ព័ន្ធនឹង «${topicName}» បានត្រឹមត្រូវតាមការពិសោធ និងពិភាក្សា។`;
    skillsObj = `• អនុវត្តការសង្កេត កត់ត្រា និងសន្និដ្ឋានទិន្នន័យជាក់ស្ដែងលើ «${topicName}» តាមរយៈការអនុវត្តផ្ទាល់ (Hands-on)។`;
    attitudeObj = `• បណ្តុះស្មារតីស្រឡាញ់ធម្មជាតិ ចង់ដឹងចង់ឃើញ និងយកចិត្តទុកដាក់ការពារបរិស្ថានជុំវិញខ្លួន។`;
  } else if (subj.includes('សិក្សាសង្គម')) {
    knowledgeObj = `• បញ្ជាក់ពីសារៈសំខាន់ ព្រឹត្តិការណ៍ ឬតម្លៃសីលធម៌ក្នុង «${topicName}» បានត្រឹមត្រូវតាមរយៈការស្រាវជ្រាវ និងពិភាក្សា។`;
    skillsObj = `• វិភាគ បកស្រាយ និងលើកឡើងពីដំណោះស្រាយសមស្របចំពោះបញ្ហាក្នុង «${topicName}» បានសមហេតុផល។`;
    attitudeObj = `• បណ្តុះស្មារតីស្រឡាញ់វប្បធម៌ សាមគ្គីភាព និងការរស់នៅចុះសម្រុងគ្នាក្នុងសង្គម។`;
  } else {
    // ភាសាខ្មែរ
    knowledgeObj = `• កំណត់ និងអានពាក្យគន្លឹះ ឃ្លា ឬខ្លឹមសារនៃ «${topicName}» បានត្រឹមត្រូវ និងយល់អត្ថន័យច្បាស់លាស់។`;
    skillsObj = `• អនុវត្តការអាន ការសរសេរ និងការឆ្លើយសំណួរគន្លឹះទាក់ទងនឹង «${topicName}» បានរលូន និងត្រឹមត្រូវតាមក្បួនភាសា។`;
    attitudeObj = `• បណ្តុះទម្លាប់ចូលចិត្តអាន និងសរសេរភាសាខ្មែរ មានទំនុកចិត្តក្នុងការឡើងបញ្ចេញមតិ និងចេះគោរពមតិមិត្តភក្តិ។`;
  }

  // Find optimal educational game for step 4
  const strategyStr = strategies.join(', ');
  const educationalGame = analyzeAndRecommendGame(teachingMethod, strategyStr, (numGrade as Grade), subj);

  const rationale = `ផ្អែកលើការវិភាគ Bloom's Taxonomy សម្រាប់សិស្សថ្នាក់ទី ${numGrade} មុខវិជ្ជា «${subj}» លើមេរៀន «${topicName}»៖ វិធីសាស្ត្រ «${teachingMethod}» ជួយបំប្លែងសិស្សឱ្យក្លាយជាអ្នកស្រាវជ្រាវផ្ទាល់ ចំណែកយុទ្ធវិធី «${strategies[0]}» ជួយពង្រឹងការយល់ដឹងតាមរយៈការអនុវត្តជាក់ស្ដែង។ នៅជំហានទី៤ ល្បែង «${educationalGame.name}» នឹងធ្វើការវាយតម្លៃលទ្ធផលសិក្សា និងពង្រឹងពុទ្ធិដោយភាពរំភើបរីករាយ។`;

  return {
    teachingMethod,
    strategies,
    strategyText: strategyStr,
    objectives: {
      knowledge: knowledgeObj,
      skills: skillsObj,
      attitude: attitudeObj
    },
    educationalGame,
    bloomsLevel,
    rationale
  };
}
