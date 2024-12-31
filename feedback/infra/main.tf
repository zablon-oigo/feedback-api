provider "aws" {
  region     = var.region
  secret_key = var.secret_key
  access_key = var.access_key
}
resource "random_pet" "random" {
  length = 3
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
  content_type = lookup({
    "html" = "text/html",
    "css"  = "text/css",
    "js"   = "application/javascript",
    "png"  = "image/png",
    "jpg"  = "image/jpeg"
  }, file("${path.module}/../dist/${each.value}"), "application/octet-stream")
}

resource "aws_s3_bucket_policy" "cdn_oac_bucket_policy" {
  bucket = aws_s3_bucket.bucket.id
  policy = data.aws_iam_policy_document.s3_bucket_policy.json
}

data "aws_iam_policy_document" "s3_bucket_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.bucket.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.s3_distribution.arn]
    }
  }
}

resource "aws_cloudfront_origin_access_control" "cloudfront_s3_oac" {
  name                              = "feedback-oac"
  description                       = "CloudFront S3 OAC"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

locals {
  s3_origin_id = "MyS3Origin"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.bucket.bucket_regional_domain_name
    origin_id                = local.s3_origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.cloudfront_s3_oac.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "feedback-cloudfront-cdn"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  http_version = "http2"

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}