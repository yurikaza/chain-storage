import React from "react";
import SendFile from "../../artifacts/contracts/SendFile.sol/SendFile.json";
import BuyGb from "../../artifacts/contracts/BuyGb.sol/BuyGb.json";
import axios from "axios";
import { ethers } from "ethers";
import buffer, { Buffer } from "buffer";
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

    if (typeof window.ethereum !== "undefined") {
      let myArray: any[] = [];

      const formData = new FormData();
      for (let i = 0; i < myFiles.length; i++) {
        const element = myFiles[i];
        formData.append("myFile", element);
        myArray.push(formData);

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
      }
      try {
        axios
          .post("http://localhost:4000/api/", formData)
          .then(async (data: any) => {
            const filesData = data.data.data;
            console.log(filesData);
            for (let index = 0; index < filesData.length; index++) {
              const element = filesData[index];

              const provider = new ethers.providers.Web3Provider(
                window.ethereum
              );
              const signer = provider.getSigner();
              const contract = new ethers.Contract(
                "0xd8EB6F8C4882Af90FEC4EBA485df8d66Be0DE970" ||
                  `${process.env.CREATE_FILE_KEY}`,
                SendFile.abi,
                signer
              );

              const contractData = await contract.createFiles(
                element.name,
                element.link,
                element.size
              );

              await contractData.wait();
              console.log("data: ", contractData);
            }
          });

        console.log(window.ethereum.selectedAddress);
      } catch (err: unknown) {
        console.log("Error: ", err);
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
