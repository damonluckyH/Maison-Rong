import { generateBaziReport, solarToLunar } from '../src/lib/bazi';

const lunar = solarToLunar(1990, 5, 15);
console.log('Lunar 1990-05-15:', lunar);

const report = generateBaziReport('1990-05-15', '6', 'MALE');
console.log('\nBazi Report:');
console.log(JSON.stringify(report, null, 2));

const report2 = generateBaziReport('2000-01-01', undefined, 'FEMALE');
console.log('\nBazi Report (no hour):');
console.log(JSON.stringify(report2, null, 2));
