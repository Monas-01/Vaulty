output "instance_id" {
  value = aws_instance.vaulty.id
}

output "public_ip" {
  value = aws_eip.vaulty.public_ip
}

output "security_group_id" {
  value = aws_security_group.vaulty.id
}
