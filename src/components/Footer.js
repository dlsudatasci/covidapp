import { Toolbar, AppBar, Typography, Container, Grid, makeStyles, Avatar} from '@material-ui/core';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import SchoolIcon from '@material-ui/icons/School';
import InfoIcon from '@material-ui/icons/Info';
import dlsu from '../images/dlsu.png';
import animo from '../images/animo.jpeg';
import dsi from '../images/dsi.png';

const useStyles = makeStyles((theme) => ({
  footer:{
    paddingTop:40,
    paddingBottom:40,
  },
  link:{
    display:'flex',
    marginBottom:4
  },
  logoContainer:{
    display:'flex',
  },
  icon:{
    marginRight:5,
    cursor: 'pointer'
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight:7
  },
}));


export default function Footer() {
  const classes = useStyles();
  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="xl" className={classes.footer}>
        <Toolbar>
          <Grid container spacing={3}>
            <Grid className={classes.logoContainer} item xs={12} sm={4}>
            <Avatar alt="DLSU Logo" src={dlsu} className={classes.large} />
            <Avatar alt="DSI Logo" src={dsi} className={classes.large}/>
            <Avatar alt="Animo Lab Logo" src={animo} className={classes.large} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography onClick={() => console.log('hello')} className={classes.link} variant="body1" color="inherit">
                <InfoIcon className={classes.icon}/>
                About the project
              </Typography>
              <Typography className={classes.link} variant="body1" color="inherit">
              <ContactMailIcon className={classes.icon}/>
                Contact Us
              </Typography>
              <Typography className={classes.link} variant="body1" color="inherit">
                <SchoolIcon className={classes.icon}/>
                DLSU Website
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" color="inherit">
                © 2021 De La Salle University
              </Typography>
            </Grid>
          </Grid>

        </Toolbar>
      </Container>
    </AppBar>
  )
}