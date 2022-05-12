import { Router, Request, Response } from "express";
import multer from "multer";
import { Readable } from "stream";
import readline from "readline";
const router = Router();

const multerConfig = multer();

interface Fields {
  contract_id: string;
  plan_name: string;
}
router.post(
  "/contents",
  multerConfig.single("file"),
  async (request: Request, response: Response) => {
    const { file } = request;
    const buffer = file?.buffer.toString("utf-8");

    const readalbeFile = new Readable();

    readalbeFile.push(buffer);
    readalbeFile.push(null);

    const fileLine = readline.createInterface({
      input: readalbeFile,
    });

    const fields: Fields[] = [];

    for await (let line of fileLine) {
      const lineSplit = line.split(";");
      const posicition = (lineSplit[0] = lineSplit[1]);

      fields.push({
        contract_id: posicition,
        plan_name: lineSplit[2],
      });
    }

    return response.json(fields);
  }
);

export { router };
