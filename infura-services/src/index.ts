import express, { Request, Response } from "express";
import dotev from "dotenv";
import bodyParser from "body-parser";
import fileUpload, { UploadedFile } from "express-fileupload";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import compression from "compression";
import { create } from "ipfs-http-client";

const app = express();
const port = 4000;

dotev.config();
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(helmet());
app.use(compression());
app.use(hpp());

app.use(cors());

app.post("/api/", async (req: Request, res: Response) => {
  const fileData = req?.files?.myFile as any | UploadedFile[];
  console.log("filedata " + fileData.lenght);
  console.log("filedata " + fileData);

  let myArray: any[] = [];
  for (let index = 0; index < fileData.length; index++) {
    const element = fileData[index];

    const projectId =
      "2DAOlno5zO07ea3deWjDmmEuA4i" || `${process.env.PROJECT_ID}`;
    const projectSecret =
      "2a501091bc040cd731353f70f69663b8" || `${process.env.PROJECT_SECRET}`;
    const auth =
      "Basic " +
      Buffer.from(projectId + ":" + projectSecret).toString("base64");

    const ipfs = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });

    const file = await ipfs.add(element.name, element.data);
    const newFile = `https://ipfs.io/ipfs/${file.cid}?filename=${element.name}`;

    let myObj: any = {
      link: newFile,
      name: element.name,
      size: file.size,
    };
    myArray.push(myObj);
    console.log("New File Upload Ipfs Link is " + newFile);
  }

  res.status(201).json({
    status: "success",
    data: myArray,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
