import { Router, Request, Response } from "express";
import multer from "multer";
import { Readable } from "stream";
import readline from "readline";
import { client } from "./database";

const router = Router();

const multerConfig = multer();

interface Fields {
  id_pth: string;
  contract_id: string;
  plan: string;
  city: string;
  address: string;
  neighborhood: string;
  cellphone: string;
  card: string;
}

router.post(
  "/contents",
  multerConfig.single("file"),
  async (request: Request, response: Response) => {
    const { file } = request;
    const buffer = file?.buffer.toString();

    const readAbleFile = new Readable();

    readAbleFile.push(buffer);
    readAbleFile.push(null);

    const fileLine = readline.createInterface({
      input: readAbleFile,
    });

    const fields: Fields[] = [];

    for await (let line of fileLine) {
      const lineSplit = line.split(";");
      const changePosition = lineSplit[1];
      fields.push({
        id_pth: lineSplit[1],
        contract_id: changePosition,
        plan: lineSplit[2],
        city: lineSplit[4],
        address: lineSplit[5],
        neighborhood: lineSplit[6],
        cellphone: lineSplit[7],
        card: lineSplit[8],
      });
    }
    for await (let {
      id_pth,
      contract_id,
      plan,
      city,
      address,
      neighborhood,
      cellphone,
      card,
    } of fields) {
      await client.test.create({
        data: {
          id_pth,
          contract_id,
          plan,
          city,
          address,
          neighborhood,
          cellphone,
          card,
        },
      });
    }

    console.log(fields);
    return response.json(fields);
  }
);

export { router };
