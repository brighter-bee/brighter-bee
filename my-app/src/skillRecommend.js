import React from 'react';
import { withStyles }  from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import axios from 'axios';

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

        <div>
          {<WelcomeText addSkill={this.triggerAddSkillState} />}
          {this.state.isAddSkillState && <Skill />}
          {this.state.isAddSkillState && <CourseButton addCourse={this.triggerAddCourseState} />}
          {this.state.isAddCourseState && <Course />}
        </div>

      
  );
}
}

export default withStyles(useStyles)(SkillRecommend);
