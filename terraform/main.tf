provider "aws" {
  region = var.aws_region
}

terraform {
  required_version = "> 0.12.0"

  backend "s3" {
    bucket = "etkraw-tf"
    key    = "minesweeper"
    region = "us-east-1"
  }
}
