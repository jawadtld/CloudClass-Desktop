import { Box, makeStyles, Theme } from '@material-ui/core'
import React from 'react'
import { ControlBaseProps } from './declare'
import { ControlButton } from './button'
import { TextEllipsis } from '../../typography'

export interface ControlScaleProps extends ControlBaseProps {
  zoomInIcon?: string,
  zoomOutIcon?: string,
  scale: number,
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

export const ControlScale = (props: ControlScaleProps) => {
  const onClickMin = () => props.onClick('min')
  const onClickPlus = () => props.onClick('plus')

  const zoomInIcon = props.zoomInIcon ?? 'zoomIn'
  const zoomOutIcon = props.zoomOutIcon ?? 'zoomOut'

  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <ControlButton icon={zoomInIcon} onClick={onClickMin} />
      <TextEllipsis maxWidth={50}>
        <React.Fragment>
          {props.scale}%
        </React.Fragment>
      </TextEllipsis>
      <ControlButton icon={zoomOutIcon} onClick={onClickPlus} />
    </Box>
  )
}