(function(){
    var mng = $('#mngCheck')[0].checked;
    document.employeeForm.onsubmit = () => {
        return false;
    }
    // listeners
    $('#firstName').on('keyup focusout', () => {
        alert.in01(!strings($('#firstName').val()));
    });
    $('#lastName').on('keyup focusout', () => {
        alert.in02(!strings($('#lastName').val()));
    });
    $('#email').on('keyup focusout', () => {
        alert.in03(!email($('#email').val()));
    });
    $('#SSN').on('keyup focusout', () => {
        alert.in04(!ssn($('#SSN').val()));
    });
    $('#addressStreet').on('keyup focusout', () => {
        alert.in05(!strings($('#addressStreet').val()));
    });
    $('#addressCity').on('keyup focusout', () => {
        alert.in06(!strings($('#addressCity').val()));
    });
    $('#addressState').on('keyup focusout', () => {
        alert.in07(!strings($('#addressState').val()));
    });
    $('#addressPostal').on('keyup focusout', () => {
        alert.in08(!strings($('#addressPostal').val()));
    });
    $('#mngCheck').on('click', () => {
        if (mng) alert.in09(!strings($('#employeeManagerNum').val()));
        else alert.in09(false);
    });
    $('#employeeManagerNum').on('keyup focusout', () => {
        alert.in09(!strings($('#employeeManagerNum').val()));
    });
    $('#hireDate').on('focusout change', () => {
        alert.in10(!hireDate($('#hireDate').val()));
    });

    $('#mngCheck').click(() => {
        $('#employeeManagerNum').prop('disabled', (i, a) => {
            if(!a) $('#employeeManagerNum').attr('required');
            else $('#employeeManagerNum').prop('required', (j, b) => { return !b });
            mng = !a;
            return mng;
        });
    });

    $('#update-form').click(() => {
        if (validateForm()) document.employeeForm.submit();
    });

    // triggers
    var alert = {
        in01: con => {
            if(con)
                $('#in-01').show();
            else
                $('#in-01').hide();
        },
        in02: con => {
            if(con)
                $('#in-02').show();
            else
                $('#in-02').hide();
        },
        in03: con => {
            if(con)
                $('#in-03').show();
            else
                $('#in-03').hide();
        },
        in04: con => {
            if(con)
                $('#in-04').show();
            else
                $('#in-04').hide();
        },
        in05: con => {
            if(con)
                $('#in-05').show();
            else
                $('#in-05').hide();
        },
        in06: con => {
            if(con)
                $('#in-06').show();
            else
                $('#in-06').hide();
        },
        in07: con => {
            if(con)
                $('#in-07').show();
            else
                $('#in-07').hide();
        },
        in08: con => {
            if(con)
                $('#in-08').show();
            else
                $('#in-08').hide();
        },in09: con => {
            if(con)
                $('#in-09').show();
            else
                $('#in-09').hide();
        },in10: con => {
            if(con)
                $('#in-10').show();
            else
                $('#in-10').hide();
        }
    };

    // validation functions
    function validateForm() {
        let form = document.employeeForm;
        if (!strings(form.firstName.value)) { alert.in01(true); return false;}
        if (!strings(form.lastName.value)) { alert.in02(true); return false;}
        if (!email(form.email.value)) { alert.in03(true); return false;}
        if (!ssn(form.SSN.value)) { alert.in04(true); return false;}
        if (!strings(form.addressStreet.value)) { alert.in05(true); return false;}
        if (!strings(form.addressCity.value)) { alert.in06(true); return false;}
        if (!strings(form.addressState.value)) { alert.in07(true); return false;}
        if (!strings(form.addressPostal.value)) { alert.in08(true); return false;}
        if (!managerNum(form.employeeManagerNum.value)) { alert.in09(true); return false;}
        if (!hireDate(form.hireDate.value)) { alert.in10(true); return false;}
        return true;
    }
    function strings(data) {
        if (data.length > 0) return true;
        return false;
    }
    function email(data) {
        if (data.match(/^\S+@\S+\.\S+$/i)) return true;
        return false;
    }
    function ssn(data) {
        if (data.match(/^\d{3}-\d{2}-\d{4}$/))
            return true
        return false;
    }
    function managerNum(data) {
        if (mng) {
            if (data.length > 0)
            return true;
        } else return true;
        return false;
    }
    function hireDate(data) {
        if (data.match(/^\d{4}\-\d{2}\-\d{2}$/) || data.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/))
            return true
        return false;
    }
})();