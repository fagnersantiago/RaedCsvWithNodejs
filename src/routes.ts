import { Router, Request, Response } from "express";
import multer from "multer";
import { Readable } from "stream";
import readline from "readline";

const router = Router();

const multerConfig = multer();

interface Fields {
  contract_id: string;
  plan: string;
  city: string;
  neighborhood: string;
  address: string;
  cellphone: string;
  card: string;
}

router.post(
  "/contents",
  multerConfig.single("file"),
  async (request: Request, response: Response) => {
    const { file } = request;
    const buffer = file?.buffer.toString();

    const readalbeFile = new Readable();

    readalbeFile.push(buffer);
    readalbeFile.push(null);

    const fileLine = readline.createInterface({
      input: readalbeFile,
    });

    const fields: Fields[] = [];

    for await (let line of fileLine) {
      const lineSplit = line.split(";");
      const changePosition = lineSplit[1];

      fields.push({
        contract_id: changePosition,
        plan: lineSplit[2],
        city: lineSplit[4],
        address: lineSplit[5],
        neighborhood: lineSplit[6],
        cellphone: lineSplit[7],
        card: lineSplit[8],
      });
    }
    return response.json(fields);
  }
);

export { router };
