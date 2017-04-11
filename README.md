# Tanium Tableau Web Data Connector

Built using NodeJS this solution will run on your local machine and allow for pulling data extracts from the Tanium SOAP API into Tableau.

## Instructions

- Download and install NodeJS from [https://nodejs.org/](https://nodejs.org/)
- Clone this repository to a directory on your machine.
- Run `npm install` to install the necessary modules
- Run `node server` to start the WDC
- Browse to `http://127.0.0.1:3000/config`
- Set the appropriate settings for:
  - Soap Endpoint: URL for your Tanium SOAP Endpoint
  - Tanium Login: A valid Tanium Login Name (recommend creating a read-only user for this)
  - Tanium Password: The password for the account above

After the configuration is saved you will be redirected to `http://127.0.0.1/`.  The drop down list should populate with a list of Saved Qeustions from your environment.  Once you see those questions the WDC is ready to be used inside Tableau. (you can close your browser)

- Open Tableau Desktop or Tableau Public. (Must be version 10.1 or higher)
- Under "To A Server" use the "Web Data Connector"
- Enter the url `http://127.0.0.1:3000`
- Select the Question you would like to use.
- Click "Check Question Results". This will report the percentage of clients have responded to to the Saved Question.
- Once all the clients have responded you can click "Get Results" to import the data.

Other Notes:
- Use the following commands for different run modes
  - "npm run dev" - Runs with basic troubleshooting output to console
  - "npm run debug" - Runs with extensive logging to conosole
  - "npm run Port80" - Runs it using port 80 (may need to run using sudo command.  not tested on Windows)
