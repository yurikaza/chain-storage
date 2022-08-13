import React from "react";
import SendFile from "../../artifacts/contracts/SendFile.sol/SendFile.json";
import BuyGb from "../../artifacts/contracts/BuyGb.sol/BuyGb.json";
import axios from "axios";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import { Web3Storage, File } from "web3.storage";
import { Button } from "react-bootstrap";
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";

declare let window: any;

interface State {
  _FileName: string;
  _FileLink: string;
  _FileSize: string | number;
  UserFiles: any[];
  CurrenRole: any[] | any;
  LastUploads: any[] | any;
  myFile: any;
  totalStorage: any;
  totalFileSize: any;
  loadingFile: string | any | any[];
}

const sizeArray: any[] = [];

export class SendFiles extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);

    this.createFiles = this.createFiles.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.GetUserRole = this.GetUserRole.bind(this);

    this.state = {
      _FileName: "",
      _FileLink: "",
      _FileSize: "",
      UserFiles: [],
      CurrenRole: [],
      LastUploads: [],
      myFile: null,
      loadingFile: "",
      totalStorage: "",
      totalFileSize: "",
    };
  }

  public fileChangedHandler(e: any) {
    this.setState({ myFile: e.target.files });
  }

  async GetUserRole() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0x68056f2B4272feeC2EBc2e8C693d574751F066D9",
        BuyGb.abi,
        provider
      );
      try {
        let noting;
        const data = await contract.currentRole();
        console.log(data);
        let dataArray: any[] = [];

        for (let index = 0; index < data.length; index++) {
          const element = data[index];

          if (
            element.userAddress.toLowerCase() ===
            window.ethereum.selectedAddress
          ) {
            console.log("File Added");
            dataArray.push(element);
          }
        }
        const arr = dataArray.slice(-1).pop();

        this.setState({ CurrenRole: arr });
        const userRole = this.state.CurrenRole;
        console.log(this.state.CurrenRole);
      } catch (error: unknown) {
        console.error(error);
      }
    }
  }

  async componentDidMount() {
    console.log(window.ethereum.selectedAddress);
    this.setState({ loadingFile: "" });
  }

  async createFiles(e: any) {
    e.preventDefault();

    const myFiles = this.state.myFile;
    console.log(myFiles.length);

    for (let i = 0; i < myFiles.length; i++) {
      if (typeof window.ethereum !== "undefined") {
        const element = myFiles[i];
        const formData = new FormData();
        formData.append(`myFile`, element);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          "0xd8EB6F8C4882Af90FEC4EBA485df8d66Be0DE970" ||
            `${process.env.CREATE_FILE_KEY}`,
          SendFile.abi,
          signer
        );
        console.log(contract);

        const calc = (a: any) => {
          var total = 0;
          for (var i in a) {
            total += a[i];
          }
          return total;
        };

        const totalFileSize = calc(sizeArray);
        console.log(totalFileSize);

        const GbProvider = new ethers.providers.Web3Provider(window.ethereum);
        const GbContract = new ethers.Contract(
          "0x68056f2B4272feeC2EBc2e8C693d574751F066D9",
          BuyGb.abi,
          GbProvider
        );
        const GbData = await GbContract.currentRole();
        console.log(GbData);
        let dataArray: any[] = [];

        for (let index = 0; index < GbData.length; index++) {
          const element = GbData[index];
          if (
            element.userAddress.toLowerCase() ===
            window.ethereum.selectedAddress
          ) {
            console.log("File Added");
            dataArray.push(element);
          }
        }
        const arr = dataArray.slice(-1).pop();
        this.setState({ CurrenRole: arr });
        const userRole = this.state.CurrenRole;
        console.log(this.state.CurrenRole);
        console.log(this.state.totalFileSize);
        let UserRole;
        if (typeof this.state.CurrenRole === "undefined") {
          UserRole = "standart";
        } else {
          UserRole = this.state.CurrenRole.role;
        }

        if (UserRole === "standart" && this.state.totalFileSize > 5000) {
          alert("not engouh space");
          throw new Error("wrond wondwonsda");
        } else if (UserRole === "gold" && this.state.totalFileSize > 50000) {
          alert("not engouh space");
          throw new Error("wrond wondwonsda");
        } else if (
          UserRole === "preminum" &&
          this.state.totalFileSize > 1000000
        ) {
          alert("not engouh space");
          throw new Error("wrond wondwonsda");
        }

        if (totalFileSize >= 2) {
          console.log("over storage");
        } else {
          console.log("normall pass");
        }
        try {
          formData.append("userName", "yurikaza");
          formData.append(
            "key",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6Inl1cmlrYXphIiwiaWQiOjcyNjIxMTAzLCJub2RlX2lkIjoiTURRNlZYTmxjamN5TmpJeE1UQXoiLCJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzcyNjIxMTAzP3Y9NCIsImdyYXZhdGFyX2lkIjoiIiwidXJsIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2Vycy95dXJpa2F6YSIsImh0bWxfdXJsIjoiaHR0cHM6Ly9naXRodWIuY29tL3l1cmlrYXphIiwiZm9sbG93ZXJzX3VybCI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vdXNlcnMveXVyaWthemEvZm9sbG93ZXJzIiwiZm9sbG93aW5nX3VybCI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vdXNlcnMveXVyaWthemEvZm9sbG93aW5ney9vdGhlcl91c2VyfSIsImdpc3RzX3VybCI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vdXNlcnMveXVyaWthemEvZ2lzdHN7L2dpc3RfaWR9Iiwic3RhcnJlZF91cmwiOiJodHRwczovL2FwaS5naXRodWIuY29tL3VzZXJzL3l1cmlrYXphL3N0YXJyZWR7L293bmVyfXsvcmVwb30iLCJzdWJzY3JpcHRpb25zX3VybCI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vdXNlcnMveXVyaWthemEvc3Vic2NyaXB0aW9ucyIsIm9yZ2FuaXphdGlvbnNfdXJsIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2Vycy95dXJpa2F6YS9vcmdzIiwicmVwb3NfdXJsIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2Vycy95dXJpa2F6YS9yZXBvcyIsImV2ZW50c191cmwiOiJodHRwczovL2FwaS5naXRodWIuY29tL3VzZXJzL3l1cmlrYXphL2V2ZW50c3svcHJpdmFjeX0iLCJyZWNlaXZlZF9ldmVudHNfdXJsIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2Vycy95dXJpa2F6YS9yZWNlaXZlZF9ldmVudHMiLCJ0eXBlIjoiVXNlciIsInNpdGVfYWRtaW4iOmZhbHNlLCJuYW1lIjoiWXVzdWYgTWlyemEgUMSxw6dha2PEsSIsImNvbXBhbnkiOiJDaGFpbiBTdG9yYWdlIiwiYmxvZyI6Imh0dHBzOi8veXVzdWZwaWNha2NpLmNvbS8iLCJsb2NhdGlvbiI6IlNhbXN1biwgVHVya2V5IiwiZW1haWwiOm51bGwsImhpcmVhYmxlIjpudWxsLCJiaW8iOiJKdW5pb3IgQmFjay1lbmQgRW5naW5lZXIiLCJ0d2l0dGVyX3VzZXJuYW1lIjoiWVBpY2FrY2kiLCJwdWJsaWNfcmVwb3MiOjIyLCJwdWJsaWNfZ2lzdHMiOjAsImZvbGxvd2VycyI6MSwiZm9sbG93aW5nIjoyLCJjcmVhdGVkX2F0IjoiMjAyMC0xMC0wOVQxNjoyMTowN1oiLCJ1cGRhdGVkX2F0IjoiMjAyMi0wNy0xNFQxODowNjo1NVoiLCJpYXQiOjE2NTk5NDY4MzR9.o-qGZ6cR9SjehrQUDNmnhBqFHT0onA15J9yxoZyYR7g"
          );

          if (myFiles.length > 1) {
            axios
              .post("http://localhost:4000/api/sendMultipleFile", formData)
              .then(async (data) => {
                console.log(data.data.data.filesArray[i]);
                const datas = await contract.createFiles(
                  element.name,
                  data.data.data.filesArray[i].link,
                  data.data.data.filesArray[i].fileSize
                );

                await datas.wait();

                console.log("data: ", datas);
              });
          } else {
            axios
              .post("http://localhost:4000/api/sendSingleFile", formData)
              .then(async (data) => {
                console.log(data.data.data.filesArray[i]);
                const datas = await contract.createFiles(
                  element.name,
                  data.data.data.filesArray[i].link,
                  data.data.data.filesArray[i].fileSize
                );

                await datas.wait();

                console.log("data: ", datas);
              });
          }

          console.log(window.ethereum.selectedAddress);
        } catch (err: unknown) {
          console.log("Error: ", err);
        }
      }
    }

    this.setState({ _FileName: "", _FileLink: "", _FileSize: "" });
    this.setState({ loadingFile: "" });
  }

  render() {
    let vars;
    if (this.state.loadingFile === "") {
      vars = "";
    } else {
      vars = "loading-file-item";
    }
    return (
      <div>
        <h1>Profile</h1>
        <form onSubmit={this.createFiles}>
          <div className="form-group">
            <label>Files</label>
            <input
              type="file"
              onChange={(e) => this.fileChangedHandler(e)}
              className="form-control mb-4"
              multiple
            />
          </div>
          <div className="form-group">
            <Button variant="secondary" type="submit">
              Send File
            </Button>
          </div>
        </form>
        <ul className={vars}>
          <li>
            <p>{this.state.loadingFile}</p>
          </li>
        </ul>
      </div>
    );
  }
}
