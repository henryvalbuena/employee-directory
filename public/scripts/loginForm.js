(function() {
    let in01 = con => {
        if(con)
            $('#in-01').show();
        else
            $('#in-01').hide();
    }
    let in02 = con => {
        if(con)
            $('#in-02').show();
        else
            $('#in-02').hide();
    }
    function strings(data) {
        if (data.length > 0) return true;
        return false;
    }
    $('#userName').on('keyup focusout', () => {
        in01(!strings($('#userName').val()));
    });
    $('#password').on('keyup focusout', () => {
        in02(!strings($('#password').val()));
    });
})();