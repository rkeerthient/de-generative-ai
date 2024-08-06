# Instructions

### Why to use this package?

- 100% Customizable: Tailor the page to your exact needs.🛠️
- Built with React 18: Leverage the power and speed of the latest React version.😍

### Prerequisites

- A Prod/sbx account with Chat enabled and a bot created.
- Have the react setup ready. [see here](https://hitchhikers.yext.com/docs/pages/development-dependencies/)
- Create the following two fields of type **Image** to _site_ entity type:
  - header
  - footer
- In the account create a new entity of type site and upload the header image to header field and footer image to footer field and save it and Copy the newly created entity ID.

### Cloning and Configuration

- Clone the repo to your local machine.
- **Run the command `rm -rf .git` in your terminal to disconnect the local repository from my repo.**
- In the repo, open the `config.yaml` file and replace `entityId` value with the ID we copied in first section. It should be in last line.

  ![Yaml Config](/docImages/yamlconfig.png)

### Testing it locally (_Do this step only if you want to test it locally before deploying_)

- open the `.env` file and update the details.
- These can be found in search config and chat config sections in account.
- Do a `npm i` followed by `npm run dev`. This will run the file locally to preview.
- Once we are good with the things, push the package to your github.

### Deploying Pages

- Log in to your account and click on "Pages" in the top right corner.
- Click on "Add new site" and select "Use my GitHub account" as the deployment method.
- Authenticate if prompted.
- Follow the instructions:

  - _Site Name_: Enter a name for your site.
  - _Account_: Select your account from the dropdown.
  - _Repository_: Enter the name of your uploaded repository.
  - _Production Branch_: Select the branch where you've committed your code (default is "main" or "master").

    ![Sites Config](/docImages/sites.png)

- Click **+Add a site Environment Variable** and add the following mandatory keys. Chat keys can be found in path _Chat -> Your Chat -> Integrations(available under Deployment) -> Click Embed Code_

  ![Chat Config](/docImages/chat.png)

  - _YEXT_PUBLIC_API_KEY_: Your Search API key
  - _YEXT_PUBLIC_EXP_KEY_: Your search Experience Key
  - _YEXT_PUBLIC_CHAT_APIKEY_: your chat apiKey
  - _YEXT_PUBLIC_CHAT_BOTID_: your chat botId
  - _YEXT_PUBLIC_ACCOUNTTYPE_: PROD (if production) or SBX (if not production)

    ![Search Config](/docImages/search.png)

- Click "Deploy Site" to complete the deployment.

### Other Configuration

- Most of the UI elements are stylable. open [index.css](/src/index.css) file to see the available options under _Customisations_.
- It mostly follows the same way done in Jambo.

