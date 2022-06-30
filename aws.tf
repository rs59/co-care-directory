# **************************************
# Deploys app to AWS using Terraform
#
# See `/README.md` for instructions.
#
# File contains:
# - Variables
# - Providers
# - Storage
# - Content Delivery Network (CDN)
# - Outputs
# **************************************

# --------------------------------------
# Variables
#
# Specify as environment variables as `export TF_VAR_<var name>="<value>"`
# --------------------------------------
variable "bucket_name" {
  type          = string
  description   = "The name of the storage bucket."
  default       = ""
}

variable "domains" {
    type = set(string)
    description = "The URLs to have routing setup for."
    default = []
}

# --------------------------------------
# Providers: Setup AWS provider
# --------------------------------------
terraform {
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "4.20.1"
        }
    }
}

provider "aws" {
    region = "us-east-1"
}

# --------------------------------------
# Storage: S3 bucket configuration 
# --------------------------------------
resource "aws_s3_bucket" "storage" {
    bucket = var.bucket_name
    force_destroy = true
}

resource "aws_s3_bucket_acl" "storage_acl" {
    bucket = aws_s3_bucket.storage.bucket

    # TODO This might be able to be `private` when CloudFront is up
    acl = "public-read"
}

resource "aws_s3_bucket_policy" "storage_policy" {
    bucket = aws_s3_bucket.storage.bucket
    policy = data.aws_iam_policy_document.storage_policy.json
}

data "aws_iam_policy_document" "storage_policy" {
    statement {
        sid = "PublicRead"
        effect = "Allow"

        principals {
            type = "AWS"
            identifiers = [ "*" ]
        }

        actions = [
            "s3:GetObject",
            "s3:GetObjectVersion"
        ]

        resources = [
            "${aws_s3_bucket.storage.arn}/*"
        ]
    }
}

resource "aws_s3_bucket_cors_configuration" "storage_cors" {
    bucket = aws_s3_bucket.storage.bucket

    # TODO Check against https://github.com/alexhyett/terraform-s3-static-website/blob/main/src/s3.tf
    cors_rule {
        allowed_methods = ["GET"]
        allowed_origins = ["*"]
        # ^ TODO Change to domain
    }
}

resource "aws_s3_bucket_website_configuration" "storage_website" {
    bucket = aws_s3_bucket.storage.bucket
    index_document {
        suffix = "index.html"
    }
    error_document {
        key = "error.html"
    }
}

# --------------------------------------
# CDN (Content Delivery Network): CloudFront distribution
# --------------------------------------

locals {
    s3_origin_id = "S3-${var.bucket_name}"
}

# TODO If we want to make the S3 bucket private, then we can use this
# https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
# resource "aws_cloudfront_origin_access_identity" "oai" {
#     comment = "my-react-app OAI"
# }

resource "aws_cloudfront_distribution" "cdn" {
    origin {
        domain_name = aws_s3_bucket.storage.bucket_regional_domain_name
        origin_id   = local.s3_origin_id

        # s3_origin_config {
        #     origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
        # }
    }

    enabled         = true
    is_ipv6_enabled = true

    default_root_object = "index.html"

    # TODO Add when we have a domain
    # aliases = ["mysite.example.com", "yoursite.example.com"]

    default_cache_behavior {
        allowed_methods  = ["GET", "HEAD", "OPTIONS"]
        cached_methods   = ["GET", "HEAD"]
        target_origin_id = local.s3_origin_id

        forwarded_values {
            query_string = true
            headers = [ "Origin" ]

            cookies {
                forward = "none"
            }
        }

        min_ttl                = 0
        default_ttl            = 3600
        max_ttl                = 86400
        compress               = true
        viewer_protocol_policy = "redirect-to-https"
    }

    ordered_cache_behavior {
        path_pattern     = "/index.html"
        allowed_methods  = ["GET", "HEAD", "OPTIONS"]
        cached_methods   = ["GET", "HEAD", "OPTIONS"]
        target_origin_id = local.s3_origin_id

        forwarded_values {
            query_string = true
            headers = [ "Origin" ]

            cookies {
                forward = "none"
            }
        }

        min_ttl                = 0
        default_ttl            = 0
        max_ttl                = 0
        compress               = true
        viewer_protocol_policy = "redirect-to-https"
    }

    price_class = "PriceClass_100"

    viewer_certificate {
        cloudfront_default_certificate = true
    }

    # retain_on_delete = true

    custom_error_response {
        error_caching_min_ttl = 300
        error_code            = 403
        response_code         = 200
        response_page_path    = "/index.html"
    }

    custom_error_response {
        error_caching_min_ttl = 300
        error_code            = 404
        response_code         = 200
        response_page_path    = "/index.html"
    }

    restrictions {
        geo_restriction {
            restriction_type = "whitelist"
            # Restricted per CO's request - See https://www.iso.org/obp/ui/#search for codes
            locations = [ 
                "US", # United States
                "UM", # US Minor Outlying Islands
                "PR", # Puerto Rico
                "GU", # Guam
                "VI", # US Virgin Islands
                "CA", # Canada
                "MX"  # Mexico
            ]
        }
    }
}

# --------------------------------------
# Domain/URL: Route53 domains and hosted zones
# --------------------------------------
resource "aws_route53_zone" "hosted_zones" {
    for_each = var.domains
    name = each.key
}



# --------------------------------------
# Output: Things to print out when finished executing
# --------------------------------------

output "url" {
    description = "URL that the app can be accessed at"
    value = "https://${aws_cloudfront_distribution.cdn.domain_name}/"
}
