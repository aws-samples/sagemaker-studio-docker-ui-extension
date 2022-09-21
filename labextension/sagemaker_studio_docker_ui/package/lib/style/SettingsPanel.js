import { style } from 'typestyle';
export const jpRunningSectionHeader = style({
  fonteight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: 'var(--jp-ui-font-size0)',
  padding: '8px 8px 8px 12px',
  margin: '0px'
});
export const jpRunningSectionClass = style({
  alignItems: 'center',
  height: '28px',
  display: 'flex',
  borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
  marginTop: '8px'
});
export const runSidebarSectionClass = style({
    background: 'var(--jp-layout-color1)',
    overflow: 'visible',
    color: 'var(--jp-ui-font-color1)',
    /* This is needed so that all font sizing of children done in ems is
     * relative to this base size */
    fontSize: 'var(--jp-ui-font-size1)',
    marginBottom: '12px',
    marginTop: '12px',
    marginLeft: '12px',
    marginRight: '12px',
    $nest: {
        '& header': {
            borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
            flex: '0 0 auto',
            fontSize: 'var(--jp-ui-font-size0)',
            fontWeight: 600,
            letterSpacing: '1px',
            margin: '0px 0px 8px 0px',
            padding: '8px 12px',
            textTransform: 'uppercase',
        },
        '&>*': {
            marginLeft: '12px',
        },
        '&>.inputColumnMarker': {
            marginLeft: '10px',
        },
    },
});
export const runSidebarNoHeaderClass = style({
    borderTop: 'var(--jp-border-width) solid var(--jp-border-color2)',
    paddingTop: '8px',
});
export const runSidebarNotebookNameClass = style({
    marginBottom: 'auto',
    fontWeight: 700,
});
export const runSidebarNoNotebookClass = style({
    fontStyle: 'italic',
    padding: '0px 12px',
});
export const sidebarHeaderClass = style({
  flex: '0 0 auto',
  display: 'flex',
  flexDirection: 'row',
  margin: 'var(--jp-toolbar-header-margin)',
  justifyContent: 'flex-end',
});
export const sidebarButtonClass = style({
    boxSizing: 'border-box',
    width: '9.7em',
    height: '2em',
    color: 'white',
    fontSize: 'var(--jp-ui-font-size1)',
    backgroundColor: 'var(--jp-brand-color1)',
    border: '0',
    borderRadius: '3px',
    $nest: {
        '&:hover': {
            backgroundColor: 'var(--jp-brand-color0)',
        },
        '&:active': {
            color: 'var(--md-grey-200)',
            fontWeight: 600,
        },
    },
});
// Emulate flexbox gaps even in browsers that don't support it yet, per https://coryrylan.com/blog/css-gap-space-with-flexbox
const buttonGapX = '20px';
const buttonGapY = '8px';
export const flexButtonsClass = style({
    display: 'inline-flex',
    flexWrap: 'wrap',
    margin: `-${buttonGapY} 0 0 -${buttonGapX}`,
    width: `calc(100% + ${buttonGapX})`,
    $nest: {
        '> *': {
            margin: `${buttonGapY} 0 0 ${buttonGapX}`,
        },
    },
});
export const alertAreaClass = style({
    marginLeft: '12px',
    marginRight: '12px',
});
export const toolbarButtonClass = style({
    boxSizing: 'border-box',
    height: '24px',
    width: 'var(--jp-private-running-button-width)',  
    margin: 'auto 0 auto 0',
    padding: '0px 6px',  
    border: 'none',
    outline: 'none',  
    $nest: {
      '&:hover': {
        backgroundColor: 'var(--jp-layout-color2)'
      },
      '&:active': {
        backgroundColor: 'var(--jp-layout-color3)'
      }
    }
});
export const refreshButtonClass = style({
    marginRight: '4px',  
    background: 'var(--jp-layout-color1)',
    backgroundImage: 'var(--jp-icon-refresh)',
    backgroundSize: '16px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
});