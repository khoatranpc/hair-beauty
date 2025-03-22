import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#db2777',
    colorInfo: '#db2777',
    colorLink: '#db2777',
    colorLinkHover: '#ec4899',
    borderRadius: 8,
    fontFamily: 'inherit',
  },
  components: {
    Menu: {
      itemHoverColor: '#db2777',
      itemSelectedColor: '#db2777',
      horizontalItemSelectedBg: 'transparent',
    },
    Input: {
      activeBorderColor: '#db2777',
      hoverBorderColor: '#f472b6',
    },
    Button: {
      primaryColor: '#ffffff',
      defaultHoverBg: '#ec4899',
    },
    Badge: {
      colorBgContainer: '#db2777',
    },
  },
};

export default theme;