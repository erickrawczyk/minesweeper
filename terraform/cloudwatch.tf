# Set up CloudWatch group and log stream and retain logs for 30 days
resource "aws_cloudwatch_log_group" "minesweeper_log_group" {
  name              = "/ecs/minesweeper-app"
  retention_in_days = 30

  tags = {
    Name = "minesweeper-log-group"
  }
}

resource "aws_cloudwatch_log_stream" "minesweeper_log_stream" {
  name           = "minesweeper-log-stream"
  log_group_name = aws_cloudwatch_log_group.minesweeper_log_group.name
}
