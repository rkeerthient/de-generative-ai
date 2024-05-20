# Instructions

### Cloning and Configuration

- Clone the repo to your local machine.
- **Run the command `rm -rf .git` in your terminal to disconnect the local repository from my repo.**
- Create a new site entity in your account with two fields:
  - header
  - footer
- In your account create a new entity and upload the header image to header field and footer image to footer field and save it. Copy the newly created entity ID.
- In the repo, open the `config.yaml` file and replace `entityId` value with this ID. It should be in last line.
- Push the package to GitHub.

  ![Yaml Config](/docImages/yamlconfig.png)

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
