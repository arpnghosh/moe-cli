import axios from "axios";
import inquirer from "inquirer";
import { downloadChapter } from "./downloadChapter";

// define interface for chapter parameter in the map and filter function
interface Chapter {
    id: number,
    attributes: {
        translatedLanguage: string;
        chapter: string;
    }
}

export const fetchChapter = async (baseUrl: string, id: number, title: string) => {
    try {
        const resp = await axios({
            method: 'GET',
            url: `${baseUrl}/manga/${id}/feed`,
        });

        const chapterList = resp.data.data
            .filter((chapter: Chapter) => chapter.attributes.translatedLanguage === 'en')
            .map((chapter: Chapter) => ({
                name: chapter.attributes.chapter,
                value: chapter.id
            }));

        const sortedChapterList = chapterList.sort((a, b) => a.name-b.name);

        const chapterView = await inquirer.prompt([
            {
                name: 'selectedChapter',
                type: 'list',
                message: 'Select a chapter to read:',
                choices: sortedChapterList,
                loop: false,
                pageSize: chapterList.length,
            },
        ]);
        const selectedChapterId = chapterView.selectedChapter;
        downloadChapter(baseUrl, selectedChapterId, title, )

    } catch (error) {
        console.log(error)
    }
}
