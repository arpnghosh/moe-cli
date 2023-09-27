import { fetchManga } from "./src/fetchManga";
import * as readline from "readline"
import { stdin as input, stdout as output } from 'node:process';

const r1 = readline.createInterface({input, output})
r1.question('Please enter the name of the manga: ', (title) => {
    fetchManga(title);
    r1.close();
});
