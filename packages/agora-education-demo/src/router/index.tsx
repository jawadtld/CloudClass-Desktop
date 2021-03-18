import { OneToOne } from '@/pages/one-to-one';
import { SmallClassRoom } from '@/pages/small-class-room';
import { SettingPage } from '@/pages/setting';
import { HomePage } from '@/pages/home';
import { LaunchPage } from '@/pages/launch';
import { PretestPage } from '@/pages/pretest';
import React from 'react';
import { BizPageRouter } from '@/types';

export type AppRouteComponent = {
  path: string
  component: React.FC<any>
}

// TODO: need fix tsx
const PageSFC = (Component: React.FC<any>) => {
  return <Component />
}
export const routesMap: Record<string, AppRouteComponent> = {
  // [BizPageRouter.Setting]: {
  //   path: '/setting',
  //   component: () => PageSFC(SettingPage)
  // },
  // 一对一
  [BizPageRouter.OneToOne]: {
    path: '/classroom/1v1',
    component: () => PageSFC(OneToOne)
  },
  // 观众端
  [BizPageRouter.OneToOneIncognito]: {
    path: '/incognito/1v1',
    component: () => PageSFC(OneToOne)
  },
  [BizPageRouter.SmallClass]: {
    path: '/classroom/small',
    component: () => PageSFC(SmallClassRoom)
  },
  [BizPageRouter.SmallClassIncognito]: {
    path: '/incognito/small',
    component: () => PageSFC(SmallClassRoom)
  },
  [BizPageRouter.LaunchPage]: {
    path: '/launch',
    component: () => PageSFC(LaunchPage)
  },
  [BizPageRouter.PretestPage]: {
    path: '/pretest',
    component: () => PageSFC(PretestPage)
  },
  [BizPageRouter.TestHomePage]: {
    path: '/',
    component: () => PageSFC(HomePage)
  }
}