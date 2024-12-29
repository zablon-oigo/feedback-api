provider "aws" {
  region     = var.region
  secret_key = var.secret_key
  access_key = var.access_key
}
resource "random_pet" "random" {
  length = 6
}
resource "aws_s3_bucket" "bucket" {
  bucket        = "frontend-${random_pet.random.id}"
  force_destroy = true
}
resource "aws_s3_object" "upload_object" {
  for_each = fileset("${path.module}/../dist", "**/*")

  bucket = aws_s3_bucket.bucket.id
  key    = each.value
  source = "${path.module}/../dist/${each.value}"  
  etag   = filemd5("${path.module}/../dist/${each.value}") 
}

