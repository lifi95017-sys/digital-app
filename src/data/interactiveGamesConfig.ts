export type GameInteractiveType =
  | 'synonym'          // ១. វេវចនសព្ទ (Word matching/synonym choice)
  | 'word-builder'      // ២. រៀបបណ្ណអក្សរ (Scrambled letters/word reordering)
  | 'number-finder'     // ៣. ប្រដាប់ស្វែងរកចំនួន (Target math filter)
  | 'math-challenge'    // ៤. ប្រជែងពីជគណិត (Rapid math solver)
  | 'math-gravity'      // ៥. ទំនាញលេខ (Chain calculation mental math)
  | 'board-slap'        // ៦. ទះក្ដារខៀន (Fast response reaction)
  | 'memory-card'       // ៧. កាតចងចាំ (Card flip pair matching)
  | 'hangman'           // ៨. ទស្សន៍ទាយអក្សរ (Hangman letter guess)
  | 'sentence-order'    // ៩. តម្រៀបកាត (Sequence sentence/story reorder)
  | 'puzzle-jigsaw'     // ១០. ផ្គុំរូប (4-piece jigsaw / reassemble)
  | 'odd-one-out'       // ១៦. រកចំណុចខុស (Spot difference / odd item out)
  | 'banana-game'       // ១៨. ផ្លែចេក (Guess banana replaced word)
  | 'fruit-market'      // ២០. ទិញផ្លែឈើ (Store calculator change)
  | 'traffic-light'     // ៣១. ចរាចរណ៍ (Red/Yellow/Green reaction action)
  | 'true-false'        // ៤១, ៥៥. ត្រូវ ខុស / ទះដៃ ឬមិនទះដៃ (True/False judgment)
  | 'secret-code'       // ៥៨. ទស្សន៍ទាយពាក្យតំណាងលេខ (Number to letter decoder)
  | 'classroom-timer';  // Quick classroom round timer with guidelines & rules

export interface InteractiveGameConfig {
  gameId: number;
  type: GameInteractiveType;
  title: string;
  themeColor: string; // Tailwind color token
  description: string;
  instructions: string;
  rounds?: number;
  // Specific data generator or static items
  data?: any;
}

