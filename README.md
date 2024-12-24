# GuardianSphere

clone the reposority:
https://github.com/GuedaliaMahonAccount/GuardianSphere.git

and write this in the terminal:
npm install





Deployment Process
To deploy the application, follow these steps:

Navigate to the React project directory and remove the previous build folder from the server directory.
Build the React project and copy the newly generated build folder to the server directory.
Navigate to the root project directory and trigger the deployment workflow.
Run the following commands:


# Navigate to the React project directory
cd guardian_sphere

# Remove the previous build folder
rm -r ../guardian_sphere_server/build

# Create a new production build
npm run build

# Copy the build folder to the server directory
cp -r build/ ../guardian_sphere_server/

# Navigate to the root project directory
cd ..

# Trigger the GitHub Actions workflow
gh workflow run azure-webapps-node.yml

# Check workflow runs (optional)
gh run list --workflow=azure-webapps-node.yml








