data "external" "git" {
  program = ["${path.module}/git.sh"]
}

output "short_sha" {
  value = data.external.git.result.short_sha
}
