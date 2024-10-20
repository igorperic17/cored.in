export const ROUTES = {
  ROOT: {
    path: "/"
  },
  LOGIN: {
    path: "/login"
  },
  HOME: {
    path: "/home"
  },
  USER: {
    path: "/user/:wallet",
    buildPath: (wallet: string) => {
      return `${ROUTES.USER.path.replace(":wallet", wallet.toLowerCase())}`;
    },
    POST: {
      path: "posts/:id",
      buildPath: (wallet: string, id: number) => {
        return `${ROUTES.USER.buildPath(wallet) + "/" + ROUTES.USER.POST.path.replace(":id", id.toString())}`;
      }
    }
  },
  MESSAGES: {
    path: "/messages"
  },
  CREDENTIALS: {
    path: "/credentials",
    REQUEST: {
      path: "/credentials/request"
    },
    INCOMING_REQUESTS: {
      path: "/credentials/incoming-requests"
    }
  },
  SUBSCRIPTIONS: {
    path: "/subscriptions"
  },
  SETTINGS: {
    path: "/settings"
  },
  TIPS: {
    path: "/tips"
  },
  PRIVACY_POLICY: {
    path: "/privacy-policy"
  }
};
