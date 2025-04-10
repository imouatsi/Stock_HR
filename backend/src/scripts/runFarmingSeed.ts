import { exec } from 'child_process';
import path from 'path';

// Path to the farming company seed file
const seedFilePath = path.join(__dirname, '../seeders/farmingCompanySeed.ts');

// Run the seed file using ts-node
exec(`ts-node ${seedFilePath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing seed file: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Seed file stderr: ${stderr}`);
    return;
  }
  
  console.log(`Seed file output: ${stdout}`);
  console.log('Farming company seed data successfully loaded!');
});
