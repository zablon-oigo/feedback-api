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
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.bucket.bucket_regional_domain_name
    origin_id   = local.s3_origin_id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "feedback-cloudfront"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Environment = "production"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}