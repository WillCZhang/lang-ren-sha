function sit(roomdId, index) {
    const query = {
        roomId: roomdId,
        seatNumber: index
    };
    $.post('/sit', query, (data) => {
        if (data.code === 200) {
            window.location.reload();
        } else {
            alert(data.data);
        }
    });
    localStorage.setItem("lastSeenRoom", roomdId);
}

function cancel(roomdId) {
    $.post('/leave', {roomId: roomdId}, () => {
        localStorage.clear();
        window.location.assign("/");
    });
}

setTimeout(() => window.location.reload(), 10000);
