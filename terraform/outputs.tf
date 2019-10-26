output "alb_hostname" {
  value = aws_alb.main.dns_name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.minesweeper.repository_url
}

output "rds_endpoint" {
  value = aws_db_instance.minesweeper.endpoint
}

output "load_balancer_endpoint" {
  value = aws_alb.main.dns_name
}
