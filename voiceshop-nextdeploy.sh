#!/bin/bash
 
# Variables
ECR_REPOSITORY_NAME="shopifyvoice"
AWS_REGION="us-east-1"
ECS_CLUSTER_NAME="ShopifyVoice"
ECS_SERVICE_NAME="shopifyvoiceapp"
DOCKER_IMAGE_TAG="latest"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
 
# Login to ECR
echo "Logging in to AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
 
# Build Docker image
echo "Building Docker image..."
docker build -t $ECR_REPOSITORY_NAME .
 
# Tag Docker image
echo "Tagging Docker image..."
docker tag $ECR_REPOSITORY_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$DOCKER_IMAGE_TAG
 
# Push Docker image to ECR
echo "Pushing Docker image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$DOCKER_IMAGE_TAG
 
# Update ECS service to use the new image
echo "Updating ECS service..."
aws ecs update-service --cluster $ECS_CLUSTER_NAME --service $ECS_SERVICE_NAME --force-new-deployment --region $AWS_REGION
 
echo "NextJS deployment completed."