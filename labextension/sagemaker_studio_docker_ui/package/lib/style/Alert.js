import { style } from 'typestyle';
// Alert styles are cloned from Bootstrap 3
export const alert = style({
    padding: '15px',
    marginBottom: '20px',
    border: '1px solid transparent',
    borderRadius: '4px',
});
export const alertDanger = style({
    color: '#a94442',
    backgroundColor: '#f2dede',
    borderColor: '#ebccd1',
});
export const alertWarning = style({
    color: '#8a6d3b',
    backgroundColor: '#fcf8e3',
    borderColor: '#faebcc',
});
export const alertInfo = style({
    color: '#31708f',
    backgroundColor: '#d9edf7',
    borderColor: '#bce8f1',
});
export const alertSuccess = style({
    color: '#3c763d',
    backgroundColor: '#dff0d8',
    borderColor: '#d6e9c6',
});
