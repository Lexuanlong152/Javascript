var users = [
    {
        id: 1,
        name: 'Long Le'
    },
    {
        id: 2,
        name: 'Huong Le'
    },
    {
        id: 3,
        name: 'Phi Tran'
    }

]

var comments = [
    {
        id: 1,
        user_id: 1,
        content: 'Hom nay an gi'
    },
    {
        id: 2,
        user_id: 2,
        content: 'Em ko biet'
    },
    {
        id: 1,
        user_id: 1,
        content: 'Suy nghi di'
    }

]

function getUserById(userIds) {
    return new Promise((resolve) => {
        var result = users.filter((user) => {
            return userIds.includes(user.id)
        });
        setTimeout(() => {
            resolve(result)
        }, 1000)
    }, 1000)
}

function getComments() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(comments);
        }, 1000);
    });
}

getComments()
    .then((comments) => {
        var useIds = comments.map((comment) => {
            return comment.user_id;
        })
        return getUserById(useIds)
            .then((users) => {
                return {
                    users: users,
                    comments: comments,
                }
            })
    })

    .then((data) => {
        // console.log(data.comments);
        var commetBlock = document.getElementById('comment-block');
        var html = '';
        data.comments.forEach((comment) => {
            const user = data.users.find((user) => user.id === comment.user_id);
            html = `${user.name}: ${comment.content}`
            // return html;

        });
        commetBlock.innerHTML = html;
    });

