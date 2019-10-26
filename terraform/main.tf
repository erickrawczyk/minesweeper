provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "etkraw-tf"
    key    = "minesweeper"
    region = "us-east-1"
  }
}
