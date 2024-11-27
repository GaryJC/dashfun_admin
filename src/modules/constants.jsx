const Constants = {
  MenuItems: {
    BackendAccounts: "Backend Accounts",
    Game: "Game",
    Task: "Task",
  },

  Authority: {
    UserManagement: 0x01,
    GameManagement: 0x02,
    TaskManagement: 0x04,
  },

  GameStatus: {
    Normal: 0,
    Pending: 1,
    Online: 2,
    Removed: 3,
  },

  GameGenre: {},

  UserStatus: {
    Normal: 1,
    ResetPassword: 2,
    Ban: 3,
  },

  Task: {
    Type: {
      Daily: 1,
      Normal: 2,
    },
    Category: {
      Challenge: 1,
      Daily: 2,
    },
    RequireType: {
      PlayRandomGame: 1,
      PlayGame:2,
      LevelUp:3,
      JoinTGChannel: 4,
      FollowX: 5,
      SpendTGStars: 6,
    },
    RewardType: {
      DashfunPoint: 2,
      GamePoint: 3,
    },
  },
};

export default Constants;
