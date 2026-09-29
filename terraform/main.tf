# Security group — matches the live "launch-wizard-2" group exactly.
# Rules are written to match what was configured through the Console;
# terraform plan after import will confirm this or show the real diff.
resource "aws_security_group" "vaulty" {
  name        = "launch-wizard-2"
  description = "launch-wizard-2 created 2026-09-19T18:24:17.269Z"
  vpc_id      = "vpc-04a484423149b605f"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "vaulty-sg"
  }
}

# The EC2 instance itself — matches your live i-0ffa1d31019dc4660
resource "aws_instance" "vaulty" {
  ami                    = "ami-0b6d9d3d33ba97d99"
  instance_type           = "t3.small"
  subnet_id               = "subnet-0f7ffc1e49009c8b0"
  key_name                = "vaultly-key"
  vpc_security_group_ids  = [aws_security_group.vaulty.id]

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "vaultly-server"
  }
}

# Elastic IP — matches eipalloc-0652441511bffb00b, associated to the instance
resource "aws_eip" "vaulty" {
  instance = aws_instance.vaulty.id
  domain   = "vpc"

  tags = {
    Name = "vaulty-eip"
  }
}
