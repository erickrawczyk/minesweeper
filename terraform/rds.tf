data "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = "minesweeper_db_credentials"
}

resource "aws_db_instance" "minesweeper" {
  allocated_storage   = 10
  storage_type        = "gp2"
  engine              = "postgres"
  instance_class      = "db.t2.micro"
  name                = "minesweeper"
  identifier          = "minesweeper"
  publicly_accessible = true
  skip_final_snapshot = true
  username            = jsondecode(data.aws_secretsmanager_secret_version.db_credentials.secret_string)["username"]
  password            = jsondecode(data.aws_secretsmanager_secret_version.db_credentials.secret_string)["password"]
}
