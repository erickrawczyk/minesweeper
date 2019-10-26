provider "aws" {
  region = "us-east-1"
}

terraform {
  required_version = "> 0.12.0"

  backend "s3" {
    bucket = "etkraw-tf"
    key    = "minesweeper"
    region = "us-east-1"
  }
}
