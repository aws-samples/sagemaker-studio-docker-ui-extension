import { style } from 'typestyle';
export const selectColumnClass = style({
    $nest: {
        '& td:first-child': {
            paddingLeft: '8px',
            paddingRight: '8px'
        },
    },
});
export const selectDorpDownClass = style({
  display: 'flex',
  flexDirection: 'column',
  color: 'var(--sm-ui-font-color1)',
  fontFamily: 'var(--sm-ui-font-family)',
  fontSize: 'var(--sm-ui-font-size1)',
  letterSpacing: 'var(--sm-custom-ui-letter-spacing)',
  lineHeight: 'var(--sm-custom-ui-text-line-height)',
  height: '100%',
  background: 'var(--sm-layout-color1)',
  color: 'var(--sm-ui-font-color1)',
  fontSize: 'var(--sm-ui-font-size1)',
  overflowY: 'auto',
  position: 'relative',
  boxSizing: 'border-box',
  cursor: 'inherit',
  opacity: '1',
});
