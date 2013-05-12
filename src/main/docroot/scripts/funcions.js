/*$("#dataInici").datepicker({
    dateFormat: "dd-mm-yy",
    firstDay: 1,
    dayNamesMin: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
    dayNamesShort: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
    monthNames:
        ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol",
        "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
    monthNamesShort:
        ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul",
        "Ago", "Set", "Oct", "Nov", "Dec"]
});*/

//Inicialitzem l'api del calendari
var initDatePicker = function() {

    //datepicker individual
    $( ".datepicker" ).datepicker({ dateFormat: 'dd-mm-yy' });

    //datapicker per fer interval de dates
    $( ".from" ).datepicker({
        dateFormat: 'dd-mm-yy',
        firstDay: 1,
        dayNamesMin: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
        dayNamesShort: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
        monthNames:
            ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol",
            "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
        monthNamesShort:
            ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul",
            "Ago", "Set", "Oct", "Nov", "Dec"],
        defaultDate: "+1w",
        minDate: new Date(),
        changeMonth: true,
        numberOfMonths: 1,
        showOtherMonths: true,
        selectOtherMonths: true
    });
    
    $( ".to" ).datepicker({
        dateFormat: 'dd-mm-yy',
        firstDay: 1,
        dayNamesMin: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
        dayNamesShort: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
        monthNames:
            ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol",
            "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
        monthNamesShort:
            ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul",
            "Ago", "Set", "Oct", "Nov", "Dec"],
        defaultDate: "+1w",
        minDate: new Date(),
        changeMonth: true,
        numberOfMonths: 1,
        showOtherMonths: true,
        selectOtherMonths: true
    });
};

//Funcio per fer validacions de formularis
//Per poder validar un formulari hem d'afegir a la declaracio del form class="validarFormulari"
//Per poder fer validacio d'un selector d'un formulari hem d'afegir-li la classe required (class="required")
//En el cas que el formulari tingui un rang de dates i les volguem validar he d'afegir al form
var validaFormulari = function ( form ) {

    jQuery.extend(jQuery.validator.messages, {
        required: "",
        remote: "Please fix this field.",
        email: "Email incorrecte.",
        url: "Please enter a valid URL.",
        date: "Data incorrecte.",
        dateISO: "Format data incorrecte.",
        number: "Número incorrecte.",
        digits: "Please enter only digits.",
        creditcard: "Please enter a valid credit card number.",
        equalTo: "Please enter the same value again.",
        accept: "Please enter a value with a valid extension.",
        maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
        minlength: jQuery.validator.format("Please enter at least {0} characters."),
        rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
        range: jQuery.validator.format("Please enter a value between {0} and {1}."),
        max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
        min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
    });

    var formulari = "#"+form;
    
    //Valida tots els selectors del formulari que tenen class="required"
    $(formulari).validate();
    
    //Valida un rang de dates, afeh¡gir la classe to a la data inici i from a la data de fi
    if(($(formulari).find(".from").length != 0) && ($(formulari).find(".to").length != 0)) {
        var idDataInici = '#'+$(formulari).find(".from").attr('id');
        var idDataFi = '#'+$(formulari).find(".to").attr('id');

        $(formulari).find(".from").rules("add", {
            required: true, 
            dpDate: true,
            catalanDate: true,
            dpCompareDate: ['before', idDataFi] 
        });

        $(formulari).find(".to").rules("add", {
            required: true, 
            dpDate: true,
            catalanDate: true,
            dpCompareDate: {after: idDataInici} 
        });
    }

    //Valida un email, afegir classe email al selector i comprova que tingui @ i .com, .cat, .net, ...
    if($(formulari).find(".email").length != 0) {
        $(formulari).find(".email").rules("add", {
            email: true
        });
    }

};

