# WebpageTest | Slack | Google Spreadsheet

Profile a URL in WPT and send the relevant results to Slack and store all the
 results in a Google Spreadsheet.

### Installation

Clone the repo:

`git clone git@github.com:theatlantic/wpt-slack-spreadsheet.git`

Change directories into the codebase:

`cd wpt-slack-spreadsheet`

Install the dependencies:

`npm install`

### Config

Fill in the values in `config/default.json`.

### Usage

When the configuration is all setup and the dependencies are installed,
 everything should work by running:

 ```
# url: The URL to profile
# creds: A JSON file with the Google Spreadsheet API credentials
# tab: The tab index of the spreadsheet
# mobile: [OPTIONAL] Specify if WPT should profile the URL on mobile
node index.js \
--url=<URL> \
--creds=<PATH_TO_GOOGLE_SPREADSHEET_CREDS> \
--tab=<GOOGLE_SPREADSHEET_TAB_INDEX> \
--mobile=true
 ```

### Todo

- Remove `config` module and opt for CLI config
- Smart WPT defaults and merge with a CLI config
- Tests
- ¯\\\_(ツ)_/¯
