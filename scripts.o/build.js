// TODO: Script working if this file is in the root fodler, need to make adjustments to work here
// MUST HAVE 7zip installed https://www.7-zip.org/
// ONLY WORK ON WINDOWS 10-11... MUST HAVE GITHUB CLI FOR THE RELEASE
const shell = require("shelljs");
const pjson = require('../package.json');
const path = require('path')

const zipPath = path.join(__dirname, 'out/make/squirrel.windows/')

shell.exec("echo shell.exec works");
shell.exec("npm run make");
shell.exec("echo Executable created");

shell.exec("echo Copying the gsi cfg file");
shell.exec("cp gamestate_integration_d2reminders.cfg ./out/make/squirrel.windows/x64/");

shell.exec("echo Ziping the app");
const sevenZipPath = String.raw`C:\Program Files\7-Zip\7z.exe`;
shell.exec(`"${sevenZipPath}" a -tzip "${zipPath}d2remindersv${(pjson.version)}.zip" "${zipPath}x64"`)


shell.exec(`echo Creating the release v${(pjson.version)}`)
shell.exec(`gh release create v${pjson.version} "${zipPath}d2remindersv${(pjson.version)}.zip#Dota 2 Reminders v${(pjson.version)} MSI"`)
