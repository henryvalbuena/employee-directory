(function() {
    let in01 = con => {
        if(con)
            $('#in-01').show();
        else
            $('#in-01').hide();
    }
    function strings(data) {
        if (data.length > 0) return true;
        return false;
    }
    $('#departmentName').on('keyup focusout', () => {
        in01(!strings($('#departmentName').val()));
    });
})();