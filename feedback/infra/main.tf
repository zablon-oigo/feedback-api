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
  bucket   = aws_s3_bucket.bucket.id
  key      = each.value
  source   = "${path.module}/../dist/${each.value}"
  etag     = filemd5("${path.module}/../dist/${each.value}")
}

resource "aws_s3_bucket_policy" "public_read_access" {
  bucket = aws_s3_bucket.bucket.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "${aws_s3_bucket.bucket.arn}/*"
      ]
    }
  ]
}
EOF
}
locals {
  s3_origin_id = "MyS3Origin"
}