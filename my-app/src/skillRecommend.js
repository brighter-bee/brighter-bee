import React from 'react';
import { fade, withStyles }  from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {Component} from 'react';
import Button from "@material-ui/core/Button";
import axios from 'axios';

const drawerWidth = 240;

const useStyles = theme => ({
  root: {
    display: 'flex',
    fontFamily: 'Roboto'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
      flexGrow: 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
});


const WelcomeText = props => {
  return (
    <div style={{fontFamily: 'Roboto'}}>
      <Typography variant="h4" component="h4">
        Are you excited to learn a new skill?
      </Typography>
      <br></br>
      <Typography style={{fontSize: "20px"}} variant="body" component="body">
        We recommend new skills by screening your current profile against the most
        common project requirements. Learning these skills would increase your chances
        to match with more projects and job opportunities.
      </Typography>
      <br></br>
      <Button onClick={props.addSkill} variant="contained" color="primary">
        RECOMMEND ME A NEW SKILL
      </Button>
    </div>
  );
}

const CourseButton = props => {
  return (
    <div style={{fontFamily: 'Roboto'}}>
      <Button onClick={props.addCourse} variant="contained" color="primary">
        WHERE CAN I LEARN THIS SKILL?
      </Button>
    </div>
  );
};

class Skill extends React.Component {
  constructor(props) {
      super(props);

      // this.state = {
      //     username: this.props.match.params.username
      //   };
      this.state = {
          userData:{
              username: "1",
              skill: "",
          }
        }
      }

      componentDidMount() {
          this.getSkills();
      }

      async getSkills() {
          await axios.get('http://localhost:8000/personskill/' + this.state.userData.username)
          .then(response => {
              console.log(response)
              this.setState({
                userData:{
                    username: "sahil.punchhi",
                    skill: response.data.results[0].skills,
                }
              })
              console.log(this.state.userData.skill)
          })
          .catch(error => {
              console.log(error)
          });
      }

      // async getSkills2() {
      //     axios.post('http://localhost:8000/personskill2/' , {
      //        'user': this.state.userData.id
      //      })
      //     .then(response => {
      //         console.log(response)
      //         this.setState({
      //           userData:{
      //               id: "1",
      //               skill: response.data.results[0].skills,
      //           }
      //         })
      //         console.log(this.state.userData.skill)
      //     })
      //     .catch(error => {
      //         console.log(error)
      //     });
      // }

  render() {

    return (
    <div style={{fontFamily: 'Avenir'}}>
      <h2>&nbsp; {this.state.userData.skill}</h2>
      <br></br>

    </div>);
  }
};

class Course extends React.Component {
  render() {
    return (
    <div style={{fontFamily: 'Avenir'}}>
      <h2>&nbsp; Lynda.com</h2>
    </div>);
  }
};

class SkillRecommend extends React.Component {
  constructor(props) {
     super(props);
     this.state = { isEmptyState: true }
     }

  triggerAddSkillState = () => {
    this.setState({
      ...this.state,
      isEmptyState: false,
      isAddSkillState: true
    })
  }

  triggerAddCourseState = () => {
    this.setState({
      ...this.state,
      isEmpty2State: false,
      isAddCourseState: true
    })
  }

  render() {
     const { classes } = this.props;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            <span>B</span>righter<span>B</span>ee
          </Typography>
          <Button color="inherit" href='/home'>Home</Button>
          <Button color="inherit" href='/home'>About</Button>
          <Button color="inherit" href='/'>Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {['Forum', 'Find Jobs', 'Skill Up', 'Set Uo Meeting','Find Projects'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />

        <div>
          {<WelcomeText addSkill={this.triggerAddSkillState} />}
          {this.state.isAddSkillState && <Skill />}
          {this.state.isAddSkillState && <CourseButton addCourse={this.triggerAddCourseState} />}
          {this.state.isAddCourseState && <Course />}
        </div>

      </main>
    </div>
  );
}
}

export default withStyles(useStyles)(SkillRecommend);