export const getGameConfig = (gameId: number): InteractiveGameConfig => {
  switch (gameId) {
    case 1:
      return {
        gameId: 1,
        type: 'synonym',
        title: 'ល្បែងវេវចនសព្ទ (Synonym Match)',
        themeColor: 'emerald',
        description: 'ស្វែងរកពាក្យដែលមានន័យដូច ឬស្រដៀងនឹងពាក្យគន្លឹះ!',
        instructions: 'ជ្រើសរើសពាក្យវេវចនសព្ទដែលត្រូវនឹងពាក្យដែលបានបង្ហាញឱ្យបានរហ័ស។'
      };
    case 2:
      return {
        gameId: 2,
        type: 'word-builder',
        title: 'ល្បែងរៀបបណ្ណអក្សរ (Word Builder)',
        themeColor: 'blue',
        description: 'រៀបបណ្ណអក្សរដែលរាយប៉ាយឱ្យក្លាយជាពាក្យត្រឹមត្រូវ!',
        instructions: 'ចុចលើតួអក្សរតាមលំដាប់លំដោយដើម្បីផ្គុំជាពាក្យពេញលេញ។'
      };
    case 3:
      return {
        gameId: 3,
        type: 'number-finder',
        title: 'ល្បែងប្រដាប់ស្វែងរកចំនួន (Number Target Finder)',
        themeColor: 'purple',
        description: 'ប្រជែងគ្នារើសកាតលេខដែលត្រូវតាមលក្ខខណ្ឌ!',
        instructions: 'ចុចជ្រើសរើសគ្រប់លេខដែលត្រូវនឹងលក្ខខណ្ឌដែលបានកំណត់ (ឧទាហរណ៍៖ លេខគូ, ផលបូក, ពហុគុណ)។'
      };
    case 4:
      return {
        gameId: 4,
        type: 'math-challenge',
        title: 'ល្បែងប្រជែងពីជគណិត (Algebra & Math Challenge)',
        themeColor: 'amber',
        description: 'ប្រណាំងប្រជែងដោះស្រាយលំហាត់គណិតវិទ្យាឱ្យលឿននិងត្រឹមត្រូវ!',
        instructions: 'គណនាលំហាត់ឱ្យបានរហ័ស និងជ្រើសរើសចម្លើយត្រឹមត្រូវមុនពេលអស់ម៉ោង។'
      };
    case 5:
      return {
        gameId: 5,
        type: 'math-gravity',
        title: 'ល្បែងទំនាញលេខ (Chain Mental Math)',
        themeColor: 'rose',
        description: 'គណនាលេខបន្តបន្ទាប់គ្នាតាមសង្វាក់ទំនាញលេខ!',
        instructions: 'ចងចាំលេខមុន រួចអនុវត្តប្រមាណវិធីបន្តទៅមុខឥតឈប់ឈរ។'
      };
    case 6:
      return {
        gameId: 6,
        type: 'board-slap',
        title: 'ល្បែងទះក្ដារខៀន (Board Slap Reaction)',
        themeColor: 'red',
        description: 'ប្រជែងទះលើចម្លើយត្រឹមត្រូវឱ្យលឿនបំផុតនៅលើក្ដារខៀន!',
        instructions: 'សង្កេតសំណួរ រួចចុចទះលើផ្ទាំងចម្លើយត្រឹមត្រូវមុនគេបង្អស់។'
      };
    case 7:
    case 27:
      return {
        gameId,
        type: 'memory-card',
        title: 'ល្បែងកាតចងចាំ (Memory Card Pairs)',
        themeColor: 'teal',
        description: 'បើកផ្ទាំងកាតផ្គូផ្គងរូបភាព ពាក្យ ឬសំណួរ-ចម្លើយ!',
        instructions: 'បើកកាតម្ដង២ បើត្រូវគូគ្នានឹងទទួលបានពិន្ទុ បើខុសនឹងផ្កាប់វិញ។'
      };
    case 8:
      return {
        gameId: 8,
        type: 'hangman',
        title: 'ល្បែងទស្សន៍ទាយអក្សរ (Hangman Word Guess)',
        themeColor: 'indigo',
        description: 'ទាយតួអក្សរដើម្បីដឹងពីពាក្យអាថ៌កំបាំងមុនពេលអស់ជីវិត!',
        instructions: 'ចុចទាយតួអក្សរម្តងមួយៗ ប្រយ័ត្នកុំឱ្យទាយខុសលើសពី ៦ ដង។'
      };
    case 9:
    case 43:
      return {
        gameId,
        type: 'sentence-order',
        title: 'ល្បែងតម្រៀបកាត (Sentence & Card Order)',
        themeColor: 'cyan',
        description: 'តម្រៀបឃ្លា ឬប្រយោគឱ្យត្រូវតាមលំដាប់លំដោយត្រឹមត្រូវ!',
        instructions: 'ចុចលើកាតឃ្លាដើម្បីតម្រៀបជាលំដាប់លំដោយរឿង ឬកាលប្បវត្តិ។'
      };
    case 10:
      return {
        gameId: 10,
        type: 'puzzle-jigsaw',
        title: 'ល្បែងផ្គុំរូប និងអត្ថបទ (Tile Puzzle)',
        themeColor: 'emerald',
        description: 'ផ្គុំបំណែករាយប៉ាយឱ្យចេញជារូប ឬខ្លឹមសារដើម!',
        instructions: 'ចុចដោះដូរបំណែកដើម្បីតម្រៀបជារូបភាព ឬរូបមន្តពេញលេញ។'
      };
    case 14:
    case 50:
      return {
        gameId,
        type: 'synonym',
        title: 'ល្បែងភ្ជាប់ពាក្យ និងនិយមន័យ (Word Matcher)',
        themeColor: 'sky',
        description: 'ផ្គូផ្គងពាក្យទៅនឹងនិយមន័យ ឬពាក្យផ្ទុយ!',
        instructions: 'ជ្រើសរើសចម្លើយដែលជាគូពិតប្រាកដ។'
      };
    case 16:
      return {
        gameId: 16,
        type: 'odd-one-out',
        title: 'ល្បែងរកចំណុចខុស (Odd One Out)',
        themeColor: 'fuchsia',
        description: 'ស្វែងរកពាក្យ ឬចំនួនដែលខុសគេក្នុងចំណោមជម្រើស!',
        instructions: 'វិភាគលក្ខណៈសម្បត្តិ រួចជ្រើសរើសធាតុមួយគត់ដែលមិនត្រូវនឹងពួក។'
      };
    case 18:
      return {
        gameId: 18,
        type: 'banana-game',
        title: 'ល្បែងផ្លែចេក (Banana Word Puzzle)',
        themeColor: 'yellow',
        description: 'ទាយពាក្យពិតដែលត្រូវបានជំនួសដោយពាក្យ «ផ្លែចេក»!',
        instructions: 'អានប្រយោគ រួចទស្សន៍ទាយថាតើពាក្យ «ផ្លែចេក» តំណាងឱ្យពាក្យអ្វី។'
      };
    case 20:
      return {
        gameId: 20,
        type: 'fruit-market',
        title: 'ល្បែងទិញផ្លែឈើ (Fruit Market Cashier)',
        themeColor: 'lime',
        description: 'ដើរតួជាអ្នកទិញ-លក់ គណនាប្រាក់សរុប និងប្រាក់អាប់!',
        instructions: 'គណនាតម្លៃទំនិញទិញ និងប្រាក់អាប់ត្រូវប្រគល់ជូនអតិថិជន។'
      };
    case 28:
    case 30:
    case 36:
      return {
        gameId,
        type: 'math-challenge',
        title: 'ល្បែងគណនាលេខ និងរាប់លេខ (Counting & Arithmetic)',
        themeColor: 'orange',
        description: 'ល្បែងរាប់លេខ និងគណនាផលបូកដកក្នុងចិត្ត!',
        instructions: 'ដោះស្រាយលំហាត់បូកដក ឬស្វែងរកលេខបន្ទាប់ក្នុងលំដាប់។'
      };
    case 31:
      return {
        gameId: 31,
        type: 'traffic-light',
        title: 'ល្បែងចរាចរណ៍ (Traffic Light Reaction)',
        themeColor: 'red',
        description: 'សង្កេតភ្លើងពណ៌ចរាចរណ៍ ក្រហម-លឿង-បៃតង រួចប្រតិបត្តិការ!',
        instructions: 'បៃតង=ទៅ (ចុច), ក្រហម=ឈប់ (ហាមចុច), លឿង=ត្រៀម។'
      };
    case 41:
    case 55:
      return {
        gameId,
        type: 'true-false',
        title: 'ល្បែងត្រូវ ខុស / ទះដៃ ឬមិនទះដៃ (True / False)',
        themeColor: 'violet',
        description: 'វិភាគប្រយោគ ឬលទ្ធផលថាតើ «ត្រូវ» ឬ «ខុស»!',
        instructions: 'បើត្រូវ ចុចប៊ូតុងត្រូវ (ទះដៃ) បើខុស ចុចប៊ូតុងខុស (ស្ងៀម)។'
      };
    case 58:
      return {
        gameId: 58,
        type: 'secret-code',
        title: 'ល្បែងទស្សន៍ទាយពាក្យតំណាងលេខ (Secret Code Decoder)',
        themeColor: 'slate',
        description: 'បំប្លែងកូដលេខឱ្យក្លាយជាពាក្យសម្ងាត់!',
        instructions: 'មើលតារាងលេខកូដ រួចផ្គុំអក្សរតាមលេខដើម្បីដឹងពាក្យសម្ងាត់។'
      };
    default:
      return {
        gameId,
        type: 'classroom-timer',
        title: `ល្បែងសិក្សាទី ${gameId}`,
        themeColor: 'orange',
        description: 'ល្បែងសកម្មភាពក្នុងថ្នាក់រៀន មាននាឡិការាប់ថយក្រោយ និងក្ដារពិន្ទុ!',
        instructions: 'គ្រូនិងសិស្សអនុវត្តតាមដំណាក់កាលលេង ជាមួយនាឡិការាប់ថយក្រោយ និងប្រព័ន្ធដាក់ពិន្ទុផ្ទាល់។'
      };
  }
};
