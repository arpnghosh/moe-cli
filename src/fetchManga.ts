import axios from 'axios';
import inquirer from 'inquirer';
import { fetchChapter } from './fetchChapter';

const baseUrl = 'https://api.mangadex.org';

interface Manga {
    id: number,
    attributes: {
        title: {
            en: string
        }
    }
}

export const fetchManga = async (title: string) => {
    try {
        const resp = await axios({
            method: 'GET',
            url: `${baseUrl}/manga/`,
            params: {
                title: title,
            },
        });

        const mangaList = resp.data.data.map((manga: Manga, index: number) => ({
            name: `${index + 1}. ${manga.attributes.title.en}`,
            value: manga.id
        }));

        const mangaNames = await inquirer.prompt([
            {
                name: 'selectedManga',
                type: 'list',
                message: 'Select a manga to read:',
                choices: mangaList,
                loop: false,
                pageSize: mangaList.length
            },
        ]);
        fetchChapter(baseUrl, mangaNames.selectedManga, title);

    } catch (error) {
        console.error('Error fetching manga:', error);
    }
}

