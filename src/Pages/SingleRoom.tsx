import React from 'react'
import { useParams } from 'react-router-dom';

type SlugProps = {
    slug: string;
}

const SingleRoom: React.FC = () => {
    const { slug } = useParams<SlugProps>();

    return (
        <div>
            Hello from single room {slug}
        </div>
    )
}

export default SingleRoom;