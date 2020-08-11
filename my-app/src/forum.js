import React from 'react';
import axios from "axios";
import Grid from '@material-ui/core/Grid';
import CreatePostDialog from "./post_form";
import Pagination from "@material-ui/lab/Pagination/Pagination";
import PostDetailDialog from "./posts_and_detail";


class ForumsPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            posts: [],
            currentPage: 1,
            count: 0,
        };
        this.handlePageChange = this.handlePageChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount () {
        axios.get("http://127.0.0.1:8001/forum/", {
            params:{
                page: this.state.currentPage,
            }
        }).then(res => {
            this.setState({
                posts: res.data,
                count: res.data[0].count,
            });
            console.log(this.state.posts);
        }).catch(err => {
            console.log(err);
        })
    }

    handlePageChange(event, value) {
        this.setState({
            currentPage: value,
        },()=>{
            this.componentDidMount()
        }
        )};

    render() {
        return (
            <div>
                <CreatePostDialog />
                <br/>
                <PostDetailDialog data={this.state.posts}/>
                <Grid>
                <br/>
                    <Pagination count={this.state.count} color="primary" style={{position: 'relative',
                                left: '65%'}} page={this.state.currentPage} onChange={this.handlePageChange}
                                showFirstButton showLastButton />
                </Grid>
            </div>
        );
    }
}

export default (ForumsPage);