import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/Login.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Login,
    props: true,
  },
  {
    path: "/oauth-callback42",
    name: "Callback42",
    component: () =>
      import(/* webpackChunkName: "chat" */ "../views/Callback42"),
    props: true,
  },
  {
    path: "/chats/" + localStorage.id,
    name: "Chat",
    component: () => import(/* webpackChunkName: "chat" */ "../views/Chat"),
    props: true,
  },
  {
    path: "/chats/admin/" + localStorage.id,
    name: "ChatAdmin",
    component: () =>
      import(/* webpackChunkName: "chat" */ "../views/ChatAdmin"),
    props: true,
  },
  // {
  //   path: "/chat-test",
  //   name: "ChatTest",
  //   component: () => import(/* webpackChunkName: "chat" */ "../views/ChatTest"),
  //   props: true,
  // },
  {
    path: "/profile/" + localStorage.id,
    name: "Profile",
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/Profile"),
    props: true,
  },
  {
    path: "/game/" + localStorage.id,
    name: "TestGame",
    component: () =>
      import(/* webpackChunkName: "game" */ "../views/TestGame"),
    props: true,
  },
  // {
  //   path: "/game-test/:id",
  //   name: "BlockGame",
  //   component: () => import(/* webpackChunkName: "game" */ "../views/BlockGame"),
  //   props: true,
  // },
  // {
  //   path: "/login",
  //   name: "Login",
  //   component: () => import(/* webpackChunkName: "game" */ "../views/Login"),
  //   props: true,
  // },
  {
    path: "/rating",
    name: "Rating",
    component: () => import(/* webpackChunkName: "game" */ "../views/Rating"),
    props: true,
  },
  {
    path: "/friends/" + localStorage.id,
    name: "Friends",
    component: () => import(/* webpackChunkName: "game" */ "../views/Friends"),
    props: true,
  },
  {
    path: "/matches/" + localStorage.id,
    name: "Matches",
    component: () => import(/* webpackChunkName: "game" */ "../views/Matches"),
    props: true,
  },
  {
    path: "/editProfile/" + localStorage.id,
    name: "EditProfile",
    component: () =>
      import(/* webpackChunkName: "game" */ "../views/EditProfile"),
    props: true,
  },
  {
    path: "/chats/private/" + localStorage.id,
    name: "PrivateChat",
    component: () =>
      import(/* webpackChunkName: "game" */ "../views/PrivateChat"),
    props: true,
  },
  {
    path: "/chats/public/" + localStorage.id,
    name: "PublicChat",
    component: () =>
      import(/* webpackChunkName: "game" */ "../views/PublicChat"),
    props: true,
  },
  {
    path: "/chats/protected/" + localStorage.id,
    name: "ProtectedChat",
    component: () =>
      import(/* webpackChunkName: "game" */ "../views/ProtectedChat"),
    props: true,
  },
  {
    path: "/:catchAll(.*)",
    component: () => import(/* webpackChunkName: "game" */ "../views/NotFound"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
