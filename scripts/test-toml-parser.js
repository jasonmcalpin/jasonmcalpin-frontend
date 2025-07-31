// Test script to parse the TOML file
import toml from '@iarna/toml'; 
import fs from 'fs';
import path from 'path';

// Read the TOML file
try {
  const tomlContent = fs.readFileSync(path.resolve('public/data/bytes.toml'), 'utf8');
  console.log('TOML content preview:', tomlContent.substring(0, 200) + '...');
  
  try {
    // Try to parse the TOML content
    const parsedData = toml.parse(tomlContent);
    console.log('Successfully parsed TOML data');
    console.log('Parsed data structure:', JSON.stringify(parsedData, null, 2).substring(0, 500) + '...');
  } catch (parseError) {
    console.error('Error parsing TOML:', parseError);
  }
} catch (readError) {
  console.error('Error reading TOML file:', readError);
}
