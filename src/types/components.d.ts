export type SnackbarType = 'success' | 'warning' | 'error' | 'info';

export interface ISnackbarProps {
    showMessage: boolean;
    variant: SnackbarType;
    message: string;
    handleClose: () => void;
}