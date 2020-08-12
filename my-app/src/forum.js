import React from 'react';
import axios from "axios";
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
    }

    // GET request for all posts
    componentDidMount  () {
        axios.get("http://127.0.0.1:8000/forum/", {
            params:{
                page: this.state.currentPage,
            }
        }).then(res => {
            this.setState({
                posts: res.data,
                count: res.data[0].count,
            });
        }).catch(err => {
        })
    }

    //event when page changes
    handlePageChange(event, value) {
        this.setState({
            currentPage: value,
        },()=>{
            this.componentDidMount ()
        }
        )};

    render() {
        return (
            <div style={{overflow:'hidden'}}>
                <CreatePostDialog />
                <br/>
                <PostDetailDialog data={this.state.posts}/>
                <div>
                <br/>
                    <Pagination count={this.state.count} color="primary" style={{position: 'relative',
                                left: '65%'}} page={this.state.currentPage} onChange={this.handlePageChange}
                                showFirstButton showLastButton />
                </div>
            </div>
        );
    }
}

export default (ForumsPage);