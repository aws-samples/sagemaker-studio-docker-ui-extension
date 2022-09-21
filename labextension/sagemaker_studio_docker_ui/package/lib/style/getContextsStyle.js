import { style } from 'typestyle';

export const defaultHeight = style(
  {
    hieght: 'auto'
  }
)
export const itemIconSpan = style(
  {
    flex: '0 0 auto',
    padding: '0px 8px',
    marginRight: '4px',
    marginLeft: '12px',
    verticalAlign: 'baseline',
    backgroundSize: '16px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  }
)
export const instanceDescriptionDiv = style(
  {
    paddingLeft: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: '1 1 95px',
    transition: 'background-color 0.1s ease',
    $nest: {
      '&:hover': {
        background: 'var(--jp-layout-color2)'
      },
      '&:focus': {
        background: 'rgba(153, 153, 153, 0.2)'
      }
    }
  }
)
export const runningHostStyle = style(
  {
    backgroundImage: 'var(--jp-runningHostIcon)',
    flex: '0 0 auto',
    padding: '0px 8px',
    marginRight: '6px',
    marginLeft: '12px',
    verticalAlign: 'middle',
    backgroundSize: '16px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    color: 'var(--jp-ui-font-color1)',
    lineHeight: 'var(--jp-private-running-item-height)'
  }
)
export const idleHostStyle = style(
  {
    backgroundImage: 'var(--jp-idleHostIcon)',
    flex: '0 0 auto',
    padding: '0px 8px',
    marginRight: '0px',
    marginLeft: '6px',
    verticalAlign: 'middle',
    backgroundSize: '16px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    color: 'var(--jp-ui-font-color1)',
    lineHeight: 'var(--jp-private-running-item-height)'
  }
)
export const imageIconStyle = style(
  {
    backgroundImage: 'var(--jp-imageIcon)',
    flex: '0 0 auto',
    padding: '0px 8px',
    marginRight: '4px',
    marginLeft: '12px',
    verticalAlign: 'middle',
    backgroundSize: '16px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    color: 'var(--jp-ui-font-color1)',
    lineHeight: 'var(--jp-private-running-item-height)'
  }
)
export const containerIconStyle = style(
  {
    backgroundImage: 'var(--jp-containerIcon)',
    flex: '0 0 auto',
    padding: '0px 8px',
    marginRight: '4px',
    marginLeft: '12px',
    verticalAlign: 'middle',
    backgroundSize: '16px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    color: 'var(--jp-ui-font-color1)',
    lineHeight: 'var(--jp-private-running-item-height)'
  }
)