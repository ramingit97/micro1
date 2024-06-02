import { Box, Container, Card, Stack, Typography, Link, Tabs, Tab, TextField, FormHelperText, Button } from '@mui/material';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



interface ModalProps {
    buttonTitle?:string;
    onSubmit:Function;
    children:React.ReactNode,
    formik:any
}

function FormDialog({
    buttonTitle="Open Modal",
    children,
    onSubmit,
    formik
}:ModalProps) {
  


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    onSubmit();
    setOpen(false);
  };

  const handleSubmit =  (e)=>{
    e.preventDefault();
    formik.handleSubmit();
    setOpen(false);
  }
  return (

    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        {buttonTitle}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Subscribe</DialogTitle>
            <form
                noValidate
                onSubmit={handleSubmit}
            >
            <DialogContent>
            {children}
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onSubmit={handleSubmit}>Submit</Button>
            </DialogActions>    
            </form>
      </Dialog>
    </React.Fragment>


    
  )
}




export default FormDialog;
