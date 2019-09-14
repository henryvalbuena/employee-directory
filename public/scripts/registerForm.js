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
    let in03 = con => {
        if(con)
            $('#in-03').show();
        else
            $('#in-03').hide();
    }
    let in04 = con => {
        if(con)
            $('#in-04').show();
        else
            $('#in-04').hide();
    }
    function strings(data) {
        return (data.length > 0)
    }
    function passMatch() {
        return $('#password01').val() === $('#password02').val();
    }
    $('#userName').on('keyup focusout', () => {
        in01(!strings($('#userName').val()));
    });
    $('#password01').on('keyup focusout', () => {
        in02(!strings($('#password01').val()));
        in03(!passMatch());
    });
    $('#password02').on('keyup focusout', () => {
        in03(!passMatch());
    });
    $('#email').on('keyup focusout', () => {
        in04(!strings($('#email').val()));
    });
})();