import fs from 'fs';

let adminCal = fs.readFileSync('src/components/AdminCalendarView.tsx', 'utf8');
adminCal = adminCal.replace(/grade: 1/g, 'grade: 4');
fs.writeFileSync('src/components/AdminCalendarView.tsx', adminCal);

let lessonPlan = fs.readFileSync('src/components/LessonPlanForm.tsx', 'utf8');
lessonPlan = lessonPlan.replace(/grade: 1/g, 'grade: 4');
fs.writeFileSync('src/components/LessonPlanForm.tsx', lessonPlan);

let studentRewards = fs.readFileSync('src/components/StudentRewardsView.tsx', 'utf8');
studentRewards = studentRewards.replace(/grade: 1/g, 'grade: 4');
fs.writeFileSync('src/components/StudentRewardsView.tsx', studentRewards);

console.log("Fixed type errors");
