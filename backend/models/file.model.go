package models

type album struct {
    Hash  string  `json:"hash"`
    FileName string  `json:"fileName"`
    FileSize string  `json:"fileSize"`
}


var albums = []album{
    {Hash: "1", FileName: "Blue Train", FileSize: "John Coltrane"},
}

