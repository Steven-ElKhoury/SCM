# SCM 

## SCM is an application for supply chain management of a bike factory, it includes features for creating new products, suppliers, parts to be used in the production of bikes. It also includes warehouse management capabilities along with tracking of orders for components and purchase of bikes. The application includes the capability to assign tasks to different employees, onboarding new employees, and a dashboard page for analytics regarding the performance of the factory.

REACT, NODE.JS, MYSQL should be installed on your machine

1. IMPORT THE DATABASE
1.1 - You should open mysql workbench, in a query file type: create database supply_chain
1.2 - after creating the database you should type use supply_chain
1.3 - after using the database supply_chain you should from the "server" button choose 
the "data import" and select the dump file that you downloaded, make sure you selected the 
correct directory where it is located.
1.4 - select the supply_chain database untill you see all the tables on the right and then 
select start import to start importing the database

2. Drag and drop the folder that you downloaded into your editor (recommended: VSCODE)
2. In your editor open 2 terminals and make sure you are in the directory 
of the "SCM" folder in both of them.
2.1.1 - in the FIRST terminal type: cd server
2.1.2 - in the server folder, type: npm i (to install all the modules)
2.1.3 - after installing all the modules type: node server.js (to start the backend of the application)

2.2.1 - in the SECOND terminal type: cd client
2.2.2 - in the client folder, type: npm i  (to install all the modules)
2.2.3 - after installing all the modules type: npm start (to start the application)
