provider "aws" {
  region = var.region
  secret_key = var.secret_key
  access_key = var.access_key
}
resource "random_pet" "random" {
    length = 8
}