// Login
var initLogin = (function() {
    var button = $('#loginButton');
    var box = $('#loginBox');
    var form = $('#loginForm');
    button.removeAttr('href');

    //Consultem al servidor si el client tenia una sessio activa i hi figura com autenticat:
    $.ajax({
        type: "GET",
        url: "/api/auth",
        contentType: "application/json",
        success: function(authUser){
            console.log(authUser);
            if(authUser.logged){
                $("#login").val("Sign out");
                $("#login").addClass("logout");
                $("#femail").addClass("template");
                $("#fpass").addClass("template");
                $("#fcheckbox").addClass("template");
                $("#forgot").addClass("template");
                $("#navigation > div").addClass("privAdmin");
                $("#navigation li.admin").removeClass("template");
                $("#lRegistre").addClass("template");
                $("#spanLogin").html(authUser.nom);
                console.log("Usuari Autenticat");
            }else{
                console.log("Usuari No Autenticat");
            }
        },
        error: function(){
          console.log("Error");
        }
    });

    button.mouseup(function(login) {
        box.toggle();
        button.toggleClass('active');
    });
    form.mouseup(function() {
        return false;
    });
    $("#loginForm").submit(function(e){
        e.preventDefault();
        if($("#login").hasClass("logout")){
            $.ajax({
                type: "GET",
                url: "/api/logout",
                contentType: "application/json",
                success: function(logoutSucces){
                    console.log("Logout: "+logoutSucces);
                    if(logoutSucces){
                        $("#login").val("Sign in");
                        $("#login").removeClass("logout");
                        $("#femail").removeClass("template");
                        $("#fpass").removeClass("template");
                        $("#fcheckbox").removeClass("template");
                        $("#forgot").removeClass("template");
                        $("#navigation > div").removeClass("privAdmin");
                        $("#navigation li.admin").addClass("template");
                        $("#lRegistre").removeClass("template");
                        $("#spanLogin").html("Login");
                        window.location="/Inici";
                        console.log("Logout OK");
                    }else{
                        console.log("Logout Failed");
                    }
                },
                error: function(){
                  console.log("Error");
                }
            });
        }
        else{
            var email = $("#email").val();
            var pass = $("#password").val();
            $.ajax({
                type: "GET",
                url: "/api/login?user="+email+"&pass="+pass,
                contentType: "application/json",
                success: function(loginSucces){
                    console.log("Login: "+loginSucces);
                    if(loginSucces){
                        if(!$("#loginFailed").hasClass("template")) $("#loginFailed").addClass("template");
                        $("#login").val("Sign out");
                        $("#login").addClass("logout");
                        $("#femail").addClass("template");
                        $("#fpass").addClass("template");
                        $("#fcheckbox").addClass("template");
                        $("#forgot").addClass("template");
                        $("#navigation > div").addClass("privAdmin");
                        $("#navigation li.admin").removeClass("template");
                        $("#lRegistre").addClass("template");
                        $("#spanLogin").html(email)
                        console.log("Login OK");
                    }else{
                        $("#loginFailed").removeClass("template");
                        console.log("Login Failed");
                    }
                },
                error: function(){
                  console.log("Error");
                }
            });
        }
    });

    $(this).mouseup(function(login) {
        if(login.target != $("#loginBox")[0] && login.target != $("#spanLogin")[0]){
            button.removeClass('active');
            box.hide();
        }
        /*
        if(!($(login.target).parent('#loginButton').length > 0)) {
            button.removeClass('active');
            box.hide();
        }
        */
    });

});

function checkpass() {
    if ($("#passReg1").val() != $("#passReg2").val() || $("#passReg1").val() == "" || $("#passReg2").val() == "")
    {
        $("#passReg1").addClass('errorPass')
        $("#passReg2").addClass('errorPass')
        $("#passReg1").removeClass('correctPass')
        $("#passReg2").removeClass('correctPass')
        return false;
    }
    else {
        $("#passReg1").addClass('correctPass')
        $("#passReg2").addClass('correctPass')
        $("#passReg1").removeClass('errorPass')
        $("#passReg2").removeClass('errorPass')
        return true;
    }
};

$(document).ready( function() {
   $("#formReg").submit( function () {
           if (checkpass()) {
               console.log("pass correct")
               return true;
             }
             console.log("error no pass correct")
             return false;
      });
});

/*$("#formReg").submit(function() {
    alert("heheheheheh")

});*/