provider "aws" {
  region = var.region
  secret_key = var.secret_key
  access_key = var.access_key
}
resource "random_pet" "random" {
    length = 8
}
resource "aws_s3_bucket" "bucket" {
    bucket = random_pet.random.id
}