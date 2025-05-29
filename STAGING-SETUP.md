# Staging Environment Setup

This document explains how to set up the staging environment for the Jason McAlpin website.

## Overview

The CI/CD pipeline is configured to automatically deploy:
- Pull requests to the staging environment (staged.jasonmcalpin.com)
- Version tags to the production environment (jasonmcalpin.com)
- Main branch to staging after PR merges

## Required GitHub Secrets

The workflow uses the following secrets:

### Shared Secrets (Used for both Production and Staging)

| Secret Name | Description | Used For |
|-------------|-------------|----------|
| `FTP_USERNAME` | SSH username for server access | Both environments |
| `SSH_PRIVATE_KEY` | SSH private key for authentication | Both environments |
| `SSH_PORT` | SSH port (usually 22) | Both environments |

### Environment-Specific Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `FTP_HOST` | Hostname or IP address of your production server | `jasonmcalpin.com` |
| `FTP_TARGET` | Target directory on the production server | `/var/www/html` |
| `FTP_HOST_PREVIEW` | Hostname or IP address of your staging server | `staged.jasonmcalpin.com` |
| `FTP_TARGET_PREVIEW` | Target directory on the staging server | `/var/www/html/staged` |

## Setting Up the Secrets

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add each of the required secrets listed above

## Staging Server Requirements

Your staging server should have:

1. SSH access configured with the private key matching the public key you've added to the authorized_keys file
2. A web server (Apache, Nginx, etc.) configured to serve the files from the `FTP_TARGET_PREVIEW` directory
3. Proper permissions set on the `FTP_TARGET_PREVIEW` directory to allow the SSH user to write files

## How the Workflow Works

1. **For Pull Requests**:
   - When a PR is created or updated, the code is built and deployed to the staging site
   - A PR_INFO.txt file is added to track which PR is currently on staging
   - A comment is added to the PR with a link to the staging site

2. **When a PR is Closed**:
   - If the PR is merged to main, the main branch is built and deployed to the staging site
   - If the PR is closed without merging, the main branch is still built and deployed to staging
   - This ensures the staging site always reverts to the main branch when PRs are closed
   - A RESET_INFO.txt or BRANCH_INFO.txt file is added to indicate the current state

3. **For Main Branch Updates**:
   - When the main branch is updated (via PR merge or direct push), it's deployed to staging
   - A BRANCH_INFO.txt file is added to indicate it's the main branch

4. **For Production Deployments**:
   - When a version tag is pushed (e.g., v1.0.0), the code is built and deployed to production

## Testing the Setup

After adding all the secrets:

1. Create a new pull request
2. Wait for the GitHub Actions workflow to complete
3. Check the PR comments for the staging URL
4. Visit the staging URL to verify the deployment

## Troubleshooting

If the deployment fails, check:

1. GitHub Actions logs for specific error messages
2. SSH access to the staging server
3. Permissions on the target directory
4. Web server configuration
5. Make sure the `.htaccess` file is included in your repository and being deployed

## Benefits of This Approach

1. **Solves the `.htaccess` Issue**: By deploying to the root of the staging site, the `.htaccess` file works correctly
2. **Simplified Workflow**: No need to manage multiple preview folders
3. **Clear Tracking**: Each deployment includes a text file indicating which PR or branch is currently deployed
4. **Automatic Updates**: After merging a PR, the main branch is automatically deployed to staging
