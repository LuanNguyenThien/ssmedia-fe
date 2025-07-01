<h1>
  <a href="https://brainet.online" target="_blank" style="text-decoration: none;">
    <img src="https://brainet.online/assets/logo-CRUqoA6R.png" alt="icon" width="40" style="vertical-align: middle; margin-right: 8px;">
    <span style="color: #1264AB;">Brainet</span>
  </a>
</h1>

### Tools & Technologies Usage

|||||
|:-:|:-:|:-:|:-:|
|![First Image](https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fv6hrrze4gsiu3rb3qkcl.png)|![Second Image](https://res.cloudinary.com/di6ozapw8/image/upload/v1751280524/samples/sheep.png)|![Third Image](https://saigontechnology.com/wp-content/uploads/redux%20toolkit.webp)|![Fourth Image](https://miro.medium.com/v2/resize:fit:572/0*KgNXU3tz-AOj2k4b.png)

|||||
|:-:|:-:|:-:|:-:|
|![First Image](https://res.cloudinary.com/dyamr9ym3/image/upload/v1662483522/github_readme_images/react-skeleton-loader_vxafmb.png)|![Second Image](https://res.cloudinary.com/dyamr9ym3/image/upload/v1662483366/github_readme_images/date-fns_dukuao.png)|![Third Image](https://res.cloudinary.com/dyamr9ym3/image/upload/v1662483316/github_readme_images/sass_yxqpyf.png)|![Fourth Image](https://strapi.dhiwise.com/uploads/react_app_rewired_OG_Image_74710691ec.webp)

||||
|:-:|:-:|:-:|
![First Image](https://i1.wp.com/www.ux-republic.com/wp-content/uploads/2018/03/socket.png?fit=375%2C375&ssl=1)|![Second Image](https://www.3cx.vn/wp-content/uploads/sites/30/2020/07/fig-1.png)|![Third Image](https://swiftsenpai.com/wp-content/uploads/2020/06/Google-Sign-In-Firebase-Feature-Image.jpeg)

<b>Brainet</b> is a real-time social network for the digital knowledge community, built with `React` and `Vite` for a fast, responsive user experience. It enables seamless knowledge sharing through an intuitive UI, styled with `TailwindCSS` and `SCSS`, supporting real-time chat and 1:1 voice/video calls via `Socket.IO` and `WebRTC` (simple-peer). Integrated with backend APIs, it supports AI-driven content moderation, semantic search, and personalized post recommendations.

## Features

### User Management
1. **Authentication**: Sign up, sign in with email/password or Google OAuth.
2. **Password Management**: Forgot, reset, and change password securely.
3. **Profile Management**: Update personal information for personalized recommendations.
4. **Social Connections**: Follow, unfollow, block, unblock, or report users.

### Content & Interaction
5. **Posts**: Create, update, delete posts; view personalized or trending posts.
6. **Questions & Answers**: Post questions or provide answers with AI moderation.
7. **Engagement**: Upvote/downvote posts, save posts, comment (create, delete, reply, vote).
8. **Groups**: Create and manage private or public groups for collaborative learning.

### Communication
9. **Real-Time Chat**: Private or group chat with text, images, GIFs, and reactions via Socket.IO.
10. **Voice/Video Call**: 1:1 calls with screen-sharing support using WebRTC (simple-peer).

### Search & Personalization
11. **Semantic Search**: Search text or images with AI-driven results.
12. **Personalized Recommendations**: AI-driven post suggestions based on user interests.

### Notifications & Settings
13. **Notifications**: In-app and email notifications for user interactions.
14. **Settings**: Customize notification and personalization preferences.

### Admin Dashboard
1. **System Analytics**: View statistics on users, posts, and engagement.
2. **Content Moderation**: Approve, reject, or delete posts/questions with AI insights.
3. **User Management**: Handle user reports, ban/unban accounts, and process requests.

## User Interface

### Login Page

| Desktop | Mobile |
|:-------:|:------:|
![First Image](https://res.cloudinary.com/di6ozapw8/image/upload/v1751282541/samples/landscapes/girl-urban-view.png)|![Second Image](https://res.cloudinary.com/di6ozapw8/image/upload/v1751282748/ods6oqsiulosllhvgcgr.png)

### Streams Page

| Desktop | Mobile |
|:-------:|:------:|
![First Image](https://res.cloudinary.com/di6ozapw8/image/upload/v1751283082/samples/food/dessert.png)|![Second Image](https://res.cloudinary.com/di6ozapw8/image/upload/v1751283098/samples/ecommerce/analog-classic.png)

### Chat Page

| Desktop | Mobile-1 |Mobile-2|
|:-------:|:------:|:------:|
![First Image](https://res.cloudinary.com/di6ozapw8/image/upload/v1751283300/samples/people/kitchen-bar.png)|![Second Image](https://res.cloudinary.com/di6ozapw8/image/upload/v1751283318/samples/animals/reindeer.png)|![Third Image](https://res.cloudinary.com/di6ozapw8/image/upload/v1751283336/samples/animals/cat.png)

### Group Page

| Desktop | Mobile-1 |Mobile-2|
|:-------:|:------:|:------:|
![First Image](https://res.cloudinary.com/di6ozapw8/image/upload/v1751284056/sample.png)|![Second Image](https://res.cloudinary.com/di6ozapw8/image/upload/v1751284072/samples/food/fish-vegetables.png)|![Third Image](https://res.cloudinary.com/di6ozapw8/image/upload/v1751284086/samples/food/pot-mussels.png)

## Requirements

- Node 18.x or higher
- Giphy API key. You can create an account and obtain a key [here](https://developers.giphy.com/)
- Firebase API key. You also can create an account and obtain a key [here](https://console.firebase.google.com/)

- You'll need to copy the contents of `.env.develop`, add to `.env` file and update with the necessary information.

## Local Installation

- There are three different branches test, deploy-t6 and main. The test branch is the default branch.

```bash
git clone -b test https://github.com/LuanNguyenThien/ssmedia-fe
cd ssmedia-fe
npm install --legacy-peer-deps
```
- To start the server after installation, run
```bash
npm run dev
```

## Update APP_ENVIRONMENT

- Inside the `axios.js` file found via this path `src/services`, there is a variable called `APP_ENVIRONMENT`.
- If you are setting up the application locally, the variable name needs to be `local`.
- If you are deploying based on the branch, for example deploy-t6 branch, the variable value needs to be `development`.

## Deployment
- **Docker Setup**: Configure Dockerfile for frontend (React/Vite).
- **Build & Orchestrate**: Use `docker-compose` to build and manage frontend containers.
- **AWS Lightsail**: Deploy frontend on AWS Lightsail for scalable hosting.
- **Networking & Security**: Set up nginx for reverse proxy, ufw for firewall, and SSL for secure connections.
- **Environment Config**: Define environment variables for OAuth (Google Authentication).
