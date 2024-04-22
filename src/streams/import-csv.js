import { parse } from 'csv-parse';
import fs from 'node:fs';

const csv = new URL('../tasks.csv', import.meta.url);

const stream = fs.createReadStream(csv);

const csvParse = parse({
  delimiter: ',',  
  fromLine: 2 
});

async function exec() {
  const linesParse = stream.pipe(csvParse);

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch('http://localhost:3334/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    })
  }

}

exec()

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}