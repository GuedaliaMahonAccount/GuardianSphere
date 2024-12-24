# GuardianSphere

clone the reposority:
https://github.com/GuedaliaMahonAccount/GuardianSphere.git

and write this in the terminal:
npm install --legacy-peer-deps



to deploy:

in C:\Users\USER\guedaApp\GuardianSphere>guardian_sphere :
rm -r ../guardian_sphere_server/build  
npm run build
cp -r build/ ../guardian_sphere_server/

in  C:\Users\USER\guedaApp\GuardianSphere>   ,       gh workflow run azure-webapps-node.yml 
