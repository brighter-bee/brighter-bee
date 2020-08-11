import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import axios from "axios";


// export default function CategorySelect() {
class CategorySelect extends React.Component {
    constructor(props){
    super(props);
    this.state = {
        topics: [],
    };
  }

    componentDidMount () {
        axios.get("http://127.0.0.1:8001/forum/topics/", {

      }).then(res => {
      this.setState({
          topics: res.data,
      });
      }).catch(err => {
            console.log(err);
      })
    }


    render() {
         const topic_list = this.state.topics.map((topic) =>
             <option label={topic.name}></option>
    );
        return (
            <div>
                <InputLabel htmlFor="grouped-native-select">Topic</InputLabel>
                <Select native defaultValue="" id="grouped-native-select" style={{minWidth: 400}}>
                    <option aria-label="None" value=""/>
                    {topic_list}
                </Select>
            </div>
        );
    }
}


export default (CategorySelect);