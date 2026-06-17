type ScreenDefinition = {
  name: string;
  route: string;
  state?: Record<string, unknown>;
};

export const manifest: { screens: Record<string, ScreenDefinition> } = {
  screens: {
    scr_l2q8ji: { name: 'Home', route: '/' }
  }
};
