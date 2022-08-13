import { Request, Response } from "express";
import Output from "../models/output.model";

export async function outputData(req: Request, res: Response) {
  const sleep = (time: number) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  for (var i = 0; i < Infinity; i++) {
    const hash: any[] = await Output.find();
    if (hash.length > 0) {
      console.log(`File Upload Start... ${hash.length} File Uploading`);

      for (let index = 0; index < hash.length; index++) {
        const element = hash[index];
        console.log(element);

        let fileArray: any[] = [];

        if (
          element.filename === req.body.filename &&
          element.publickey === req.body.publickey
        ) {
          fileArray.push(element);

          await Output.findOneAndDelete({
            filename: element.filename,
            publickey: element.publickey,
          });

          res.status(200).json({
            status: "succes",
            data: {
              fileArray,
            },
          });

          break;
        }
      }
      console.log("break");
      break;
    }
    console.log("0 File");
    await sleep(5000);
  }
}
