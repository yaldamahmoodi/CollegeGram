import {useState} from "react";

const  TagPage = () => {

    const  [posts,setPosts] = useState([]);

    return (
        <div>
            {posts.length === 0 ? (
                <>
                <h3>هنوز کسی تگت نکرده!</h3>
                <p>
                    اینجا تمام پست هایی که توشون تگ شدی رو میتونی ببینی.
                </p>
                </>
            ) :  (
                <div>
                    <h2>تگ شده ها</h2>
                    <div>

                    </div>
                </div>
            )

            }
        </div>
    )
}



export default TagPage;