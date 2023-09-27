import axios from "axios";
import { exec } from "child_process";
import *  as fs from 'fs';
import  { PDFDocument} from 'pdf-lib'

export const downloadChapter = async (baseUrl: string, chapterID: number, title: string) => {

    try {

        // Getting the image metadata
        const resp = await axios({
            method: 'GET',
            url: `${baseUrl}/at-home/server/${chapterID}`
        });
        const hash = resp.data.chapter.hash;
        const data = resp.data.chapter.data;
        const host = resp.data.baseUrl;

        // Creating a new PDF document
        const pdfDoc = await PDFDocument.create();

        for (const page of data) {
            try {
                const resp = await axios({
                    method: 'GET',
                    url: `${host}/data/${hash}/${page}`,
                    responseType: 'arraybuffer'
                });

                // Adding the image to the PDF page
                const image = await pdfDoc.embedJpg(resp.data);
                const pageWidth = 595; // Adjust this value as per your requirements
                const pageHeight = 842; // Adjust this value as per your requirements
                const pdfPage = pdfDoc.addPage([pageWidth, pageHeight]);
                pdfPage.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: pageWidth,
                    height: pageHeight,
                });

            } catch (imageError) {
                console.error(`Error embedding image ${page}:`, imageError);
            }
        }

        // Saving the PDF to the specified location
        const pdfBytes = await pdfDoc.save();
        const folderPath = `/home/${Bun.env.USER}/Pictures/Mangadex/${title}`;
        console.log(folderPath)
        fs.mkdirSync(folderPath, { recursive: true });
        fs.writeFileSync(`${folderPath}/${title}.pdf`, pdfBytes);

        console.log(`Downloaded and saved ${data.length} pages as a PDF.`);
        const pdfPath = `${folderPath}/${title}.pdf`;
        exec(`zathura ${pdfPath}`, (err, stdout, stderr) => {
            if (err) {
                console.error('Error opening PDF with Zathura:', err);
                return;
            }
            console.log('PDF opened with Zathura');
        });

    } catch (error) {
        console.error(error);
    }
}
