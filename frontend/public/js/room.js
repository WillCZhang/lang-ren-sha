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
            window.location.reload();
        }
    });
}
