import React from 'react'

const PreviewRoomPage = () => {
    const [room, setRoom] = React.useState<any>();
    console.log(room);

    React.useEffect(() => {
        const room = localStorage.getItem("previewRoom");
        console.log(room)
        if (room) setRoom(JSON.parse(room));

        return function cleanup() {
            localStorage.removeItem("previewRoom");
        }
    }, []);

    React.useEffect(() => {
        console.log(room);
    }, [room])

    return <>Hello</>
}

export default PreviewRoomPage;