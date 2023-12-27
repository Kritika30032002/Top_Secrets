<div align="center">

 # Top_Secrets
 ![License](https://img.shields.io/github/license/Kritika30032002/Top_Secrets.svg?style=for-the-badge) ![Repo Size](https://img.shields.io/github/languages/code-size/Kritika30032002/Top_Secrets.svg?style=for-the-badge) ![TOP_LANGUAGE](https://img.shields.io/github/languages/top/Kritika30032002/Top_Secrets.svg?style=for-the-badge) ![FORKS](https://img.shields.io/github/forks/Kritika30032002/Top_Secrets.svg?style=for-the-badge&social) ![Stars](https://img.shields.io/github/stars/Kritika30032002/Top_Secrets.svg?style=for-the-badge)
 
 ![Discord Server](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)
 
 This is a website that allows user to add their secrets anonymously to the website. Thus, makes it interesting. One can add their secrets that they don't want to share with anyone.
    
</div>

## 🖼️ Demo Video of Website
[screen-capture.webm](https://user-images.githubusercontent.com/83400697/204582783-e3def69a-61f6-4421-972f-34134ec4528b.webm)

## 📖 Table of Contents

- [Technologies](#-technologies)
- [Project Setup](#-project-setup)
- [Contributing](#-contributing)
   - [How to Get Started with Open Source](#-how-to-get-started-with-open-source)
   - [Things to do After Making a Change](#-after-making-a-change)
   - [Rules](#-rules)
   - [Reporting a Bug or Discussing a Feature Idea](#-reporting-a-bug-or-discussing-a-feature-idea)
   - [Fixing a Bug or Implement a new Feature](#-fixing-a-bug-or-implementing-a-new-feature)
- [Thanks to all contributors](#-thanks-to-all-contributors)
- [License](#-license)

 ## 🧰 Technologies

- HTML
- Javascript
- CSS
- Bootstrap
- Nodejs
- Expressjs
- MongoDB

## 🚀 Project Setup
To get started with locally running the app, follow these simple steps:

1. **Clone this repository**: Begin by cloning the Top Secrets repository to your local machine using the following command:
    ```bash
    git clone https://github.com/Kritika30032002/Top_Secrets.git
    ```
2. **Install the dependencies**: Navigate to the cloned repository and install the required dependencies by running the following command:
    ```bash
    npm install --force
    ```
3. **Create a `.env` file**: Create a `.env` file in the root directory of your project and add the following environment variables:
    ```env
    GOOGLE_ID=<YOUR GOOGLE OAUTH CLIENT ID>
    GOOGLE_SECRET=<YOUR GOOGLE OAUTH SECRET KEY>
    FACEBOOK_APP_ID=<YOUR FACEBOOK APP ID>
    FACEBOOK_APP_SECRET=<YOUR FACEBOOK SECRET KEY>
    
    PUBLIC_BASENAME=http://localhost:3000/
    PORT=3000
    MONGO_SERVER=mongodb://127.0.0.1:27017
    ```

    - `GOOGLE_ID` & `GOOGLE_SECRET` : Refer to this video for **Google OAuth Client ID and Secret key** : [Click Here](https://www.youtube.com/watch?v=XiuA-xO5Pz8) 
    - `FACEBOOK_APP_ID` & `FACEBOOK_APP_SECRET` : Refer to this video for **Facebook ID and Secret key**: [Click Here](https://www.youtube.com/watch?v=LLlpH3vZVkg&t=258s)
    - `PUBLIC_BASENAME` : The base URL for the Express app. For local setup, `http://localhost:3000/`
    - `PORT` : The port on which the Express app is running.
    - `MONGO_SERVER` : The MongoDB URI. A MongoDB URI looks like the below examples. Check the video for local setup on [Windows](https://www.youtube.com/watch?v=gB6WLkSrtJk) & [Ubuntu](https://www.youtube.com/watch?v=HSIh8UswVVY). For a free cloud MongoDB database check [this video](https://www.youtube.com/watch?v=jXgJyuBeb_o). 
  
    > **Locally running instance**: `mongodb://127.0.0.1:27017/`
    > 
    > **Hosted on the internet**: `mongodb+srv://<username>:<password>@somecluster.some.mongodb.net/`
    
4. **Run the project**: Once you have installed the dependencies and added the required environment variables, you are ready to run the project. To start the development server, run the following command:
    ```bash
    node app.js
    ```
    or use `nodemon` to run it in background for a detailed log & better development experience
   ```bash
   npx nodemon app.js
   ```

   Great you have successfully run the app! **Now get coding!**

<div  align="center">
    <img  height="200px"  src="https://user-images.githubusercontent.com/77617189/192947926-37284128-9965-46a4-b29b-c75e47b2f76b.svg"  />
</div>

## 🌱 Contributing

**I heartily welcome any and all contributions that match our engineering standards! :raised_hands:**

That being said, this codebase isn't your typical open source project because it's not a library or package with a limited scope—it's our entire product.

* Contributions make the open source community such an amazing place to learn, inspire, and create.
* Any contributions you make are greatly appreciated.
* Check out our contribution guidelines for more information.

<div align="center">

<pre>Don't forget to leave a star✨ </pre>
<h2>HAPPY CONTRIBUTING!!</h2>

</div>

### 🧑‍💻 How to get started with Open Source

Here's a quick run down on how to get started with open source, first of all let's know some basic terminologies:

- Git: is a versioning system that let's you store your code and code history on your local computer preventing loses and allowing sharing of that code
- Github: is a server that let's you store the history in a database
- Open Source: A project is said to be open sourced if you can see the code on GitHub
- Fork: This is a copy that you make of a project on GitHub, it gets added to your repositories
- Repository: A project on GitHub is called a repository
- Pull Request: This is a fix for an issue proposed to be done in a project, this consists of you editing a file in the project.
- Issue: An issue is a change that should be done in a project, can be a bug, a new feature or a suggestion to a project
- Branch: A branch is a new workspace derived from the default workspace(main or master), it allows you to work on something without affecting the original code.
- Star: When you star a repositiory, it gets saved at your profile and you can easily re-visit it later.

Now you know some basic terms, let's get into how to get started with some resources to let you understand open source better:

- [Crash Course to Git and Github](https://www.youtube.com/watch?v=apGV9Kg7ics) - Video
- [A complete Guide to Open Source](https://www.youtube.com/watch?v=yzeVMecydCE) - Video
- [Guide to Open Source](https://www.freecodecamp.org/news/how-to-contribute-to-open-source-projects-beginners-guide/) - Article

### 🥂 After making a change

1. Create a new branch
```
git checkout -b YourBranchName
```
2. Add it to staging area
```
git add <path to the file you worked on>
```
3. Commit your changes with
```
git commit -m "message"
```
4. Push your changes
```
git push
```

### 📃 Rules

- **No `console.log`s in any file**: We use the `debug` module across the codebase to log debugging information in development only. Never commit a file that contains a `console.log` as CI will fail your build. The only exceptions are errors, which you can log, but you have to use `console.error` to be explicit about it
- **Code reviews**: All submissions, including submissions by project members, require review. We use GitHub pull requests for this purpose.

### 🕵 Reporting a bug or discussing a feature idea

If you found a technical bug on the website or have ideas for features we should implement, the issue tracker is the best place to share your ideas.  ([click here to open a new issue](https://github.com/Kritika30032002/Top_Secrets/issues))

### ✨ Fixing a bug or implementing a new feature

- If you find a bug on Project and open a PR that fixes it we'll review it as soon as possible to ensure it matches our engineering standards.
- If you want to implement a new feature, open an issue first to discuss what it'd look like .
- If you want to contribute but are unsure to start, we have [a "good first issue" label](https://github.com/Kritika30032002/Top_Secrets/contribute) which is applied to newcomer-friendly issues and pick something you like!
- Want to fix a bug or implement an agreed-upon feature? Great, jump to the [local setup instructions](#project-setup)!

## 💪 Thanks to all Contributors

Thanks a lot for spending your time helping Top_Secrets to grow. Thanks a lot! Keep rocking 🍻
Also Give it a Star 🌟, If you loved contributing to the project.

## 📄 License

MIT License, see the [LICENSE](./LICENSE) file.
