export type IsDivider = {
  isDivider: boolean;
};

export type Item = {
  icon: string;
  title: string;
  onClick: () => void;
  active?: boolean;
};

export type MenuItem = Item | IsDivider;
