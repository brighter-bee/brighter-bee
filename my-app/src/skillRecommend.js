import React from 'react';
import { withStyles }  from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import axios from 'axios';

var  flag = false // console.log flag

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
      //     person_id: this.props.match.params.person_id
      //   };
      this.state = {
          userData:{
              person_id: "1",
              recommended_skill: "",
          }
        }
      }

      componentDidMount() {
          this.getSkills();
      }

      async getSkills() {
          await axios.get('http://localhost:8000/skill-recommend/' + this.state.userData.person_id) //if by flask
          //await axios.get('http://localhost:8000/my-skill-recommend?q=' + this.state.userData.person_id) // if by django api view
          .then(response => {
              if (flag) {
                console.log(response)}
              this.setState({
                userData:{
                    person_id: "1",
                    recommended_skill: response.data.recommended_skill, // if by flask
                    //recommended_skill: response.data[0].recommended_skill, // if by django api view
                }
              })
              if (flag) {
                console.log(this.state.userData.recommended_skill)}
          })
          .catch(error => {
              console.log(error)
          });
      }

  render() {

    return (
    <div style={{fontFamily: 'Avenir'}}>
      <h2>&nbsp; {this.state.userData.recommended_skill}</h2>
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
