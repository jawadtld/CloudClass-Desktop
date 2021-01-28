import { Box, ButtonBase, SvgIcon } from '@material-ui/core'
import React from 'react'
import { CustomButton } from '../../button'
import { ControlBaseProps } from './declare'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'
import IconButton from '@material-ui/core/IconButton'

export type ControlButtonIcon = string

export interface ControlButtonProps extends ControlBaseProps{
  icon: ControlButtonIcon
}

const buttonsMap = {
  'back': NavigateBeforeIcon,
  'forward': NavigateNextIcon,
  'zoomIn': ZoomInIcon,
  'zoomOut': ZoomOutIcon,
  'fullscreen': FullscreenIcon,
  'fullscreenExit': FullscreenExitIcon,
}

export const ControlButton = ({icon, onClick}: ControlButtonProps) => {
  const RealButton = buttonsMap[icon]
  return (
    <IconButton style={{
      width: 18,
      height: 18,
      color: '#ffffff',
    }} disableRipple onClick={onClick}>
      <RealButton />
    </IconButton>
  )
  
  // return btn({onClick})
  // return v({onClick})
  // <ButtonBase
  //   component={
  //     icon
  //   }
  //   disableRipple
  //   onClick={onClick}
  // ></ButtonBase>
  // <CustomButton
  //   component="div" style={{
  //     background: `url(${icon}) no-repeat`,
  //     backgroundSize: 'contain',
  //     backgroundPosition: 'center',
  //     minWidth: 18,
  //     minHeight: 18,
  //     '&:hover': {
  //       opacity: 0.1
  //     },
  //     '&:active': {
  //       opacity: 0.9
  //     },
  //     marginRight: 5,
  //   }} onClick={onClick} />
  //   <Box></Box>
  // </CustomButton>
}