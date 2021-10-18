// import logo from './logo.svg';
import './App.css';
import 'react-datasheet/lib/react-datasheet.css';

import React from 'react';
import MainForm from './components/MainForm.js';
import Footer from './components/Footer.js';

import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Avatar, Button, Container, Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Hidden from '@material-ui/core/Hidden';

import aviso from './images/team/aviso.png';
import sy from './images/team/sy.png';
import torneo from './images/team/torneo.png';
import tapia from './images/team/tapia.png';
import cordel from './images/team/cordel.png';
import tan from './images/team/tan.png';
import chiu from './images/team/chiu.png';
import ubando from './images/team/ubando.png';
import gonzalez from './images/team/gonzalez.png';
import chua from './images/team/chua.jpg';
import manzano from './images/team/manzano.jpg';
import ona from './images/team/ona.png';

const team = [
  {
    img: aviso,
    name: 'Dr. Kaye B. Aviso'
  },
  {
    img: sy,
    name: 'Dr. Charlie Sy'
  },
  {
    img: torneo,
    name: 'Dr. Ador Torneo'
  },
  {
    img: tapia,
    name: 'Dr. John Frederick Tapia'
  },
  {
    img: cordel,
    name: 'Dr. Macario Cordel'
  },
  {
    img: tan,
    name: 'Dr. Raymond Tan'
  },
  {
    img: chiu,
    name: 'Dr. Anthony Chiu'
  },
  {
    img: ubando,
    name: 'Dr. Aristotle Ubando'
  },
  {
    img: gonzalez,
    name: 'Mr. Dickie Gonzalez'
  },
  {
    img: chua,
    name: 'Ms. Unisse Chua'
  },
  {
    img: manzano,
    name: 'Mr. Joshua Manzano'
  },
  {
    img: ona,
    name: 'Mr. Ian Ona'
  },
]

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontWeight: 'normal',
    textAlign: 'left'
  },
  header: {
    display: 'flex',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: 7
  },
  team: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign:'center'
  },
  teamContainer:{
    marginTop:10
  }
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h3">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);


function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <AppBar color="primary" position="static">
        <Toolbar>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Container className={classes.header}>
            <Hidden smDown>
              <Typography variant="h1" className={classes.title}>
                COVID-19 Vaccine Allocation Model 
              </Typography>
            </Hidden>
            <Hidden only='xs' mdUp>
              <Typography variant="h3" className={classes.title}>
                COVID-19 Vaccine Allocation Model 
              </Typography>
            </Hidden>
            <Hidden only='sm' mdUp>
              <Typography variant="h4" className={classes.title}>
                COVID-19 Vaccine Allocation Model 
              </Typography>
            </Hidden>
            <Button onClick={handleOpen} variant="contained" color="default">
              About
                    </Button>
          </Container>
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>



      <Dialog maxWidth={"md"} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Project Overview
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            This COVID-19 vaccine allocation app allows decision maker to determine the optimal distribution of the vaccines in a particular region. It features an optimization model that can be modified to either minimize vaccine requirement to stop the disease spread or minimize disease spread with limited vaccine supply.  This app is developed with several researchers in different disciplines of engineering, social sciences and business in cooperation with the Dr. Andrew L. Tan Data Science Institute of De La Salle University.
          </Typography>
          <br />
          <Typography variant="h3">
            Research Team
          </Typography>
          <Grid container spacing={1} className={classes.teamContainer}>
            {team.map((member) =>
            <Grid key={member.name} item sm={2} xs={12}>
              <Box className={classes.team}>
                <Avatar alt="aviso" src={member.img} className={classes.large} />
                <Typography variant="body2">
                  {member.name}
                </Typography>
              </Box>
          </Grid>

            )}
          </Grid>
          {/* <Typography gutterBottom>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </Typography>
          <Typography gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </Typography> */}
        </DialogContent>
      </Dialog>

      {/* Main Form Component */}
      <Box mt={4}>
        <MainForm />
      </Box>

      <Footer />
    </div>
  );
}

export default App;
