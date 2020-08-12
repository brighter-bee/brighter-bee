from math import ceil

from django import http
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

from person.models import Post, Reply, ForumCategory, Person
from person.serializers import PostSerializer, LogicalDeletePostSerializer, CommentSerializer, TopicSerializer


# self-customized Pagination attributes
class MyPageNumber(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'size'
    page_query_param = 'page'
    max_page_size = None


# View for processing model Post
class PostView(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    # overwrite the function for GET request
    # return a pagination post list with json format
    @action(methods=['get'], detail=True)
    def getPostList(self, request, *args, **kwargs):
        postList = Post.objects.all().filter(isDeleted=False).order_by('-createdAt')

        count = ceil(postList.count()/8)

        pg = MyPageNumber()

        page_posts = pg.paginate_queryset(queryset=postList, request=request, view=self)

        postListSerializer = PostSerializer(instance=page_posts, many=True)

        for post in postListSerializer.data:
            queryUser = Person.objects.get(id=post['poster'])
            post['count'] = count
            post['username'] = queryUser.name

        return http.JsonResponse(postListSerializer.data, safe=False)

    # overwrite the function for GET request with another url
    # return a individual pagination post list with json format
    @action(methods=['get'], detail=True)
    def getMyPostsList(self, request, poster):
        myPostsList = Post.objects.all().filter(poster_id=poster).filter(isDeleted=False)

        count = ceil(myPostsList.count() / 8)

        pg = MyPageNumber()

        page_myPosts = pg.paginate_queryset(queryset=myPostsList, request=request, view=self)

        myPostListSerializer = PostSerializer(instance=page_myPosts, many=True)

        for myPost in myPostListSerializer.data:
            queryUser = Person.objects.get(id=myPost['poster'])
            myPost['count'] = count
            myPost['username'] = queryUser.name

        return http.JsonResponse(myPostListSerializer.data, safe=False)

    # overwrite the function for GET request with another url
    # return a single post record with json format
    @action(methods=['get'], detail=True)
    def getCurrentPost(self, request, pk):
        currentPost = Post.objects.get(id=pk)

        currentPostSerializer = PostSerializer(instance=currentPost)

        return http.JsonResponse(currentPostSerializer.data, safe=False)

    # overwrite delete function
    # apply a locally deleted method
    @action(methods=['delete'], detail=True)
    def deletePost(self, request, pk):
        post_01 = Post.objects.get(id=pk)

        post_02 = Post.objects.get(id=pk)
        post_02.isDeleted = True

        updated_post = LogicalDeletePostSerializer(instance=post_01, data=post_02.__dict__)
        updated_post.is_valid(raise_exception=True)

        updated_post.save()

        return http.HttpResponse(status=204)


# View for processing model reply
class CommentView(ModelViewSet):
    queryset = Reply.objects.all()
    serializer_class = CommentSerializer

    # overwrite get function
    # return a pagination comment list under a post with json format
    @action(methods=['get'], detail=True)
    def getCommentList(self, request, *args, **kwargs):
        post = request.GET.get('post')

        commentList = Reply.objects.all().filter(post_id=post).filter(parent_id=0).filter(isDeleted=False).order_by('-createdAt')

        count = ceil(commentList.count() / 8)

        pg = MyPageNumber()

        page_comments = pg.paginate_queryset(queryset=commentList, request=request, view=self)

        commentListSerializer = CommentSerializer(instance=page_comments, many=True)

        for comment in commentListSerializer.data:
            query_reply_to_user = Person.objects.get(id=comment['replyTo_id'])
            query_replies_number = Reply.objects.filter(parent_id=comment['id']).count()
            query_current_user_name = Person.objects.get(id=comment['poster'])
            comment['count'] = count
            comment['replyToName'] = query_reply_to_user.name
            comment['replyNumber'] = query_replies_number
            comment['currentName'] = query_current_user_name.name

        return http.JsonResponse(commentListSerializer.data, safe=False)

    # overwrite get function for another url
    # return a pagination comment list under another comment with json format
    @action(methods=['get'], detail=True)
    def getCurrentReplyList(self, request, *args, **kwargs):

        parent_id = request.GET.get('id')

        replyReplyList = Reply.objects.all().filter(parent_id=parent_id).filter(isDeleted=False).order_by('-createdAt')

        count = ceil(replyReplyList.count() / 8)

        pg = MyPageNumber()

        page_reply_reply = pg.paginate_queryset(queryset=replyReplyList, request=request, view=self)

        replyReplyListSerializer = CommentSerializer(instance=page_reply_reply, many=True)

        for replyReply in replyReplyListSerializer.data:
            query_reply_reply_to_user = Person.objects.get(id=replyReply['replyTo_id'])
            query_reply_current_user = Person.objects.get(id=replyReply['poster'])
            replyReply['count'] = count
            replyReply['replyReplyToName'] = query_reply_reply_to_user.name
            replyReply['replyReplyCurrentName'] = query_reply_current_user.name

        return http.JsonResponse(replyReplyListSerializer.data, safe=False)


# view for processing model topic
class TopicView(ModelViewSet):
    queryset = ForumCategory.objects.all()
    serializer_class = TopicSerializer

    # overwrite get function
    # return a topic list with json format
    @action(methods=['get'], detail=True)
    def getTopicList(self, request, *args, **kwargs):
        topicList = ForumCategory.objects.all()

        topicListSerializer = TopicSerializer(instance=topicList, many=True)

        return http.JsonResponse(topicListSerializer.data, safe=False)
