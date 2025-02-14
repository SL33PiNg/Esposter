export const RoutePath = {
  About: "/about",
  Clicker: "/clicker",
  Github: "https://github.com/Esposter/Esposter",
  Index: "/",
  Login: "/login",
  Messages: (id: string) => `/messages/${id}`,
  MessagesIndex: "/messages",
  MessagesGg: (inviteCode: string) => `/messages/gg/${inviteCode}`,
  PostCreate: "/post/create",
  PostUpdate: (id: string) => `/post/update/${id}`,
  PrivacyPolicy: "https://www.termsfeed.com/live/367522f3-27be-4faa-a7bd-dda7b419a8fc",
  TermsAndConditions: "https://www.termsfeed.com/live/7202726c-ae87-41cd-af54-9bde6ca4477a",
  UserSettings: "/user/settings",
} as const;
export type RoutePath = typeof RoutePath;
